# Discord Suite - Thống kê doanh thu (Enhanced Animations)

- **Category:** Animation
- **Slug:** `discord-suite-thong-ke-doanh-thu-enhanced-animations`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** 

---

## Architectural Philosophy & Overview
A premium SaaS analytics dashboard style guide featuring a 'Discord Blurple' and emerald green color palette. The aesthetic combines clean minimal layouts with high-end micro-interactions, staggered entrance animations, and glassmorphism tooltips. It uses Inter for typography and JetBrains Mono for tabular data, making it ideal for fintech, gaming commerce, or high-performance business dashboards. Key features include animated SVG path drawing, shimmering progress bars, and floating background decorative elements.

---

## Production System Prompt Specification
```
{
  "summary": "A sophisticated data analytics dashboard design with a heavy focus on motion design and premium UI feedback. It utilizes a 240px fixed sidebar, sticky headers, and a responsive grid of card-based components with soft shadows and large corner radii.",
  "style": {
    "description": "Modern premium aesthetic using 'Discord Blurple' (#5865F2) as the primary brand color and Emerald (#10B981) for success states. Typography relies on Inter for readability and JetBrains Mono for financial/numerical accuracy. The style is defined by smooth cubic-bezier transitions, soft elevation on hover, and animated background gradients.",
    "prompt": "Create a design system using a primary palette of Discord Blurple (#5865F2), Emerald (#10B981), and Slate Grays (#f8fafc to #0f172a). \n\n**Typography:** \n- Body: Inter (Weights: 400, 500, 600, 700). \n- Numbers: JetBrains Mono with `font-variant-numeric: tabular-nums` for data alignment.\n- Headings: Bold Slate-900 with tight tracking.\n\n**Effects:**\n- Border Radius: 24px (cards), 12px (buttons/inputs).\n- Shadows: Light shadow-sm for static cards, elevating to shadow-xl with a colored glow (e.g., #5865F2/5) on hover.\n- Transitions: All interactive elements must use `transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1)`.\n- Background: Subtle animated blobs using blur(120px) with 20% opacity moving in a slow 15s loop.\n\n**Animations:**\n- Entrance: Cards should stagger in using a `fadeInUp` animation (translateY: 20px to 0, opacity 0 to 1) with 100ms delay increments.\n- Counters: Use a 'pop' animation for numbers (`scale(0.95)` to `scale(1)` with a slight blur transition)."
  },
  "layout_and_structure": {
    "description": "A classic dashboard layout with a fixed left-side navigation, a utility-focused top header, and a main content area using a bento-style grid for KPI cards and data visualizations.",
    "prompts": [
      {
        "part": "Sidebar Navigation",
        "prompt": "Fixed 240px width sidebar. White background with a subtle right border (#e2e8f0). Top section features the logo with a 36x36 rounded-xl icon container. Navigation items use 13px font-size, 40ms transitions, and indicate the active state with a left-side 4px thick border in #5865F2 and a light blue tint background. Bottom section contains a bordered currency/rate converter widget."
      },
      {
        "part": "Sticky Header",
        "prompt": "64px height (h-16) white header with 80% opacity and backdrop-filter: blur(12px). Features a search/title section on the left, and utility buttons (notifications, user profile) on the right. The 'Quick Action' button is a bold #5865F2 CTA with a scale-down effect on click (active:scale-95)."
      },
      {
        "part": "KPI Grid",
        "prompt": "Three-column grid of cards. Each card has a 24px internal padding (p-7), a 48x48 icon container in a tinted background (e.g., blue-50 for revenue), and large 30px mono-spaced headings for primary metrics. Include a small badge in the top right for percentage changes (+100% vs last period)."
      },
      {
        "part": "Main Analytics Section",
        "prompt": "A 12-column grid layout where the primary chart takes 8 columns and the rankings take 4. The chart card must feature a time-period selector (7d, 30d, 90d) in a pill-shaped container. Data paths in the SVG chart should animate using `stroke-dashoffset` for a 'drawing' effect over 2.5s."
      },
      {
        "part": "Bottom Insights and Footer",
        "prompt": "Grid of 3 cards for AI-generated insights. Use background tints (Emerald-50, Amber-50, Indigo-50) to differentiate categories (Growth, Alert, Opportunity). The footer is a simple horizontal layout with social icons that scale 125% on hover and copyright text in 11px font."
      }
    ]
  },
  "special_ui_components": [
    {
      "component": "Shimmering Progress Bar",
      "description": "Interactive ranking bars with a continuous light reflection effect.",
      "prompt": "A 8px height progress bar container with a light gray background. The inner progress bar uses a gradient (e.g., Amber-400 to Amber-500) and an overlay `::after` element with a linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent) that animates from `left: -100%` to `100%` every 2s to create a premium shimmer."
    },
    {
      "component": "Animated SVG Spline Chart",
      "description": "A dual-line chart with interactive tooltips and glowing points.",
      "prompt": "SVG chart with two paths (#5865F2 and #10B981) using `stroke-width: 3.5`. Beneath each line, a linear gradient fill provides a soft 'area' effect. Hovering over a data point shows a 'glass-tooltip' (white, 85% opacity, 12px blur) with detailed tabular metrics. Data points pulse using a 3s ease-in-out scale animation."
    },
    {
      "component": "Pulse FAB",
      "description": "Floating action button with a breathing animation.",
      "prompt": "64x64 fixed button at the bottom-right. Background color #5865F2. Features a surrounding glow achieved via a secondary div with `animate-pulse-soft` (scale 1 to 1.05 and opacity 1 to 0.8). Icon inside rotates 12 degrees on hover."
    }
  ]
}
```
