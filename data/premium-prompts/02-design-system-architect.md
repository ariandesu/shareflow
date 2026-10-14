# Design System Architect — 12 Practical Prompt Blueprints

**Product summary:** Reusable prompts for planning and building a coherent, accessible design system for a SaaS web app: foundations, tokens, components, states, and validation.
**Suggested price:** BDT 69 / USD 1.49 (adjust in store)
**Gumroad listing title:** Design System Architect — 12 UI Token & Component Prompts

## Usage
Use prompts with your existing design/code assistant. Replace bracketed details with actual product constraints. Feed generated tokens and components into your project; do not treat generated accessibility claims as verified until tested. This pack does not include a software library or guarantee WCAG compliance.

## Foundation context (append to each prompt)
Product: [PRODUCT]. Audience: [AUDIENCE]. Brand qualities: [3 ADJECTIVES]. Existing stack: [FRAMEWORK, CSS APPROACH, COMPONENT LIBRARY]. Brand accent: [HEX]. Neutral palette preference: [WARM/COOL]. Required themes: [LIGHT/DARK]. Accessibility target: [TARGET]. Avoid: [ANTI-PATTERNS]. Reuse the project's existing stack and naming conventions. Ask clarifying questions when inputs conflict. Return implementation-ready artifacts plus assumptions and a short validation checklist; don't claim testing occurred unless it actually did.

## 1 — Audit existing UI foundations
Inspect the supplied screenshots, code, or component inventory and produce a design-system audit. Report existing colors, typography, spacing, radii, elevations, breakpoints, and interaction patterns. Cite the input element or file for every observation. Separate observed facts from proposed changes. Identify inconsistencies and accessibility risks without silently redesigning unrelated areas. Finish with a prioritized migration plan and a list of unknowns.

## 2 — Semantic color roles
Define semantic color roles for [PRODUCT] across light and dark themes: canvas, surface, elevated surface, text-primary, text-secondary, border, focus, brand, interactive, success, warning, danger, and informational. Propose a compact set of base color ramps and map semantic tokens to them. Provide CSS custom properties and a JSON token representation. Check text/background pairs against the requested contrast target using actual contrast calculations; mark any unverified pair. Do not rely on hue alone to communicate status.

## 3 — Type scale and content rules
Create a responsive type scale for [PRODUCT] with font roles, sizes, line heights, weights, letter spacing, and usage guidance. Provide CSS variables and examples for page title, section heading, body, caption, code, and button. Include guidance for long labels, localization, zoom, and minimum readable sizes. Do not reference unlicensed font files; use the existing project fonts or system fallbacks.

## 4 — Spacing, sizing, and breakpoints
Propose a spacing and sizing scale for the supplied interface. Include layout gutters, content max-widths, form controls, icon sizes, target hit areas, and responsive breakpoints. Explain when to use grid vs flex. Provide CSS variables and a compact responsive example. Avoid arbitrary one-off spacing unless a measured design constraint requires it.

## 5 — Radius, borders, and elevation
Create a small set of radius, border-width, shadow/elevation, and overlay tokens for [PRODUCT]. Define where each belongs (input, card, modal, popover, selected item). Keep elevation meaningful across themes; avoid using shadows to represent focus. Provide CSS variables and a preview component matrix.

## 6 — Button family
Design primary, secondary, tertiary, destructive, and icon-only buttons. Specify dimensions, typography, icon gaps, hover, pressed, focus-visible, disabled, and loading states. Include accessible names for icon-only actions, `aria-busy` where appropriate, and clear contrast requirements. Return a typed React component API only if the project uses React; otherwise follow the provided framework.

## 7 — Form components and validation
Specify text input, textarea, select, checkbox, radio, switch, helper text, error, and success patterns. Show label/help/error associations in semantic markup. Define required/optional conventions, inline validation timing, and server-error placement. Never rely on placeholder-only labels. Include keyboard and screen-reader behavior.

## 8 — Data tables and dense lists
Design an accessible data-table pattern for [DATA TYPE]. Define column hierarchy, row actions, sorting announcements, selection, responsive strategy, empty/loading/error states, and overflow behavior. On small screens, choose a deliberate card layout or horizontal scroll with a visible affordance. Don't add pagination, bulk actions, or sorting unless the data/API supports them.

## 9 — Feedback states and notifications
Build a feedback language and component spec for inline errors, banners, toasts, progress, confirmation, and empty states. Provide concise example copy for [PRODUCT]. Distinguish retryable network failures from validation errors and success. Announce important updates accessibly; do not rely on color or transient motion alone. Avoid fake success states.

## 10 — Navigation and overlays
Design navigation patterns for desktop/mobile and modal, drawer, tooltip, and popover behavior. Define focus entry/return, Escape handling, focus trapping where appropriate, click-outside behavior, stacking order, and deep-link support. Do not let background events steal focus or open surfaces. Follow the app's current router and shell.

## 11 — Token-to-code implementation
Translate the approved token map into [CSS VARIABLES / TAILWIND THEME / EXISTING TOKEN FORMAT]. Inspect the actual project configuration first. Preserve existing conventions, do not add dependencies, and avoid duplicating tokens. Provide the smallest relevant patch and explain how the existing components consume it. Include a token consistency check that tests relationships rather than freezing palette values.

## 12 — System review and handoff
Review the supplied implementation against the agreed tokens and component patterns. Return a table of deviations with file/component, observed issue, severity, suggested minimal fix, and test needed. Check keyboard focus, semantic labeling, contrast, responsive overflow, reduced motion, and loading/error states. Separate verified issues from assumptions. Do not claim WCAG conformance without measured evidence.

## Included deliverable guidance
Provide this Markdown file as the prompt text product. The generated prompts are templates to guide design work; users need their own AI design/code tools and any relevant product inputs. No third-party design assets are bundled.
