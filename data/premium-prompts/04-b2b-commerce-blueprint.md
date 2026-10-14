# B2B Commerce Blueprint — 12 Wholesale & Supplier Portal Prompts

**Product summary:** Practical prompts for designing supplier portals, bulk ordering, account pricing, and purchasing workflows.
**Suggested price:** BDT 59 / USD 1.29 (adjust in store)
**Gumroad listing title:** B2B Commerce Blueprint — 12 Wholesale Portal UI Prompts

## Shared product brief
Design for [BUYER TYPE] purchasing [PRODUCT CATEGORIES] from [SUPPLIER TYPE]. Typical order size: [KNOWN RANGE OR UNKNOWN]. Existing stack/API: [DETAILS]. Buyer roles: [ROLES]. Include only business rules supplied here; ask before assuming tax rules, credit terms, inventory guarantees, or shipping promises. Use realistic but clearly labeled sample data where needed. Build mobile-friendly, accessible forms and tables. Never claim a payment, credit approval, stock reservation, tax exemption, or order submission succeeded without backend confirmation.

## 1 — Buyer account overview
Create a buyer dashboard showing account status, recent orders, saved lists, invoices, and reorder actions from supplied data. Highlight only actionable information. Add honest empty/loading/error states. Clearly distinguish open orders from drafts and completed orders. Do not invent credit availability or delivery estimates.

## 2 — Supplier catalog
Design a searchable B2B catalog with SKU, product name, unit, pack size, customer-specific price, and availability only when returned by the API. Filters should reflect actual fields. Support keyboard navigation and mobile card layout. Don't display out-of-stock items as purchasable. Label price units and minimum quantities clearly.

## 3 — Bulk order matrix
Build a quick-order table accepting SKU and quantity for many line items. Validate known SKU, pack multiples, minimum order quantities, and limits through supplied business rules. Provide row-level errors and a review summary before submission. Preserve valid rows after errors and prevent duplicate submit. Design mobile fallback without tiny targets.

## 4 — Customer-specific tier pricing
Create a volume pricing display for [PRODUCT] using the provided tiers only. Explain which threshold applies and whether it is per-item, per-SKU, or cart total. Recompute subtotals using trusted server pricing before checkout. Do not calculate tax or shipping unless rules are supplied.

## 5 — Quote request
Build a quote request flow for [PRODUCTS/QUANTITIES]. Collect only necessary contact and delivery details, support draft review, and communicate that submission is a request—not an accepted quote—until confirmed by the supplier. Include a generated request reference only if returned by the API.

## 6 — Purchase order details
Design a purchase order detail view with PO number, buyer, line items, quantities, unit prices, status, and supplied delivery milestones. Support document download only if the backend returns a safe URL. Separate editable draft values from submitted order truth. Handle permission errors and cancelled orders.

## 7 — Repeat order
Create a reorder flow from a historical order. Allow users to select line items and update quantities, then validate current catalog availability and pricing server-side. Show unavailable/changed items before adding to cart. Never resubmit the old order automatically.

## 8 — Tax-exempt certificate workflow
Design a certificate upload/review interface only for jurisdictions and file types specified by the product. Explain that a document is pending review until approved. Include upload progress, retryable failure, removal before submission, and explicit privacy notice. Do not imply tax exemption is active based on upload alone.

## 9 — Multiple shipping locations
Build a location book with named addresses and delivery instructions. Mask sensitive details when unnecessary. Include add/edit/default/remove flows with confirmation. Validate addresses through the configured service if available; otherwise make no delivery guarantee. Confirm the selected location during order review.

## 10 — Invoice and payment terms
Create an invoice list and detail with due date, amount, currency, status, and payment method only when supplied. Clearly label net terms only when the account is approved and the API confirms them. Include accessible filters and downloadable invoice links from the server. Never surface complete payment-card data.

## 11 — Supplier inventory console
Design a supplier-facing inventory table for [FIELDS]. Support bulk edit only with explicit selection and review. Distinguish on-hand, allocated, and available quantities only if the domain model defines them. Handle stale data and concurrent edits. Do not imply inventory synchronization is instantaneous unless verified.

## 12 — Order issue and returns
Create an order support form to report [ISSUE TYPES], attach evidence if supported, and link to a specific order/line. Explain submission is a support request, not automatic return authorization. Include status tracking only from real API data and protect private buyer/supplier information.

## Release checklist
Validate price and quantities server-side; test unauthorized roles; test keyboard and mobile access; show explicit pending/error/success states; never assume jurisdictional tax/legal behavior; use only supplied checkout and inventory APIs; verify any claims against actual product rules.