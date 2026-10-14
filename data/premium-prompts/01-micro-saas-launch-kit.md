# Micro-SaaS Launch Kit — 12 Production-Ready UI Prompts

**Listing summary:** A focused prompt collection for designing a polished micro-SaaS from its first landing page through authenticated product, billing, onboarding, and settings.

**Suggested listing price:** BDT 49 / USD 0.99 (adjust at checkout)
**Suggested Gumroad title:** Micro-SaaS Launch Kit — 12 UI Prompts for v0, Lovable & Bolt

## How to use
Paste the shared design brief, then append one module prompt. Replace every `[BRACKETED INPUT]` with your product details. Ask your coding/design agent to implement one page at a time and preserve the shared design system. Prompts specify interface design only; connect real auth, billing, analytics, and persistence separately and never use fake payment success in production.

## Shared design brief
You are a senior SaaS product designer and frontend engineer. Design a coherent, responsive interface for **[PRODUCT NAME]**, a [ONE-SENTENCE PRODUCT DESCRIPTION] for [TARGET AUDIENCE]. The product's main job is [CORE USER OUTCOME].

Use React and Tailwind CSS with accessible semantic HTML. Use the components already present in the project; do not install a new UI library unless asked. Establish a restrained design system: neutral canvas, one brand accent `[ACCENT COLOR]`, a clear type scale, consistent 4/8px spacing, subtle borders, and small purposeful shadows. Use a single-column mobile layout and a readable max-width desktop layout. Ensure keyboard focus visibility, labels, contrast, loading/empty/error/success states, and reduced-motion support. Do not invent customer logos, testimonials, statistics, or integrations; label illustrative data as sample data. Build reusable components, typed data, and meaningful responsive behavior. Before finishing, list assumptions and test the primary interaction.

## Module 1 — Conversion landing page
Using the shared design brief, create the public marketing page for [PRODUCT NAME]. Include a compact navigation, a specific hero headline that states the audience and outcome, a short subhead, primary and secondary CTA, and a product UI preview built from CSS rather than a stock hero image. Follow with three outcome-focused feature blocks, a short workflow section, a transparent pricing preview, FAQ accordion, and footer. Keep each section scannable. CTA links should use existing routes or clearly marked TODO destinations—do not invent working routes. Add mobile navigation and accessible focus states.

## Module 2 — Sign-up and sign-in
Create the sign-up and sign-in screens for [PRODUCT NAME]. Support email and password fields, password visibility, inline validation, accessible error messages, and a clear switch between modes. Include optional OAuth buttons only if the application already supports those providers; otherwise omit them. Include consent copy and links to the actual privacy/terms routes if available. Show loading and server-error states. Do not store credentials in local storage or claim authentication succeeded without an API response.

## Module 3 — First-run onboarding
Create a skippable, 3-step onboarding flow: (1) [USER ROLE / TEAM SIZE], (2) [PRIMARY GOAL], (3) [FIRST ACTION]. Show progress, Back, Continue, Skip, and a final confirmation. Make steps keyboard-accessible and preserve draft inputs during navigation. Validate required choices. Persist only through the project's existing API/state conventions; if none exist, implement a local component state and identify the persistence TODO.

## Module 4 — SaaS dashboard home
Design the authenticated overview for [PRODUCT NAME]. Prioritize one next action, then show up to four genuinely useful metrics from supplied data. Include a recent activity list and one empty state for a new account. Use consistent loading skeletons and an honest error state. Do not fabricate metrics: render values from typed props/data and display an em dash when unavailable. Make the dashboard useful at 360px width and with keyboard navigation.

## Module 5 — Core resource list
Create a searchable, filterable list for [RESOURCE, e.g. projects]. Provide sort, status filter, create action, row/card responsive layout, pagination only if data/API supports it, and distinct loading/empty/error states. Each row should expose the item's [PRIMARY IDENTIFIER], [STATUS], and [UPDATED TIME]. Add an accessible overflow menu with View/Edit/Archive only if corresponding actions exist. Keep filters reflected in URL query parameters when router conventions support it.

## Module 6 — Resource create/edit form
Build a validated form to create or edit [RESOURCE]. Fields: [FIELD LIST]. Group related inputs, explain constraints inline, preserve data on validation failure, prevent accidental duplicate submit, and provide save/cancel affordances. Use the existing API function and report its actual response; never fake success. Include a dirty-form navigation warning only if the app already has a pattern for it. After success, route to the resource detail or list page that exists.

## Module 7 — Resource detail
Create the detail page for [RESOURCE]. Establish a strong title/status header, key metadata, a clear primary action, and a chronological activity area if events are supplied. Provide edit and destructive actions with confirmation. Handle missing/deleted resource and permission-denied states. Render only fields present in the typed model. On mobile, stack metadata and actions without horizontal scrolling.

## Module 8 — Pricing and plan comparison
Create a pricing page for [PRODUCT NAME] using only the actual plan data below: [PLAN NAMES, PRICES, BILLING PERIODS, LIMITS, FEATURES]. Clearly state currency and billing cadence. Compare plans in a semantic table on desktop and readable cards on mobile. Mark the recommended plan only when supplied by product policy. Explain upgrade/downgrade behavior only when known. Checkout buttons must call the configured payment flow, show pending/failure states, and never imply a subscription was created before server confirmation.

## Module 9 — Checkout handoff
Implement the pre-checkout confirmation for [PLAN/PRODUCT]. Show selected plan, total, currency, billing cadence, and a back action. Validate coupon input through the real verification endpoint, distinguish invalid/expired/network errors, and prevent client-side price overrides. On Pay, call the existing server checkout endpoint and navigate only to its returned trusted checkout URL. Do not collect or store card numbers in this app.

## Module 10 — Billing and invoices
Create billing settings showing the current plan, renewal date only when provided, payment method summary returned in safe masked form, and invoice history. Add update/cancel actions only when the backend exposes them, with clear confirmation and resulting state. Do not display full card data or infer payment status from local state. Include empty/error states and accessible table labels.

## Module 11 — Team and invitations
Design [PRODUCT NAME]'s team settings. Show member name/email, role, invite status, and last activity only from provided data. Add invite form for email + allowed role; validate with the server's role list. Offer role change/remove only with permission and confirmation. Show pending invitation, error, and empty states. Avoid exposing private information to unauthorized users.

## Module 12 — Account, preferences, and danger zone
Build account settings for profile, timezone, notification preferences, and security. Use existing API contracts and explicit save feedback. Place deletion/export in a visually separate danger zone with a two-step confirmation and typed confirmation phrase. Never perform irreversible account actions from a single accidental click. Include responsive form labels, keyboard support, and clear cancellation.

## Quality checklist
- All page copy and data are specific to the supplied product, not template filler.
- No invented statistics, logos, testimonials, prices, features, auth, or checkout behavior.
- All controls are keyboard-accessible and have visible focus states.
- Mobile layout tested at 360px; no horizontal overflow.
- Empty/loading/error/success states are present where appropriate.
- Reuses the existing project's stack and components.
