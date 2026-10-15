#!/usr/bin/env bash
# One Amazon SP-API report, from the ask to a document in the seller's tree.
#
#   report.sh <reportType> --origin <origin> --marketplace <id>[,<id>...] [--start <ISO 8601>] [--end <ISO 8601>]
#             [--option <name>=<value>]... --wait <seconds> [--every <seconds>]
#
# Every call goes through `cx raw amazon-sp-api`. The ask lands in <tree>/reports/<reportType>/<ask>/ with
# receipt.json (the report id and Amazon's processingStatus), each reply as Amazon gave it, and the document.
# A landed receipt of the same ask is read instead of creating again; with no --option, getReports is asked
# for a matching report first. One wait, its ceiling --wait: a report still queued then ends the run with its
# id and status (exit 3), and the next run resumes that id. No limiter and no retry of its own.
# Exit: 0 Amazon's terminal status (DONE, CANCELLED, FATAL); 1 a call or the download failed; 2 usage; 3 still queued.
set -uo pipefail

TREE="${TENANT_TREE:-/tenant}"
API=/reports/2021-06-30

usage() { sed -n '4,5p' "$0" | sed 's/^# *//' >&2; exit 2; }
say() { printf '%s\n' "$*"; }

[ $# -ge 1 ] || usage
type="$1"; shift
case "$type" in -*|'') usage ;; esac
origin='' marketplaces='' start='' end='' wait='' every=30
options=()
while [ $# -gt 0 ]; do
  case "$1" in
    --origin) origin="${2-}"; shift 2 ;;
    --marketplace) marketplaces="${2-}"; shift 2 ;;
    --start) start="${2-}"; shift 2 ;;
    --end) end="${2-}"; shift 2 ;;
    --option) case "${2-}" in *=*) options+=("$2") ;; *) usage ;; esac; shift 2 ;;
    --wait) wait="${2-}"; shift 2 ;;
    --every) every="${2-}"; shift 2 ;;
    *) usage ;;
  esac
done
[ -n "$origin" ] && [ -n "$marketplaces" ] && [ -n "$wait" ] || usage
case "$wait$every" in *[!0-9]*) usage ;; esac
[ "$every" -gt 0 ] || usage

ask=$(jq -nS --arg origin "$origin" --arg type "$type" --arg m "$marketplaces" --arg start "$start" --arg stop "$end" \
  --args '{origin: $origin, reportType: $type, marketplaceIds: ($m | split(",")),
    dataStartTime: (if $start == "" then null else $start end), dataEndTime: (if $stop == "" then null else $stop end),
    reportOptions: ($ARGS.positional | map(capture("^(?<k>[^=]+)=(?<v>.*)$") | {(.k): .v}) | add)}' "${options[@]+"${options[@]}"}") || usage
key="${marketplaces//,/+}_${start:-open}_${end:-open}_$(printf '%s' "$ask" | cksum | cut -d' ' -f1)"
dir="$TREE/reports/$type/${key//[:\/]/-}"
receipt="$dir/receipt.json"
mkdir -p "$dir" || exit 1

now() { date -u +%Y-%m-%dT%H:%M:%SZ; }
next() { local n=1; while [ -e "$dir/$1-$n.json" ]; do n=$((n + 1)); done; printf '%s-%s' "$1" "$n"; }

# cx <name> <method> <path> [cx raw flags...]: the reply lands as <name>.json, cx's own receipt as <name>.cx.json.
call() {
  local name="$1" method="$2" path="$3"; shift 3
  cx raw amazon-sp-api --origin "$origin" --method "$method" --path "$path" "$@" --output "$dir/$name.json" --json >"$dir/$name.cx.json"
  local code=$?
  if [ "$code" -ne 0 ]; then
    say "cx raw $method $path ended with exit $code: $(jq -c 'if (.paths | length) > 0 then .paths[0] | {outcome, http_status} else .refusal // . end' "$dir/$name.cx.json" 2>/dev/null || cat "$dir/$name.cx.json")"
    say "Amazon's reply, if any: $dir/$name.json; cx's receipt: $dir/$name.cx.json"
    return 1
  fi
}

record() { # record <jq filter> [jq args...]: rewrite receipt.json through a filter
  local filter="$1"; shift
  local base='{}'; [ -f "$receipt" ] && base=$(cat "$receipt")
  printf '%s' "$base" | jq --argjson ask "$ask" --arg at "$(now)" "$@" ".ask = \$ask | .updatedAt = \$at | $filter" >"$receipt.new" && mv "$receipt.new" "$receipt"
}

finish() { # the run's last line: status, id, where it is
  local status id file
  status=$(jq -r '.processingStatus // "unknown"' "$receipt"); id=$(jq -r '.reportId' "$receipt"); file=$(jq -r '.document // empty' "$receipt")
  case "$status" in
    DONE|FATAL) say "$status $id ${file:+$dir/$file}"; exit 0 ;;
    CANCELLED) say "CANCELLED $id"; exit 0 ;;
    *) say "$status $id since $(jq -r '.createdTime // "unknown"' "$receipt") $receipt"; exit 3 ;;
  esac
}

terminal() { case "$1" in DONE|CANCELLED|FATAL) return 0 ;; *) return 1 ;; esac; }

report_id=''
if [ -f "$receipt" ]; then
  status=$(jq -r '.processingStatus // ""' "$receipt")
  report_id=$(jq -r '.reportId // ""' "$receipt")
  if terminal "$status" && { [ "$status" = CANCELLED ] || [ -n "$(jq -r '.document // empty' "$receipt")" ] || [ "$(jq -r '.reportDocumentId // ""' "$receipt")" = "" ]; }; then
    finish
  fi
fi

if [ -z "$report_id" ] && [ ${#options[@]} -eq 0 ] && [ -n "$start" ] && [ -n "$end" ]; then
  name=$(next reports)
  call "$name" GET "$API/reports" --query "reportTypes=$type" --query "marketplaceIds=$marketplaces" \
    --query "processingStatuses=IN_QUEUE,IN_PROGRESS,DONE" || exit 1
  report_id=$(jq -r --argjson ask "$ask" '
    def t: if . == null then null else (sub("\\.[0-9]+"; "") | sub("(\\+00:00|Z)$"; "Z") | (try fromdateiso8601 catch .)) end;
    [.reports[]? | select((.marketplaceIds | sort) == ($ask.marketplaceIds | sort)
      and (.dataStartTime | t) == ($ask.dataStartTime | t) and (.dataEndTime | t) == ($ask.dataEndTime | t))]
    | (map(select(.processingStatus == "DONE")) + map(select(.processingStatus != "DONE")))[0].reportId // ""' "$dir/$name.json")
  [ -n "$report_id" ] && record '.reportId = $id | .source = "getReports"' --arg id "$report_id"
fi

if [ -z "$report_id" ]; then
  jq -c '{reportType, marketplaceIds} + (if .dataStartTime then {dataStartTime} else {} end)
    + (if .dataEndTime then {dataEndTime} else {} end) + (if .reportOptions then {reportOptions} else {} end)' <<<"$ask" >"$dir/create-body.json"
  call create POST "$API/reports" --header content-type=application/json --body "$dir/create-body.json" || exit 1
  report_id=$(jq -r '.reportId // ""' "$dir/create.json")
  [ -n "$report_id" ] || { say "createReport answered without a reportId: $dir/create.json"; exit 1; }
  record '.reportId = $id | .source = "createReport"' --arg id "$report_id"
fi

deadline=$((SECONDS + wait))
while :; do
  name=$(next report)
  call "$name" GET "$API/reports/$report_id" || exit 1
  record '. + ($r[0] | {processingStatus, createdTime, processingStartTime, processingEndTime, reportDocumentId}) | .lastRead = $file' \
    --slurpfile r "$dir/$name.json" --arg file "$name.json" || exit 1
  status=$(jq -r '.processingStatus // ""' "$receipt")
  terminal "$status" && break
  [ $((SECONDS + every)) -le "$deadline" ] || finish
  sleep "$every"
done

document_id=$(jq -r '.reportDocumentId // ""' "$receipt")
[ -n "$document_id" ] || finish

# The document's link is used here once and never printed; the landed reply keeps everything but the link.
call document GET "$API/documents/$document_id" || exit 1
url=$(jq -r '.url // ""' "$dir/document.json")
compression=$(jq -r '.compressionAlgorithm // ""' "$dir/document.json")
jq 'del(.url)' "$dir/document.json" >"$dir/document.json.new" && mv "$dir/document.json.new" "$dir/document.json"
[ -n "$url" ] || { say "getReportDocument answered without a link: $dir/document.json"; exit 1; }
if ! curl -sS --fail -o "$dir/document.download" "$url" 2>/dev/null; then
  say "the document's download failed; the next run asks getReportDocument for a fresh link"
  exit 1
fi
if [ "$compression" = GZIP ]; then
  gzip -dc "$dir/document.download" >"$dir/document.body" || { say "the GZIP document did not decompress: $dir/document.download"; exit 1; }
  rm -f "$dir/document.download"
else
  mv "$dir/document.download" "$dir/document.body"
fi
case "$(head -c 64 "$dir/document.body" | LC_ALL=C tr -d ' \t\r\n\357\273\277' | head -c 1)" in
  '{'|'[') ext=json ;;
  '<') ext=xml ;;
  *) ext=txt ;;
esac
stem=document; [ "$status" = FATAL ] && stem=fatal-explanation
mv "$dir/document.body" "$dir/$stem.$ext"
record '.document = $file | .compressionAlgorithm = (if $c == "" then null else $c end)' --arg file "$stem.$ext" --arg c "$compression"
finish
