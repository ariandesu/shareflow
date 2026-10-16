# Neo-Brutalist Food Delivery Checkout

- **Category:** Mobile App
- **Slug:** `neo-brutalist-food-delivery-checkout-e31201`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** mobile app, food delivery, checkout, cart, basket, neo-brutalism

---

## Architectural Philosophy & Overview
A neo-brutalist mobile food-delivery checkout/basket screen: thick ink outlines and hard offset shadows, line-item cards with quantity steppers, a promo-code row, an itemized order summary, and a bold purple "Proceed to pay" CTA.

---

## Production System Prompt Specification
```
{
  "summary": "A neo-brutalist mobile food-delivery checkout (basket) screen: a delivery-address banner, line-item cards with quantity steppers, an 'Add promo code' row, an itemized order summary (item total / discount / tax / total), and a bold primary 'Proceed to pay' button. Thick ink outlines + hard offset shadows give it a confident, distinctive look.",
  "style": {
    "description": "Neo-brutalism: thick ink borders, hard offset (non-blurred) shadows, a warm cream ground, soft pastel category tints, one purple CTA, a serif display headline.",
    "prompt": "Neo-brutalist system: 2px ink borders (#1c1714) + HARD offset shadows (solid, non-blurred) applied uniformly to every card/control. Warm cream grounds (#fffdfb / #fff6f1 / #ece6df), soft pastel tints per block (peach #feebe4/#fcd9c8, blue #eef6fd/#d9ecfb). ONE accent: purple #a091fb on the primary CTA + small active states. Two-face type pairing: Fraunces (serif display, for the 'Your basket' headline) + Plus Jakarta Sans (UI/body). Generous rounded corners despite the brutalist borders. Light, warm, confident."
  },
  "layout_and_structure": {
    "description": "Single mobile checkout screen: status bar, top nav (back + cart count), serif title, delivery-address banner, line-item cards, promo row, order summary, sticky pay CTA.",
    "prompts": [
      {"part": "Top bar", "prompt": "Status bar; a row with an outlined circular back button (left), a serif 'Your basket' title (center, with a small 'FRESHLY' eyebrow above), and an outlined cart button with a count badge (right)."},
      {"part": "Delivery banner", "prompt": "A peach-tinted bordered banner: a pin icon, 'DELIVER TO' label + address, and a chevron to change it; below it two small outlined pills (e.g. '25 min', 'Free delivery')."},
      {"part": "Line items", "prompt": "Bordered item cards, each with a tinted thumbnail, dish name + a short descriptor, price (right), and a quantity stepper (-, count, +) in an outlined pill."},
      {"part": "Promo row", "prompt": "A full-width bordered 'Add promo code' row with a tag icon and a trailing action button."},
      {"part": "Order summary", "prompt": "A bordered summary card: item total, discount (with a small 'saved $X' tag), tax & fees, then a bold Total in the serif/strong weight."},
      {"part": "Pay CTA", "prompt": "A bold full-width purple 'Proceed to pay ->' button with the neo-brutalist border + hard offset shadow, anchored at the bottom."}
    ]
  },
  "special_ui_components": [
    {"component": "Neo-brutalist card", "description": "The repeated container treatment.", "prompt": "A rounded card with a 2px ink border and a solid (non-blurred) offset shadow, e.g. 4px 4px 0 #1c1714, on a tinted or cream fill."},
    {"component": "Quantity stepper", "description": "Per-item count control.", "prompt": "An outlined pill with a minus button, the current count, and a plus button; ink borders, no blur."}
  ],
  "special_notes": "Apply the border + hard-offset-shadow system uniformly (consistency is what sells neo-brutalism). Keep purple to the CTA. Real mobile proportions (~390px-wide phone)."
}
```
