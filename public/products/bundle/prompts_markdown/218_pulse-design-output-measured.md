# Pulse — Design Output, Measured

**Category:** Dashboard  
**Tags:** card, dashboard, analytics, dark, navy, amber, stat-card, sparkline, metrics, saas  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/dfabd805-e684-4a4d-a203-b7223df73d93](https://p.superdesign.dev/draft/dfabd805-e684-4a4d-a203-b7223df73d93)  
**Local Standalone Preview:** `previews/pulse-design-output-measured.html`

---

## Architectural & Aesthetic Breakdown
Dark navy analytics dashboard with amber accents: sticky glass nav, hero, a 4-up grid of stat cards with SVG sparklines, plus a featured big-number card with a bar sparkline.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{
  "summary": "A dark, premium analytics dashboard ('Pulse \u2014 Design Analytics') on a deep navy canvas with warm amber accents and cream text. A sticky glass top nav sits above a hero band, a 4-up row of stat cards with SVG area sparklines, and a secondary row pairing one featured wide card (big number + bar sparkline) with two stacked stat cards. Grain texture, soft radial glows, and amber hairline sheens give it a refined, data-product feel.",
  "style": {
    "description": "Dark fintech/analytics aesthetic: near-black navy base (#06101f) with layered navy card gradients (#13294d -> #0b1f3a -> #0a1c34), warm amber (#f0b429) as the single accent, cream (#f6f1e7) text at varying opacities, and green/red (#34d399 / #f87171) reserved strictly for positive/negative deltas. Inter typeface across the board with extrabold (800) numerics in tabular-nums, hairline white borders (border-white/10), subtle radial grain, amber glow ring, and 1px gradient sheen lines along card tops.",
    "prompt": "Build a dark analytics UI on a deep navy background (#06101f) with two ambient radial glows (a large #13294d glow top-center blurred ~140px at 60% opacity, and a smaller amber/10 glow blurred ~130px on the right) plus a faint dotted grain overlay (radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size:4px 4px) at ~60% opacity. Cards use a 'card-sheen' fill: radial-gradient(120% 120% at 0% 0%, rgba(240,180,41,0.10) 0%, rgba(240,180,41,0) 42%), linear-gradient(180deg, #13294d 0%, #0b1f3a 60%, #0a1c34 100%) with a 1px white/10 border, rounded-2xl corners, and a top edge hairline (linear-gradient from transparent via amber/40 to transparent). Use Inter (weights 400-900) with tabular-nums for all metrics; primary numbers extrabold and tight-tracked. Single accent color amber #f0b429 (hover #f7cf6b); positive deltas in green #34d399 on bg pos/12, negative deltas in red #f87171 on bg neg/12. Text is cream #f6f1e7 with dim variant #b9b09c for labels. Set ::selection background to #f0b429 with #0b1f3a text."
  },
  "layout_and_structure": {
    "description": "Single centered column, max-width ~72rem (max-w-6xl), 1.5rem horizontal padding. Vertical order: sticky glass nav -> hero/section-head band -> 4-column primary stat-card grid -> secondary 3-column grid (featured wide card spanning 2 cols + a stacked pair) -> hairline footer. Fully responsive: stat grid reflows 1 -> 2 -> 4 columns; secondary grid reflows 1 -> 3 columns; hero stacks vertically below sm.",
    "prompts": [
      {
        "part": "Sticky glass nav",
        "prompt": "A sticky top header (sticky top-0 z-50) with a bottom border-white/10 and a translucent backdrop: bg-[#06101f]/80 with backdrop-blur-xl. Inside, a max-w-6xl row at h-16, items center, space-between. Left: an 8x8 rounded-lg amber (#f0b429) square holding a lucide:activity icon in navy, then bold 'Pulse' wordmark, then a small pill (border-white/10, uppercase 10px, cream-dim) reading 'Design Analytics' (hidden below sm). Center: nav links (Overview, Experiments, Library, Reports) at 13px medium cream/70, hover cream, hidden below md. Right: a bordered ghost 'Last 30 days' button with a lucide:calendar icon (hidden below lg) plus a solid amber 'New report' button (navy text, bold, hover amber-soft #f7cf6b)."
      },
      {
        "part": "Hero / section head",
        "prompt": "A max-w-6xl band, pt-14 pb-8. A flex row that stacks on small screens and aligns to the baseline/space-between on sm+. Left column: a small pill badge (rounded-full, border-amber/30, bg-amber/10, amber text, with a 1.5px amber dot) reading 'Live workspace metrics'; below it an extrabold h1 at 34px (42px on sm) with tight leading reading 'Design output, ' with the word 'measured' in amber and a trailing period; then a 15px cream/65 subhead 'Every prompt, generation, and ship across your team, rolled into the numbers that move the funnel.' Right: a small cream-dim status line with a green lucide:circle-check-big icon reading 'Synced 2 min ago'."
      },
      {
        "part": "Primary stat-card grid",
        "prompt": "A responsive grid (grid-cols-1, sm:grid-cols-2, lg:grid-cols-4) with gap-5 of four identical stat cards. Each card (card-sheen, rounded-2xl, border-white/10, p-5, hover:border-amber/40 and hover -translate-y-0.5) has: a top row with a label (12.5px cream/55) preceded by a small amber/90 lucide icon, and a delta pill on the right (rounded-md, bg pos/12 or neg/12, green or red text, with a lucide:arrow-up-right / arrow-down-right icon and a percent). Below, a baseline row: the big value extrabold 30px tabular-nums plus a small colored absolute-delta. Below that, a full-width SVG area sparkline (~48px tall) with a colored stroke (green for up, red for down), a subtle vertical gradient fill fading to transparent, and an end-point dot with a soft halo; the sparkline is masked at the left/right edges (linear-gradient mask). The four cards are: 'Prompts run' 42,910 (+5,120, +13.5%, up, lucide:terminal); 'Active designers' 1,284 (+96, +8.1%, up, lucide:users); 'Avg. time to ship' 6m 12s (-1m 04s, +14.7%, up, lucide:timer); 'Credit burn rate' $2,940 (+$610, 4.2%, down/red, lucide:flame)."
      },
      {
        "part": "Secondary grid: featured wide card",
        "prompt": "A 3-column grid (lg:grid-cols-3, gap-5). The featured card spans 2 columns (lg:col-span-2), card-sheen, rounded-2xl, border-white/10, p-6, with a top amber/50 hairline and a grain overlay. Header row: left a 13px cream/55 label 'Generations this week' with an amber lucide:sparkles icon; right (sm+) a right-aligned 'Daily avg' uppercase micro-label over a 20px bold '2,629'. Below the label, a baseline row with a huge 44px extrabold tabular-nums '18,402' and a green delta pill (bg pos/15) '+24.6%' with a lucide:trending-up icon, then a cream-dim line '+3,640 vs. previous week'. Below, an 11-bar bar 'sparkline' (h-24, flex items-end, gap-1.5): bars rise in height (38% -> 100%) and shift color from cream/15 up through amber/40, amber/55, amber/70 to solid amber for the last/tallest bar; under it a Mon/Wed/Fri/Sun axis row in cream-dim tabular-nums."
      },
      {
        "part": "Secondary grid: stacked pair",
        "prompt": "The third column is a vertical flex stack (gap-5) of two of the same stat cards used in the primary grid: 'Prompt -> paid' 3.18% (+0.41pt, +14.8%, up/green, lucide:target) and 'Failed generations' 4.6% (+0.9pt, 24.3%, down/red, lucide:triangle-alert). Same card-sheen styling, sparkline, and delta-pill treatment as the primary cards."
      },
      {
        "part": "Footer",
        "prompt": "A full-width footer with a top border-white/10. Inside, a max-w-6xl row (py-7, 12px cream-dim) that stacks on small screens: left a copyright '(c) 2026 Pulse Analytics'; right a gap-5 row of links 'Docs / Changelog / Status' that brighten to cream on hover."
      }
    ]
  },
  "special_ui_components": [
    "SVG area sparkline generated from a numeric series: a min/max-normalized line path with a soft vertical gradient fill (stroke-color at 0.28 opacity fading to 0), an end-point dot with a larger translucent halo, 2px non-scaling stroke, and a horizontal edge mask so the line fades in/out at the card edges.",
    "Delta pill: a compact rounded-md chip carrying a trend icon (arrow-up-right / arrow-down-right) + percentage, green (#34d399 on pos/12) for positive metrics and red (#f87171 on neg/12) for negative, using tabular-nums.",
    "Bar sparkline: an 11-bar mini bar chart that ramps in height and graduates in color from cream/15 to solid amber on the tallest/most-recent bar, with a weekday axis.",
    "Glass sticky nav: translucent bg-[#06101f]/80 + backdrop-blur-xl with a white/10 bottom hairline that stays pinned on scroll.",
    "Card sheen + hairline: layered radial-amber + vertical navy gradient card fill, a 1px top edge gradient (transparent -> amber -> transparent), grain overlay, and hover lift (border turns amber/40, card translates up)."
  ],
  "special_notes": "Single-accent discipline is the core move: amber (#f0b429) is the only brand color; green/red are strictly semantic (up/down), never decorative. Numerals always use tabular-nums for alignment. Depth comes from layered ambient radial glows + dotted grain, not heavy shadows. Card backgrounds are a fixed 'card-sheen' gradient, not flat fills. Icons are Lucide via Iconify; typeface is Inter (400-900). Note the design uses 'dir: up/down' to drive color, not the sign of the number, so a falling 'time to ship' is still green (good) and a rising 'credit burn rate' is red (bad)."
}
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
