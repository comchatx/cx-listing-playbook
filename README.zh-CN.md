这套方法教 cx 打理你的亚马逊 listing：创建新 listing，看每条 listing 表现如何、原因是什么，提出修改建议，事后判断修改有没有见效。

装上之后，cx 会：

- 按你的描述和产品资料，在你指定的站点创建 listing。提交前先给你看亚马逊自己的检查结果，你同意后才写入店铺。
- 从搜索到下单逐步检查一条 listing，说明它比上次检查时有什么变化，并读取亚马逊对这条 listing 给出的信息。
- 提出修改建议，附上理由和依据的数据，你同意后才提交。
- 每次修改都留一份记录：改前改后、预期效果和亚马逊的回执。
- 等观察期足够后，告诉你这次修改已见效、未见效，还是暂时无法确定。
- 分析 Buy Box：你的报价有没有拿到、为什么没拿到，以及哪些原因能在店铺里解决。

如果想让 cx 持续帮你盯一条 listing，再装上 cx-listing-watch。

## 试一试

- `/listing-create US,DE 新品上架，数据在 /tenant/products/new-router/，FBA 发货`
- `/listing-review <ASIN>`

## 用到的数据

- **Amazon SP-API**：你的亚马逊卖家账户，在 Amazon SP-API 插件里连接。cx 在这里读取你的 listing、报价和报告，只有你同意后才会修改。
- **Keepa**（如果你装了）：价格和排名的历史，以及竞品的 listing。

两者各是一个插件，价格见各自的页面。

## cx 把东西放在哪

- 每次修改一个文件，放在 `/tenant/listings/<ASIN>/changes/`。
- 亚马逊报告的原件，放在 `/tenant/reports/`。

这套方法给 cx 的每条事实都注明出处，出处在 [`research/`](research/README.md)。
