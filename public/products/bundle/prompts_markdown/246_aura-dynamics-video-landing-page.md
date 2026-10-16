# Aura Dynamics - Video Landing Page

**Category:** Landing Page  
**Tags:**   
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/5db5b517-5cbc-411a-a2c4-8b6236aba5b8](https://p.superdesign.dev/draft/5db5b517-5cbc-411a-a2c4-8b6236aba5b8)  
**Local Standalone Preview:** `previews/aura-dynamics-video-landing-page.html`

---

## Architectural & Aesthetic Breakdown
A premium cinematic landing page design system featuring a full-screen immersive video background, high-end editorial typography, and a dark glassmorphism aesthetic. Optimized for luxury brands, creative studios, high-end SaaS, and digital storytelling platforms. Key elements include the 'Clash Grotesk' display font, 'Plus Jakarta Sans' body font, radial and linear video overlays for readability, and sophisticated motion physics using cubic-bezier transitions. The style uses a minimalist monochrome palette with subtle gradients to achieve a high-production-value look.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{
  "summary": "Create a high-impact, premium landing page defined by a full-screen video background, ultra-wide display typography, and a minimalist dark UI. The design leverages transparency, blur effects (glassmorphism), and staggered reveal animations to create an immersive user experience.",
  "style": {
    "description": "The style is 'Cinematic Luxury' characterized by high contrast between dark backgrounds and crisp white typography. It uses 'Clash Grotesk' for dramatic, geometric headers and 'Plus Jakarta Sans' for modern, legible body text. Visual depth is created through radial and linear overlays (black to transparent) over video content. Components utilize glassmorphism (thin borders, background blur) and magnetic interaction states.",
    "prompt": "### Visual Style Guide\n- **Color Palette:** Primary Black (#000000), Primary White (#FFFFFF), Secondary Gray (#9CA3AF), Dark Gray (#374151). Glass background: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(12px)`.\n- **Typography:** \n  - **Display:** 'Clash Grotesk', Sans-Serif. Weights: 200, 400, 600. Tracking: `tracking-tighter` for main headings, `tracking-[0.2em]` for labels.\n  - **Body:** 'Plus Jakarta Sans', Sans-Serif. Weights: 300, 400, 500. \n- **Overlays:** \n  - Radial: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)`.\n  - Linear: `linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)`.\n- **Animations:** \n  - **Reveal:** `opacity: 0` to `1`, `translateY(30px)` to `0`. Duration: 1.2s. Curve: `cubic-bezier(0.16, 1, 0.3, 1)`.\n  - **Magnetic Button:** `transform: scale(1.05)` on hover with transition `0.3s cubic-bezier(0.33, 1, 0.68, 1)`.\n- **Borders:** Thin 1px borders using `rgba(255, 255, 255, 0.1)` or `rgba(255, 255, 255, 0.3)`."
  },
  "layout_and_structure": {
    "description": "A centered, full-height layout where the video background is the foundation. Navigation and Footer are fixed/absolute at the screen edges, while content is vertically centered for maximum focus.",
    "prompts": [
      {
        "part": "Header / Navigation",
        "prompt": "Horizontal layout, `flex justify-between items-center`, padding `px-8 py-6`. Left side: Logo container with a 40x40 white circle and black icon. Center: Hidden on mobile, desktop shows navigation links in all-caps, `text-sm`, `tracking-widest`, `text-gray-300`. Right side: 'Contact' button with 1px `white/30` border, `rounded-full`, and invert-on-hover effect (white background, black text)."
      },
      {
        "part": "Hero Section",
        "prompt": "Vertically centered content, `min-h-[calc(100vh-100px)]`. Includes: \n1. **Badge:** Small text pill, `border-white/20`, `bg-white/5`, `tracking-[0.2em]` uppercase.\n2. **Headline:** Massive `text-6xl` to `text-9xl` font, `leading-[0.9]`. Use a mix of regular and italic weights. Apply a gray-to-white gradient to the italic word using `bg-clip-text`.\n3. **Description:** Max-width `2xl`, `text-gray-400`, `font-light`, `leading-relaxed`.\n4. **CTA Group:** Primary button (Solid white, black text, sliding background hover effect) and Secondary button (Outline circle with play icon, text-sm uppercase label)."
      },
      {
        "part": "Footer",
        "prompt": "Absolute bottom-0, full-width. Flex layout `justify-between`. Content: Social links on the left (Twitter, Instagram, Behance), Studio info in the center (includes a horizontal separator line `w-8 h-[1px] bg-gray-700`), and Copyright on the right. All text `text-[10px]` to `text-xs`, `text-gray-500`, uppercase, `tracking-[0.2em]`."
      },
      {
        "part": "Scroll Indicator",
        "prompt": "Centrally positioned 24px from bottom. Features a 48px vertical line with a top-to-bottom white-to-transparent gradient. Animation: `animate-bounce` with `opacity-50`."
      }
    ]
  },
  "special_ui_components": [
    {
      "component": "Magnetic Primary CTA",
      "description": "A high-interaction button that feels weighted and premium.",
      "prompt": "A pill-shaped button (`rounded-full`) with `px-10 py-5`. Text is `black`, background is `white`. Inside, a hidden div `bg-gray-200` sits at `translate-y-full`. On hover, the background div slides up to `translate-y-0`. The entire button scales by 1.05 using a smooth cubic-bezier curve."
    },
    {
      "component": "Glass Status Badge",
      "description": "Small notification or category indicator using glassmorphism.",
      "prompt": "Text-only container with `px-4 py-1.5`, `rounded-full`, 1px border `white/20`, background `white/5`. Text style: `text-xs`, `font-semibold`, `tracking-[0.2em]`, uppercase. Used for categorization or sub-headers above titles."
    },
    {
      "component": "Immersive Video Container",
      "description": "The base layer for the entire experience.",
      "prompt": "Absolute positioned `top-0 left-0 w-full h-full`. Video element must have `object-fit: cover` and CSS filters: `brightness(0.7) contrast(1.1)`. Must be wrapped by two overlay layers: a radial shadow for center focus and a linear bottom-heavy gradient for footer readability."
    }
  ]
}
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
