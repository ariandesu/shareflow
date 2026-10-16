# Animated Luxury Serif Landing Page: Near-Black and Ice Blue With a Scroll-Advanced Process Diagram

**Category:** Animation  
**Tags:** landing, landing-page, animated, animation, scroll-animation, scroll-pinned, sticky, horizontal-scroll, serif, editorial, luxury, quiet-luxury, minimal, elegant, instrument-serif, dm-sans, light-mode, dark-mode, ice-blue, pastel, agency, consultancy, broker, sourcing, art, music, real-estate, desktop, responsive  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/950b67a3-6d56-410d-bd9a-2eea6666caec](https://p.superdesign.dev/draft/950b67a3-6d56-410d-bd9a-2eea6666caec)  
**Local Standalone Preview:** `previews/animated-luxury-serif-landing-page-near-black-and-ice-blue-with-a-scroll-advanced-process-diagram.html`

---

## Architectural & Aesthetic Breakdown
A quiet-luxury LANDING PAGE in a serif register: near-black #090B0C, warm papers, and one ice blue #B9E5F3 as the only chroma, with Instrument Serif roman and italic carrying every headline and DM Sans at weight 300 doing all the small type. Four sections pin as you scroll. A serif hero over a drifting wood-grain field that lifts and dims. A horizontal rail of catalogue items that travels sideways as you scroll down. A four-step process whose DIAGRAM IS REDRAWN for each step, from pulsing rings to a scattered point field with one lit point, to a grid with everything struck through but one cell, to a single settled square. A parallax contour plate behind a closing statement. Every headline splits into per-word spans and roughly 200 elements move independently. No images, no animation library, all canvas and CSS custom properties. Reusable for a broker, consultancy, gallery, atelier, estate agency or any advisory business selling judgement rather than inventory.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{
  "summary": "A long scroll-choreographed LANDING page for an advisory business that sources rare things (built here as 'Coldbrook', a rare stringed instrument bureau). The register is quiet luxury: a paper ground #F5F5F2 with a near-black #090B0C, warm neutral papers for tinted bands, and ONE ice blue #B9E5F3 used only as a mark. Instrument Serif, roman and italic, carries every headline at tracking -.03em to -.05em; DM Sans at weight 300 carries all body and UI; a system mono at +0.14em carries the small furniture. The nav sits in mix-blend-mode: difference so it inverts itself over both grounds. FOUR pinned stages: (1) a hero on near-black over a canvas of 46 drifting wood-grain contour lines with every ninth line in ice, where the serif wordmark lifts, scales and fades on three separate variables while the vignette deepens on a fourth; (2) a horizontal rail of five catalogue items, each a generated instrument-body plate with two drifting f-holes, translating sideways by exactly its own overflow width; (3) the process stage, where four steps light cumulatively down the left while the canvas on the right is REDRAWN ENTIRELY per step (concentric pulsing rings for listening, a phyllotaxis point field with one point lit at a time for searching, a five-by-five grid with every cell struck through but one for editing, a single settled square with a pulsing centre for arrival) and a serif index counts 01 to 04; (4) a closing statement over a parallax contour plate that drifts on translateY and scale. Then normal bands: a three-column statement, a terms table of ruled rows, and an FAQ. Every headline, lede and column splits into per-word spans rising on a 38ms stagger, and every item, row, step, price and footer line carries its own staggered transform, so roughly 200 elements move independently.",
  "style": {
    "description": "Quiet luxury. Two committed neutrals plus one cold accent, a display serif against a light variable sans, generous vertical rhythm, hairline rules and zero radii. Nothing is photographed; the imagery is drawn. The accent is never a fill, only a mark: an italic phrase, an index numeral, a lit point, a step border, one line in nine of the grain field.",
    "prompt": "Palette: paper #F5F5F2 ground, tinted papers #E9E8E4 and #DEDFDB for alternate bands, near-black #090B0C, sage #B8C0BC, clay #C9C3B9, ice blue #B9E5F3. Hairlines rgba(9,11,12,.14) and .07; muted text rgba(9,11,12,.56). Typography: Instrument Serif at 400 in roman AND italic for every headline, index numeral and item name, letter-spacing -.03em to -.05em, line-height .9 to 1.0; DM Sans variable (opsz 9..40) at weight 300 for body and 400 for UI; a system monospace at 10.5px, letter-spacing .14em, uppercase, for straps and captions. Set the page width to 91.5vw with a 1360px cap, dropping to 89vw under 900px. Radii 0. No shadows, no gradients as decoration, no photography, no icon fonts. Put the fixed nav in mix-blend-mode: difference so one nav serves both the near-black and the paper sections. Ration the ice blue to marks only: an italic clause, the step border, the index numeral, one lit point, every ninth grain line, and one button. Ease everything with cubic-bezier(.16,1,.3,1)."
  },
  "layout_and_structure": {
    "description": "Four tall pinned stages (280svh to 380svh), each a position:sticky inner at top:0 height:100svh overflow:hidden, interleaved with normal bands. Every animated quantity is a CSS custom property on :root, written by ONE rAF-throttled scroll handler.",
    "prompts": [
      {
        "part": "Serif hero on four variables",
        "prompt": "A 280svh stage, sticky inner on near-black. Behind: a canvas of 46 horizontal contour lines, each a sine of x plus a slower harmonic advanced by time, at 7.5 percent paper, with every ninth line in ice blue at 34 percent, reading as wood grain. Over it a radial vignette whose opacity is its own variable so the frame closes in as you scroll. The wordmark is Instrument Serif with part of it italic and ice-coloured. Drive the block with THREE separate properties (--hero-y to -70px, --hero-scale to 0.82, --hero-alpha to 0) and the vignette with a FOURTH. SIZE THE WORDMARK FROM ITS CHARACTER COUNT: font-size: min(clamp(3.4rem,20vw,14rem), calc(92vw / (chars * .46))) with white-space:nowrap, because a bare vw fits only the word the reference happened to use and overflow:hidden on the pin will hide the clipping from a page-level overflow check."
      },
      {
        "part": "Horizontal catalogue rail",
        "prompt": "A 340svh stage on the tinted paper. Absolutely position the heading and a mono count at the top. Lay five items in a non-wrapping flex row, each flex: 0 0 clamp(240px,27vw,340px), with a generated plate at 4/5 aspect, a serif name, a mono year and a two-line note. Translate the row by calc(-1 * progress * (track.scrollWidth - innerWidth)), measured at sync time so it survives resize. Each plate is drawn, not photographed: a lobed body outline built from a polar loop with cos(2a) and cos(4a) terms, filled in clay, outlined in ink, with two mirrored f-hole strokes that drift on a sine and one ice-blue neck line. Seed every constant off the item index so the five plates differ without any randomness."
      },
      {
        "part": "Process stage with a redrawn diagram",
        "prompt": "A 380svh stage on near-black, two columns. Left: a serif headline with an italic ice clause, then four steps as bordered rows at 0.3 opacity that light cumulatively and take an ice left border as the scroll index advances. Right: a square canvas plus a large serif index numeral. THE DIAGRAM IS REDRAWN PER STEP, not merely relabelled: step one draws six concentric rings whose radii pulse; step two draws a 38-point phyllotaxis spiral (angle q * 2.399, radius proportional to sqrt(q/38)) with exactly one point lit and cycling; step three draws a five-by-five grid with every cell struck through by a diagonal except one, which is ice; step four draws a single settled square with a pulsing centre dot. Derive the step index from stage progress and only touch the DOM and swap the diagram mode when that INDEX changes."
      },
      {
        "part": "Parallax plate and closing bands",
        "prompt": "A 280svh stage on paper, content bottom-aligned, with a canvas of 26 contour lines behind it (every sixth in sage) parallaxing on translateY -3% to 3% and scale 1.06 to 1.03. Over it one serif statement with an italic second clause. Then normal bands: a three-column statement with serif sub-heads; a terms table of ruled rows laid out as name, description and value with the description hidden under 700px; and an FAQ of native details rows with a CSS-only plus that loses its vertical bar when open."
      },
      {
        "part": "Per-atom motion budget",
        "prompt": "Split every headline, lede, statement column and hero paragraph into per-word inline-block spans rising 0.38em on a 38ms incremental delay. Then give every catalogue item, item name, year, note, statement column, table row, table cell, process step, step title, step description, FAQ summary, hero strap, button, nav link and footer line its own data-rev attribute with a --d delay of 40 to 90ms times its index, revealed by one IntersectionObserver at threshold 0.12 and unobserved on entry. Target roughly 200 independently moving elements: stage choreography alone moves fewer than ten and reads flat regardless of page length."
      }
    ]
  },
  "special_ui_components": [
    "Process diagram redrawn entirely per step rather than relabelled, four distinct canvas figures",
    "Generated instrument-body plates with drifting f-holes, seeded per item, no photography",
    "Serif hero driven by four independent variables including its own vignette",
    "Horizontal catalogue rail translated by its measured overflow width",
    "mix-blend-mode difference nav that inverts itself across near-black and paper sections"
  ],
  "implementation_notes": "Single self-contained HTML file. One Google Fonts link (DM Sans variable, Instrument Serif roman and italic) is the only external request; no images, no icon fonts, no animation library. Declare every animated quantity as a CSS custom property and write them all from ONE scroll listener throttled through requestAnimationFrame with a re-entrancy flag; read stage progress with getBoundingClientRect as -rect.top / (rect.height - innerHeight) clamped 0..1. Only mutate DOM text, classes or the diagram mode when a derived INDEX changes, never per frame. Size every canvas from getBoundingClientRect times a devicePixelRatio capped at 2, and re-fit on resize. Seed all generated geometry off an element index so plates are deterministic and identical between reloads. Under prefers-reduced-motion: flatten .stage heights to auto, make pins static, force all word spans and data-rev elements visible, wrap the horizontal rail, freeze the diagram at its final step and fill the meters."
}
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
