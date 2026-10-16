# Animated Didone Landing Page: Blush and Dusty Pink Editorial With Multiply-Blended Product Photography

**Category:** Animation  
**Tags:** landing, landing-page, animated, animation, scroll-animation, scroll-pinned, sticky, clip-path, reveal, mix-blend-mode, multiply, didone, serif, bodoni, script-font, editorial, fashion, beauty, perfume, cosmetics, luxury, boutique, blush, pink, sage, light-mode, ecommerce, product, desktop, responsive  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/9d76bc96-9fb2-4ab3-b1ff-887990dd5cdb](https://p.superdesign.dev/draft/9d76bc96-9fb2-4ab3-b1ff-887990dd5cdb)  
**Local Standalone Preview:** `previews/animated-didone-landing-page-blush-and-dusty-pink-editorial-with-multiply-blended-product-photography.html`

---

## Architectural & Aesthetic Breakdown
An animated, photographic LANDING PAGE in a Didone editorial register: Bodoni Moda set enormous, a Caveat Brush script accent, dusty pink #EF6F79 against plaster off-white and blush. The hero photograph sits in mix-blend-mode multiply UNDER the display type so the letterforms pass through the picture rather than over it. A second image is revealed bottom-up by a scroll-driven clip-path while the headline above it inverts in difference blend. A four-row composition breakdown advances as you scroll beside a product still. Every headline splits into per-word spans and roughly 170 elements move independently. No canvas, no animation library, all CSS custom properties. Reusable for beauty, perfume, fashion, jewellery, florist, patisserie or any boutique brand whose product photography is the argument.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{
  "summary": "A scroll-choreographed LANDING page for a boutique product house (built here as 'Orris', a natural perfumery). Didone editorial register: plaster off-white #F7F7F4 ground with tinted bands in blush #F3D6DC and #F5D9DF and paper #E4E5E0, near-black #070707 ink, sage #B7BAA9 as a secondary, and dusty pink #EF6F79 as the dominant accent. Bodoni Moda carries EVERYTHING, roman and italic, from 10.5px small-caps furniture at +0.18em to a poster wordmark; Caveat Brush appears three times only, always in pink, always slightly rotated, as the human mark against the Didone's formality. THREE pinned stages: (1) a hero where a still-life photograph fills the pin in mix-blend-mode: multiply and scales gently, with the wordmark sitting ON TOP at poster scale so the letterforms read through the bottles rather than over them, plus a script overline and three mono straps pinned across the base; (2) a strip stage where a second photograph is revealed from the bottom up by clip-path: inset(0 0 calc(100% - p*100%) 0), with a large headline above it in mix-blend-mode difference that fades out as the image completes, and a caption that fades IN only after the reveal is 45 percent done; (3) a notes stage on near-black where four composition rows light cumulatively beside a product still that slowly scales down, each row carrying a pink index, a name and a right-aligned duration. Between and after them: a blush statement band with three columns, a price table of ruled rows with pink figures and italic descriptions, and an FAQ. Every headline, lede and column splits into per-word spans on a 38ms stagger and every row, cell and strap carries its own delay, so about 170 elements move independently.",
  "style": {
    "description": "Didone editorial. One serif family doing every job from tiny tracked furniture to a poster wordmark, one script face used sparingly as the human mark, one dusty pink accent, and photography that is multiplied into the page rather than placed on it. Hairline rules, zero radii, generous white space, and blush used as a full band rather than as a tint on components.",
    "prompt": "Palette: plaster #F7F7F4 ground, papers #F1F1ED / #E4E5E0 / #E7E7E4, blush bands #F3D6DC and #F5D9DF, near-black #070707, sage #B7BAA9 and #AEB1A0, navy #071521, grey #999999, and dusty pink #EF6F79 as the dominant accent. Typography: Bodoni Moda variable (opsz 6..96) at 400/500/600, roman AND italic, used for absolutely everything including the small furniture, which runs at 10.5px, letter-spacing .18em, uppercase, weight 500. Add Caveat Brush in pink for at most three moments on the page, each rotated one or two degrees. Display tracking runs -.03em to -.05em; furniture runs +.16em to +.18em. Radii 0, no shadows, no gradients. Photography must be warm, natural-light, unpeopled still life; place it with mix-blend-mode: multiply on the light grounds so the ink of the type passes through it. Ration pink to: the script moments, the index numerals, the prices, the progress rail and one button. Ease with cubic-bezier(.16,1,.3,1)."
  },
  "layout_and_structure": {
    "description": "Three tall pinned stages (300svh to 360svh), each a position:sticky inner at top:0, height:100svh, overflow:hidden, interleaved with normal bands on alternating tinted grounds. Every animated quantity is a CSS custom property written by ONE rAF-throttled scroll handler.",
    "prompts": [
      {
        "part": "Multiply-blended photographic hero",
        "prompt": "A 300svh stage on the plaster ground. The photograph is absolutely positioned across the whole pin with mix-blend-mode: multiply and object-fit cover, scaling from 1.04 to 1.11 and drifting up 3 percent as the stage scrubs. ABOVE it sits the type block, which lifts 46px and fades out: a Caveat Brush overline in pink, then the wordmark in Bodoni 600 at poster scale with line-height .8 and letter-spacing -.05em. Because the image is multiplied and the type is not, the letterforms read as printed into the still life. SIZE THE WORDMARK FROM ITS CHARACTER COUNT: font-size: min(clamp(3.5rem,34vw,20rem), calc(88vw / (chars * .60))) with white-space:nowrap; Bodoni runs wide, around .60em average advance, so a bare vw that suits a five-letter word will clip a nine-letter one, and overflow:hidden on the pin hides that from a page-level overflow check. Pin three mono straps across the base, and give THEM a darker value than the shared furniture class, because grey furniture washes out where it crosses the bright part of a photograph."
      },
      {
        "part": "Bottom-up image reveal",
        "prompt": "A 320svh stage. A second photograph fills the pin clipped to clip-path: inset(0 0 calc(100% - var(--p) * 100%) 0), so it wipes upward from the bottom edge as the stage scrubs. A large headline sits above it, absolutely centred, in mix-blend-mode: difference with colour #fff so it inverts against both the pale ground and the photograph as the image climbs past it, fading out as the reveal completes. A bottom-left caption fades in only after the reveal passes 45 percent, so it never sits on empty ground. Under reduced motion the clip-path must be removed AND the headline returned to normal blending, or it disappears."
      },
      {
        "part": "Composition rows on near-black",
        "prompt": "A 360svh stage on near-black, two columns. Left: an italic-accented headline, then four ruled rows at 0.28 opacity laid out as a pink index numeral, a bold name and a right-aligned duration, lighting cumulatively as floor(p * 4) advances. Right: a product still in a 4/5 frame scaling from 1.08 down to 1.00 as the stage runs, with a solid pink pill label pinned to its lower-left corner. Only touch the DOM when the row index changes."
      },
      {
        "part": "Bands and per-atom motion",
        "prompt": "Between the pins: a blush band carrying one large statement with an italic clause and a rotated script phrase, over three columns of bold-label paragraphs; then a paper band with a price table of ruled rows (name, italic description, pink figure) collapsing to two columns under 700px; then a blush FAQ of native details rows with a CSS-only plus. Split every headline, lede, statement and caption into per-word inline-block spans rising 0.4em on a 38ms incremental delay, and give every column, table row, table cell, composition row, FAQ summary, hero strap, button, nav link and footer line its own data-rev attribute with a --d delay of 40 to 90ms times its index. Reveal with one IntersectionObserver at threshold 0.12."
      }
    ]
  },
  "special_ui_components": [
    "Photograph in mix-blend-mode multiply beneath poster Didone type, so the letterforms print through the picture",
    "Bottom-up clip-path image reveal with a difference-blended headline crossing it",
    "Script-face accents in pink, rotated, rationed to three moments against an otherwise strict Didone",
    "Composition rows advancing on a scroll-derived index beside a scaling product still"
  ],
  "implementation_notes": "Single self-contained HTML file. One Google Fonts link (Bodoni Moda variable, Caveat Brush) is the only external request; no canvas, no icon fonts, no animation library. Photographs are base64 WebP data URIs: generate at 2K, downscale to ~2000px for the hero and ~1100px for portraits, encode WebP, expect ~155KB of base64 for three and a ~220KB page. VERIFY THE IMAGES DECODE by asserting naturalWidth !== 0 in a headless pass rather than trusting the render; a malformed or un-run embed leaves a page that looks correct to every layout test and shows nothing. Drive all motion from CSS custom properties written by ONE requestAnimationFrame-throttled scroll listener; read stage progress as -rect.top / (rect.height - innerHeight) clamped 0..1. Only mutate the DOM when a derived index changes. Under prefers-reduced-motion: flatten stage heights, make pins static, remove the clip-path, return the difference-blended headline to normal blending and a dark colour, and force every word span and data-rev element visible."
}
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
