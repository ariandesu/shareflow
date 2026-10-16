# Animated Swiss Poster Landing Page: Warm Paper and Red With a Scroll-Driven Live Timeline

**Category:** Animation  
**Tags:** landing, landing-page, animated, animation, scroll-animation, scroll-pinned, sticky, clip-path, wipe, canvas, swiss, poster, editorial, grid, brutalist, bold, anton, jetbrains-mono, light-mode, paper, red, logistics, delivery, courier, service-business, local-business, desktop, responsive  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/ce1fd786-d79a-46b4-99f8-a1238ea7152b](https://p.superdesign.dev/draft/ce1fd786-d79a-46b4-99f8-a1238ea7152b)  
**Local Standalone Preview:** `previews/animated-swiss-poster-landing-page-warm-paper-and-red-with-a-scroll-driven-live-timeline.html`

---

## Architectural & Aesthetic Breakdown
An animated LANDING PAGE in a Swiss poster register: warm paper #F8F3EC, ink #111010 and one hot red #DC201E, with Anton set huge, Archivo for body and JetBrains Mono at +0.26em for every label. Four sections pin as you scroll. A hero over a 44px ruled grid that parallaxes. A statement filled left to right by a scroll-driven clip-path. A LIVE TIMELINE where an elapsed clock, a distance and a status label are all interpolated from one series of minute marks, so they can never disagree with the row that is lit. A drawn street network with a route traced to your scroll position. Every headline splits into per-word spans and roughly 175 elements move independently. No images, no animation library, 2px rules and zero radii. Reusable for a courier, logistics, trades, clinic, garage or any service business whose promise is a measurable time.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{
  "summary": "A scroll-choreographed LANDING page for a time-promise service business (built here as 'Halfmile', a same-day cycle courier). Swiss poster register: warm paper #F8F3EC ground with #F1EBE1 for one alternate pin, ink #111010, one hot red #DC201E, grey #8C8880 for furniture. Anton carries every headline, wordmark and row title in uppercase at letter-spacing -.012em; Archivo 400-700 carries body; JetBrains Mono at 11px and +.26em uppercase carries every label and price. Structure is drawn with 2px ink rules and 1px hairlines, never with cards or radii. FOUR pinned stages: (1) a hero over a 44px ruled background grid that parallaxes upward while the lockup lifts and fades, with half the wordmark in red and a single 38-second ambient hairline crossing the base; (2) a wipe stage on ink where a large statement sits at 18 percent paper and an exact clone is filled LEFT TO RIGHT by clip-path: inset(0 calc(100% - p*100%) 0 0); (3) the timeline stage, where five ruled rows light cumulatively beside a bordered clock panel whose elapsed time, distance and status label are ALL interpolated from the same array of minute marks at the current scroll progress, with a 6px red meter along the base; (4) a map stage where a deterministic node lattice is drawn on canvas in mix-blend-mode multiply and ONE route is traced through it in red exactly as far as the scroll has travelled, with a pulsing head. Then normal bands: a three-cell explainer grid separated by hairlines, a rate table of ruled rows with mono red figures, and an FAQ. Every headline, lede and column splits into per-word spans on a 36ms stagger and every row, cell and strap carries its own delay, so roughly 175 elements move independently, all from ONE rAF-throttled scroll handler writing CSS custom properties.",
  "style": {
    "description": "Swiss poster on warm paper. A heavy condensed display face, a neutral grotesque for reading, a wide-tracked mono for every label, one red used only as a mark, and structure carried entirely by 2px rules and a visible modular grid. No radii, no shadows, no gradients, no photography.",
    "prompt": "Palette: warm paper #F8F3EC ground with #F1EBE1 for an alternate pinned stage, ink #111010, red #DC201E, grey #8C8880, hairlines rgba(17,16,16,.16) and .08. Typography: Anton for every headline, wordmark, row title and table label, uppercase, letter-spacing -.012em, line-height .86 to .94; Archivo 400 to 700 for body at 15px/1.6; JetBrains Mono 400 at 11px with letter-spacing .26em uppercase for every strap, caption, timestamp and price. Radii 0 everywhere. Section boundaries and table heads are 2px solid ink; row rules are 1px hairlines. Set a 44px background grid from two crossed linear-gradients at 8 percent ink and let it show. No shadows, no gradients used as decoration, no photography, no icon fonts. Ration red to: half the wordmark, the timestamps, the meters, the route trace, the prices and one button. DO NOT build a scrolling marquee band; it is the single most common AI tell in this register and it was retired here deliberately."
  },
  "layout_and_structure": {
    "description": "Four tall pinned stages (260svh to 400svh), each a position:sticky inner at top:0, height:100svh, overflow:hidden, then two normal bands. Every animated quantity is a CSS custom property written by ONE rAF-throttled scroll handler.",
    "prompts": [
      {
        "part": "Grid poster hero",
        "prompt": "A 280svh stage on paper. Behind everything, a 44px modular grid built from two crossed linear-gradients at 8 percent ink, translating upward 60px across the stage so the page reads as a sheet moving under the type. The lockup lifts 44px and fades: a mono kicker, then the wordmark in Anton with its second half in red, then a 2px ink rule with a paragraph and a button under it. SIZE THE WORDMARK FROM ITS CHARACTER COUNT: font-size: min(clamp(52px,15vw,220px), calc(90vw / (chars * .44))) with white-space:nowrap. Anton runs about .44em average advance; a value tuned on a wide geometric face will look tiny here and one tuned on a short word will clip a long one, and overflow:hidden on the pin hides that from a document-level overflow check. Cross the base of the hero with ONE 3px red hairline animating over 38 seconds, and stop there: do not build a marquee of repeating words."
      },
      {
        "part": "Left-to-right wipe on ink",
        "prompt": "A 260svh stage on ink. One statement in Anton at clamp(2.1rem,7.4vw,7.2rem) over 14ch, set in paper at 18 percent, with an exact absolutely-positioned clone in full paper clipped by clip-path: inset(0 calc(100% - var(--p) * 100%) 0 0) so it fills left to right. Under it a 2px rule and two mono facts that argue the page's claim with numbers rather than adjectives. Verify the clone's rect matches the base at 0px on x and width."
      },
      {
        "part": "Live timeline",
        "prompt": "A 400svh stage, two columns. Left: an Anton headline with a red clause, then five ruled rows of mono timestamp, Anton label and mono note, at 0.3 opacity, lighting cumulatively as floor(p * 5) advances. Right: a 2px-bordered square panel holding a mono run number, a status label, the word Elapsed, a huge red Anton clock, and a distance. DERIVE THE CLOCK FROM THE SAME SERIES AS THE ROWS: hold the minute marks in one array, interpolate piecewise at the stage progress, and format that value as mm:ss; compute the distance from the same number. The status label swaps only on the row index change. Because all four readouts come from one series, the clock can never show a time that contradicts the row that is lit, which is the difference between a working mechanic and a decorative one. Run a 6px red meter along the panel base at width calc(var(--p) * 100%)."
      },
      {
        "part": "Traced route map",
        "prompt": "A 300svh stage on paper, content bottom-aligned. Draw a deterministic node lattice on canvas: place 26 points on a phyllotaxis spiral (angle i * 2.399, radius sqrt(i/26)) and connect every pair closer than a fixed threshold with 1px ink hairlines, then dot each node. Composite the canvas with mix-blend-mode: multiply so it sits into the paper rather than over it. Then trace ONE route through a fixed subset of node indices in 2.6px red, drawn only as far as the stage progress, interpolating the final partial segment so the line grows smoothly rather than snapping node to node, with a pulsing dot and halo at its head. Over it, a closing Anton line with a red clause."
      },
      {
        "part": "Bands and per-atom motion",
        "prompt": "After the pins: a three-cell explainer grid separated by 1px gaps over a hairline background so the gaps read as rules; a rate table of ruled rows (Anton name, grey description, mono red figure) collapsing to two columns under 700px; an FAQ of native details rows with a CSS-only plus. Split every headline, statement, lede and column paragraph into per-word inline-block spans rising 0.4em on a 36ms incremental delay, and give every cell, cell title, table row, table cell, timeline row part, FAQ summary, hero strap, wipe fact, button, nav link and footer line its own data-rev attribute with a --d delay of 40 to 100ms times its index, revealed by one IntersectionObserver at threshold 0.12. Target roughly 175 independently moving elements."
      }
    ]
  },
  "special_ui_components": [
    "Live timeline whose clock, distance, status and highlighted row are all interpolated from one series, so they cannot disagree",
    "Deterministic node lattice with a single route traced to scroll position, multiplied into the paper",
    "Left-to-right clip-path wipe filling an exact clone of a statement",
    "44px modular grid that parallaxes under the poster type",
    "A single 38-second ambient hairline INSTEAD of a scrolling marquee band"
  ],
  "implementation_notes": "Single self-contained HTML file. One Google Fonts link (Anton, Archivo, JetBrains Mono) is the only external request; no images, no icon fonts, no animation library. Drive every animated quantity as a CSS custom property written from ONE scroll listener throttled through requestAnimationFrame; read stage progress as -rect.top / (rect.height - innerHeight) clamped 0..1. Hold any numeric series (times, distances, temperatures) in ONE array and derive every readout from it by interpolation, rather than hard-coding display strings that can drift out of sync with the highlighted row. Only mutate DOM text on an index change, except readouts that must move continuously. Size canvases from getBoundingClientRect times a devicePixelRatio capped at 2. Anton runs about .44em average advance, so size poster lines from the real character count. Under prefers-reduced-motion: flatten stage heights, make pins static, remove the clip-path, stop the 38s animation and set that element to full width, freeze the timeline at its final values, and force every word span and data-rev element visible."
}
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
