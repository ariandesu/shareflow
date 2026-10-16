# Animated Landing Page: One Product That Travels the Whole Page

**Category:** Animation  
**Tags:** landing-page, product, craft, stationery, maker, editorial, animated, scroll-animation, travelling-product, svg-animation, self-drawing, variant-switcher, paper, ink-blue, newsreader, courier-prime, monospace, serif, desktop, responsive, style  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/439b88db-318a-4245-bb14-932b64ba7984](https://p.superdesign.dev/draft/439b88db-318a-4245-bb14-932b64ba7984)  
**Local Standalone Preview:** `previews/animated-landing-page-one-product-that-travels-the-whole-page.html`

---

## Architectural & Aesthetic Breakdown
A maker's landing page built on one travelling product: a single fixed image of the object keyframed across the opening sections so it is present throughout without being repeated in each one, and a demonstration panel that draws itself at whichever variant you pick, so the page performs the thing it is selling. Warm paper, one ink blue, a text serif against a typewriter monospace. Good for stationery, instruments, tools and any maker whose product produces something.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{
  "summary": "A maker's landing page built on one travelling product: a single fixed image of the object keyframed across the opening sections so it is present throughout without being repeated, and a demonstration that draws itself so the page performs the thing it sells.",
  "style": {
    "description": "Warm paper ground with a deep ink near-black and one ink blue used for emphasis and never as a fill. A high-contrast text serif carries every heading with its italic reserved for the emphasised phrase; a typewriter monospace carries all labels and body copy.",
    "prompt": "Apply a warm stationery style. Palette: ground #EFE9DD, secondary ground #E5DED0, ink #141C2B, secondary ink #4A5364, muted #767E8C, one ink blue #2C4A8F, hairlines rgba(20,28,43,.16). Typography: 'Newsreader' 400-600 for display and headings at letter-spacing -.02em, with its ITALIC used for the emphasised phrase in the blue; 'Courier Prime' 400-700 at 11-12px with letter-spacing .07em-.1em for labels and body, line-height near 1.9 so the typewriter face stays readable. Border-radius 0 everywhere including buttons. MUST keep the blue to type, a rule or a drawn line, never a filled area. DO NOT use a gradient, a glow, a bento grid, rounded cards, or a drop shadow on anything except the product cut-out."
  },
  "layout_and_structure": {
    "description": "Six sections under a travelling product: a hero with the wordmark spread across the foot, a two-column argument, a demonstration with a variant picker, a material section, a measurements list and a close whose wordmark is cropped by the page edge.",
    "prompts": [
      {
        "part": "Navigation",
        "prompt": "Fixed 58px bar on a translucent ground with a 12px backdrop blur and a bottom hairline. Serif wordmark at 19px with a trailing period in the accent, monospaced uppercase links turning accent on hover, one square button."
      },
      {
        "part": "Hero",
        "prompt": "Full viewport minus the nav on the secondary ground, overflow clipped, laid out as a column. A copy block no wider than 46vw holds a monospaced kicker, a headline at clamp(32px,4.6vw,68px) with one italic phrase in the accent, a monospaced lede and two buttons. A hairline-topped strip of monospaced specifications sits at the bottom of the column via margin-top:auto. Across the very foot, the brand name is set letter by letter with justify-content:space-between so it spans the full width, translated down slightly so the frame crops its baseline."
      },
      {
        "part": "Argument and material",
        "prompt": "Two-column sections pairing a heading and a monospaced lede against hairline-ruled rows, each row carrying a small uppercase accent label, a description and a right-aligned value."
      },
      {
        "part": "Demonstration",
        "prompt": "A heading, a row of variant buttons using aria-pressed for state, and a bordered panel holding an SVG of the product's own output. Selecting a variant changes the drawing and the three monospaced facts beneath it together."
      },
      {
        "part": "Measurements",
        "prompt": "A single column of hairline-ruled rows, label, description and right-aligned tabular figure."
      },
      {
        "part": "Close",
        "prompt": "A short headline with an italic accent phrase, a monospaced fine-print line, two buttons at the opposite edge, a hairline footer strip, then the wordmark full width translated down slightly so the page edge crops it."
      }
    ]
  },
  "special_ui_components": [
    {
      "component": "The travelling product",
      "description": "One product element that crosses the page instead of sitting in a hero.",
      "prompt": "Place a single cut-out of the product as position:fixed and move it along a keyframed path as the page scrolls, interpolating x, y, rotation, scale and opacity between a handful of stops and easing between them. Express x and y as percentages of the viewport so the path holds at any size. Fade it out once the sections that need it are behind you, and set visibility hidden at zero opacity so it cannot intercept anything. The effect is that the product is present in every early section without being pasted into each one. Choose the stops for your own composition, and hide the element entirely under prefers-reduced-motion, since a page whose product is a traveller should read as a complete document without it."
    },
    {
      "component": "A demonstration that draws itself",
      "description": "The product performing, which is the reason the travel earns its place.",
      "prompt": "Give the page one panel that shows the product's actual output as an SVG path, and let it draw itself on entry: measure it with getTotalLength(), set strokeDasharray and strokeDashoffset to that length, and transition the offset to zero over roughly two seconds. Wire the variant picker to the SAME path so choosing a variant changes its stroke width or shape along with the facts printed beneath it. Put this demonstration in a fixed panel, not floating over the viewport: a line traced along the product's own travel path was tried and cut, because between keyframes it reads as an angular polyline rather than as output. The travel path is a layout route, not a letterform."
    },
    {
      "component": "Spread wordmark",
      "description": "The brand name as a full-width base rather than a logo.",
      "prompt": "Set the brand name letter by letter in a flex row with justify-content:space-between across slightly more than the full width, at a very large size with tight negative tracking, translated down a fraction of an em so the frame crops the baseline. On scroll, spread the letters apart from the centre outward and sink them, so the name opens as the page leaves the hero. Reveal it on load rather than on intersection, since it is on screen from the start."
    },
    {
      "component": "Motion models",
      "description": "What is reversible and what is not.",
      "prompt": "The travelling product and the wordmark spread are bound to scroll POSITION, so they play in reverse when the reader scrolls back up. Entry reveals fire once and must not un-reveal. Scope every reveal rule to a class added only after confirming prefers-reduced-motion is not set. Verify the hero actually travels: something in it should move well over 100px across the first 700px of scroll, measured rather than assumed."
    },
    {
      "component": "Evidence rules",
      "description": "What the page may claim.",
      "prompt": "Only the maker's own process and measurable facts. DO NOT invent press coverage, awards, stockists or review counts. Every figure repeated in two places must agree."
    }
  ]
}
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
