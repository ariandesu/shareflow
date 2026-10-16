# Crisp Teal Chat

- **Category:** Mobile App
- **Slug:** `crisp-teal-chat-f179d9`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** mobile app, chat, messaging, conversation, teal, light ui

---

## Architectural Philosophy & Overview
A clean, fresh messaging/chat screen: white ground, teal outgoing bubbles and soft-grey incoming, a header with avatar + call/video, a timestamp divider, a link-preview card, a typing indicator, and an input bar with a teal send button.

---

## Production System Prompt Specification
```
{
  "summary": "A modern, friendly messaging / chat CONVERSATION screen: a header (back + avatar + name + 'Active now' + call / video / menu), a centered timestamp divider, incoming message bubbles (soft grey, with a small sender avatar) and outgoing bubbles (fresh teal, white text) with a 'Read' receipt, a link-preview card, a 'typing…' indicator, and a bottom input bar (+ , a rounded message field with an emoji icon, and a teal send button). Crisp and high-contrast.",
  "style": {
    "description": "Fresh teal messaging: white/light ground, teal/emerald outgoing bubbles + soft-grey incoming, clean and high-contrast.",
    "prompt": "Light, clean messaging. White / very-light ground (subtle dot texture ok), near-black text. Outgoing bubbles in fresh TEAL/emerald with white text (clears contrast); incoming bubbles in soft neutral grey with ink text. Teal is the single accent (outgoing bubbles, avatar ring, send button). Rounded bubble corners with the usual tail-side flattening. Clean sans font. NOT warm-clay, NOT slop-indigo; teal is a deliberate fresh-cool choice (genuinely apt for chat)."
  },
  "layout_and_structure": {
    "description": "Single mobile chat screen, vertical: status bar, chat header, timestamp divider, message bubbles (in/out), link preview, typing indicator, input bar.",
    "prompts": [
      {"part": "Header", "prompt": "Status bar; a chat header with a back chevron, a circular avatar (with an 'active' dot), the contact name + 'Active now', and call / video / overflow icons on the right."},
      {"part": "Timestamp divider", "prompt": "A small centered pill 'TODAY · 9:41 AM' separating the thread."},
      {"part": "Incoming bubbles", "prompt": "Left-aligned soft-grey bubbles with ink text, each with a small sender avatar; natural multi-line wrapping."},
      {"part": "Outgoing bubbles", "prompt": "Right-aligned fresh-teal bubbles with white text; a small right-aligned 'Read 9:42 AM' receipt under the last one."},
      {"part": "Link preview", "prompt": "A link-preview card (icon + title + domain + time) styled as an incoming attachment."},
      {"part": "Typing indicator", "prompt": "A small incoming bubble with three animated dots ('…')."},
      {"part": "Input bar", "prompt": "A bottom bar: a circular '+' (attach), a rounded 'Message …' field with an emoji icon, and a circular teal send button (arrow)."}
    ]
  },
  "special_ui_components": [
    {"component": "Two-tone bubbles", "description": "In vs out.", "prompt": "Incoming = soft grey + ink; outgoing = teal + white; rounded with tail-side corner flattening; comfortable line-height."},
    {"component": "Teal send button", "description": "The accent action.", "prompt": "A circular teal send button (paper-plane/arrow) at the end of the input bar."}
  ],
  "special_notes": "Teal is the single accent; keep incoming/outgoing contrast high. Real mobile proportions; reflow at 360/768. No warm clay, no slop-indigo."
}
```
