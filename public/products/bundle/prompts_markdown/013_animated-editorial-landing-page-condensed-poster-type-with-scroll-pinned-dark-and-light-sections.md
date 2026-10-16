# Animated Editorial Landing Page: Condensed Poster Type With Scroll-Pinned Dark and Light Sections

**Category:** Animation  
**Tags:** landing, landing-page, animated, animation, scroll-animation, scroll-pinned, sticky, parallax, editorial, poster-type, condensed, variable-font, archivo, space-mono, light-mode, dark-mode, orange, minimal, studio, agency, service-business, archive, restoration, craft, desktop, responsive  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/93562ca0-c342-40bf-8aed-838a0660494d](https://p.superdesign.dev/draft/93562ca0-c342-40bf-8aed-838a0660494d)  
**Local Standalone Preview:** `previews/animated-editorial-landing-page-condensed-poster-type-with-scroll-pinned-dark-and-light-sections.html`

---

## Architectural & Aesthetic Breakdown
An animated, scroll-pinned LANDING PAGE built on condensed poster typography and alternating dark and light grounds. Archivo's variable width axis is compressed to font-stretch 63 percent so headlines read tall and narrow, Space Mono carries every label at +0.16em, and a single orange #FF4D00 is the only chroma against glacier #F2F4F1 and ink #0B0E14. Three sections pin while you scroll: a poster wordmark that scales away into a statement, a numeric ladder whose rows light one at a time as the number counts, and a headline erased upward by a scroll-scrubbed mask. Every headline splits into per-word spans and every row, cell and price line moves on its own delay, which is what makes it feel authored rather than templated. No images, no JS libraries, a generated film-grain plate. Reusable for a studio, workshop, agency, archive, guiding outfit or any craft service with a numeric spine such as a year, an altitude, a depth or a gauge.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{
  "summary": "A long, scroll-choreographed LANDING PAGE for a craft service business (built here as 'Halide', a film archive restoration lab) whose spine is a NUMERIC LADDER. The page alternates between an ink ground #0B0E14 and a glacier ground #F2F4F1, and each section is tagged in the corners with an index and a number from the ladder, so scrolling reads as moving along a scale rather than down a document. It opens on a pinned hero: a full-bleed generated plate of drifting scan lines with a slow orange bloom, a six-letter poster wordmark centred at poster scale, and mono metadata pinned to the bottom corners; as the hero scrubs, the wordmark scales down and fades while a second statement cross-fades into the middle of the frame. The second pinned stage is the ladder itself: a huge year on the left with its last two digits in orange, and four rows on the right that light and indent one at a time as the number steps 1927, 1948, 1961, 1983, with a progress meter along the bottom of the stage. The third pinned stage is a whiteout: a large condensed headline erased from the bottom upward by a scroll-scrubbed mask-image, its caption fading as it goes. After the pins the page returns to normal bands: a three-cell grid of what the service delivers, a four-up row of people each with a generated plate portrait, a tariff of ruled price rows with mono figures in orange, and an FAQ of native details rows. Every headline is split into per-word spans that rise on a 40ms stagger, and every cell, portrait, tariff row, summary and footer line carries its own staggered transform, so roughly 170 elements move independently. All of it is driven by ONE rAF-throttled scroll handler writing CSS custom properties; there is no animation library.",
  "style": {
    "description": "Condensed poster editorial. Two committed grounds, one orange accent, and type doing all the work through a compressed variable width axis. Structure comes from hairline rules and 1px grid gaps, never from cards, shadows or radii. A fixed film-grain plate at 5 percent sits over everything and is the only texture.",
    "prompt": "Palette: ink #0B0E14, deep ink #07090D, glacier #F2F4F1, white #FAFBFA, accent orange #FF4D00, text-on-dark #E9EDF2, text-on-light #12161D. Alternate section grounds between ink and glacier and never introduce a third ground. Typography: Archivo as a VARIABLE font loaded on the width and weight axes (wdth 62..125, wght 100..900). Set all display and poster type at font-weight 800 to 900 with font-stretch 63%, subheads and row titles at font-stretch 74%, letter-spacing -0.015em to -0.02em, uppercase. Space Mono 400 at 11px with letter-spacing 0.16em, uppercase, for every label, index, year, caption and price. Radii 0 everywhere. No shadows, no gradients used as decoration, no bento grids, no photography. Orange is rationed to: the last two digits of the ladder number, the price figures, the progress meters, one accent line per portrait plate, and the primary button. Add a fixed full-viewport grain overlay at opacity 0.05 with mix-blend-mode overlay, generated from an inline SVG feTurbulence data URI. Ease everything with cubic-bezier(0.16,1,0.3,1) at roughly 1.1s.",
    "notes": "The compressed width axis is the signature. At normal width this register collapses into an ordinary minimal layout."
  },
  "layout_and_structure": {
    "description": "Three pinned stages then four normal bands. Pinned stages are a tall section (240svh to 400svh) containing a position:sticky inner at top:0, height:100svh, overflow:hidden. Scroll progress per stage is -rect.top / (rect.height - innerHeight), clamped 0 to 1, written to a --p custom property on the section. Content is capped at 1240px with a clamp(1.25rem,4vw,4rem) gutter. All known-count grids use explicit tracks with breakpoints, never auto-fit.",
    "prompts": [
      {
        "part": "Pinned poster hero",
        "prompt": "A 300svh section with a sticky 100svh inner on the ink ground. Back layer: a subtle vertical gradient plus a full-bleed canvas drawing horizontal scan lines every 5px, each jittered horizontally by a sine of time and its row index, at 3 to 7 percent white, with a wide soft orange band drifting left to right across them. Middle layer: the wordmark centred at poster scale, scaling to 0.66 and fading out as --p advances. Front layer: three mono metadata items pinned across the bottom, fading faster than the wordmark; and a second statement absolutely centred that fades IN from --p 0.52 onward, so the frame hands over from the name to the claim. SIZE THE POSTER FROM ITS CHARACTER COUNT: font-size: min(clamp(4rem,33vw,40rem), calc(94vw / (chars * .56))). A bare 33vw fits a six-letter word and silently clips anything longer, and overflow:hidden on the pin hides that from a page-level overflow check."
      },
      {
        "part": "The numeric ladder",
        "prompt": "A 400svh section with a sticky 100svh inner on the glacier ground, split into two columns. Left: the current number at clamp(5rem,17vw,15rem), weight 900, font-stretch 63%, with its final two characters wrapped and coloured orange. Right: four ruled rows, each a bold condensed uppercase title over a 13.5px description, all at opacity 0.3 by default. Derive an index from the stage progress (floor(p * 4), capped at 3) and, only when the index CHANGES, toggle rows at or below it to full opacity with 14px of left padding and swap the number and the corner year. Run a 2px orange progress meter along the bottom of the stage at width calc(var(--p) * 100%). Mirror the number in a mono tag in the top-right corner so the ladder position is legible even at a glance."
      },
      {
        "part": "The masked whiteout",
        "prompt": "A 240svh section with a sticky 100svh inner on the glacier ground, centred. One condensed uppercase headline of three short lines at clamp(2.4rem,9vw,7.5rem). Erase it from the bottom upward as the stage scrubs using mask-image: linear-gradient(180deg, #000 calc((1 - var(--p)) * 100%), transparent calc((1 - var(--p)) * 100% + 14%)), with the -webkit- prefix alongside. A small mono caption underneath fades out slightly faster. Under prefers-reduced-motion the mask must be set to none, or the headline is left permanently erased."
      },
      {
        "part": "Alternating bands",
        "prompt": "After the pins, normal sections alternating ink and glacier, each with an index in the top-left corner and its ladder number in the top-right at 42 percent opacity. A three-cell grid separated by 1px gaps over a hairline background so the gaps read as rules. A four-up people row where each portrait is a generated canvas plate: horizontal bars of varying width seeded per person, one bar in seven in orange, drifting on a slow sine. A tariff of ruled rows laid out as a fixed-width label column, a description, and a mono price in orange, collapsing to two columns on narrow screens. An FAQ of native details and summary rows with a CSS-only plus that loses its vertical bar when open."
      },
      {
        "part": "Per-atom motion",
        "prompt": "This is what separates the register from a static layout, so budget for it explicitly. Split every headline, lede and statement into per-word spans, each an inline-block that rises 0.4em and fades in on a 40ms incremental delay. Then give every cell, cell title, cell paragraph, portrait, portrait name, tariff row, tariff label, price, FAQ summary, corner index, corner number, hero metadata item, button, nav link and footer line its own data-rev attribute with a --d delay of 40 to 90ms times its index. Reveal all of them with a single IntersectionObserver at threshold 0.14 and a -6% bottom root margin, unobserving each on entry. Target roughly 170 independently moving elements: stage-level choreography alone reads flat no matter how long the page is."
      }
    ]
  },
  "special_ui_components": [
    "Numeric ladder whose rows light and indent one at a time as a scroll-driven index changes",
    "Poster wordmark sized from its own character count, handing the frame to a second statement mid-pin",
    "Headline erased upward by a scroll-scrubbed mask-image",
    "Generated scan-line plate with a drifting orange bloom, and per-person generated portrait plates",
    "Fixed film-grain overlay from an inline SVG feTurbulence data URI"
  ],
  "implementation_notes": "Single self-contained HTML file. The only external request is one Google Fonts link (Archivo variable on wdth and wght, Space Mono); no images, no icon fonts, no animation library. Drive every stage from ONE scroll listener throttled through requestAnimationFrame with a re-entrancy flag, writing CSS custom properties; read stage progress with getBoundingClientRect rather than accumulating offsets. Only touch the DOM when a derived INDEX changes, never on every frame. Size canvases from getBoundingClientRect times a devicePixelRatio capped at 2 and re-fit on resize. Under prefers-reduced-motion: set .stage height to auto, make .pin static, force every word span and data-rev element visible, set mask-image to none, and fill the progress meters, otherwise content stays masked or hidden. Note that overflow:hidden on a sticky pin will hide a clipped poster from any document-level overflow test, so check the poster's own scrollWidth against its container."
}
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
