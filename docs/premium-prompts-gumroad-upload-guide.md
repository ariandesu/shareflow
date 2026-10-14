# ShareFlow Premium Prompt Packs — Gumroad Upload Guide

This checklist is for manually publishing the included prompt files. These are digital text prompt collections; each ZIP contains `PROMPTS.md`, a short README, and the original 1600×900 cover image `cover.png`.

## Product files

| Product | Suggested BDT | Suggested USD | Customer download | Cover image |
|---|---:|---:|---|---|
| Micro-SaaS Launch Kit | ৳49 | $0.99 | `dist/gumroad-products/micro-saas-launch-kit.zip` | `data/premium-covers/micro-saas-launch-kit.png` |
| Design System Architect | ৳69 | $1.49 | `dist/gumroad-products/design-system-architect.zip` | `data/premium-covers/design-system-architect.png` |
| WebGL Motion Studio | ৳79 | $1.99 | `dist/gumroad-products/webgl-motion-studio.zip` | `data/premium-covers/webgl-motion-studio.png` |
| B2B Commerce Blueprint | ৳59 | $1.29 | `dist/gumroad-products/b2b-commerce-blueprint.zip` | `data/premium-covers/b2b-commerce-blueprint.png` |
| AI Workflow Canvas | ৳89 | $1.99 | `dist/gumroad-products/ai-workflow-canvas.zip` | `data/premium-covers/ai-workflow-canvas.png` |

Prices are suggestions; confirm your region's checkout currency, fees, and final Gumroad price before publishing.

## Upload each product

1. In Gumroad, choose **New product → Digital product**.
2. Use the product title from the table.
3. Upload the matching `.zip` as the digital file.
4. Upload the matching `.png` as the cover. It is a 16:9 1600×900 original artwork file.
5. Write a short description based on the bundle's prompt list, not claims about software, guaranteed output quality, or included AI access.
6. Set the final price yourself. Add local-currency details only if Gumroad supports them for your account.
7. Save as draft and open the product preview. Confirm the cover, price, and the ZIP's files before publishing.
8. Copy the exact public Gumroad product URL. Do not reuse old starter-kit slugs.
9. In the ShareFlow admin prompt form, enter the matching title/tool/category/content and the copied Gumroad URL. SupportKori links must be confirmed real checkout/product links too; a generic profile URL should not be presented as if it guarantees this product's payment.

## Files

Editable source text: `data/premium-prompts/*.md`
Original cover art: `data/premium-covers/*.png`
Ready-to-upload ZIPs: `dist/gumroad-products/*.zip`
Machine-readable link/price manifest: `dist/gumroad-products/product-manifest.json`
