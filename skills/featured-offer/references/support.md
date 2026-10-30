# The Support API and Seller Central's cases

Facts cite P-<file>-<n> in research/<angles|elements|method>/<file>.md; pointers cite none.

- The Support API v2025-02-01 has three operations, `listCases` (a POST search), `getCase` and `listContacts`; none opens, answers or closes a case (P-featured-offer-1).
- Each operation needs the restricted role Selling Partner Support, is for sellers only, and runs in NA, EU and FE; its sandbox is static (P-featured-offer-2).
- A case's status is `RESOLVED`, `TRANSFERRED`, `PENDING_MERCHANT_ACTION` or `PENDING_AMAZON_ACTION`, and its contacts carry the email, phone and chat history (P-featured-offer-3).
- The case routes Amazon's help pages name are in Seller Central: Pricing Health's self-service case for an outdated competitive price, and Selling Partner Support for a manipulated variation family (P-featured-offer-4).
- An appeal is in Amazon's structure: the violation and product, the cause, the reactive steps and the proactive steps, each factual and specific, never an earlier appeal reused (P-account-health-13).
- A role added to the application works only after the connection is authorised again (P-sp-api-access-13).
