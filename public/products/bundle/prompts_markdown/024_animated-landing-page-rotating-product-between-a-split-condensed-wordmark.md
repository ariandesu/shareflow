# Animated Landing Page: Rotating Product Between a Split Condensed Wordmark

**Category:** Animation  
**Tags:** landing-page, product, luxury, watch, horology, craft, animated, scroll-animation, type-occlusion, split-type, condensed-type, editorial, dark-mode, graphite, brass, big-shoulders, martian-mono, monospace, svg-animation, desktop, responsive  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/43e768bc-7990-4731-bd99-4a4c30e3e80a](https://p.superdesign.dev/draft/43e768bc-7990-4731-bd99-4a4c30e3e80a)  
**Local Standalone Preview:** `previews/animated-landing-page-rotating-product-between-a-split-condensed-wordmark.html`

---

## Architectural & Aesthetic Breakdown
A dark product landing page where the wordmark splits either side of a rotating product and a pinned section swings a real oscillation derived from the product's own frequency. Graphite ground, one brass accent, a very condensed display face against a wide monospace. Good for instruments, horology, audio and anything sold on a measured number.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{
  "summary": "A dark craft-product landing page whose wordmark is interrupted mid-line by the product itself, which rotates as you scroll while the two halves of the word part around it. A pinned section drives a real oscillation computed from the product's published frequency rather than a decorative loop.",
  "style": {
    "description": "Near-black ground with a warm bone ink and one brass accent used for emphasis only. A very condensed uppercase display face carries every heading; a wide monospace carries every label and figure, so the two type roles never blur. Square corners throughout.",
    "prompt": "Apply a dark instrument-craft style. Palette: ground #0E0E10, secondary ground #151517, ink #EAE6DE, secondary ink #A7A29A, muted #7A756D, one brass accent #C9A227, hairlines rgba(234,230,222,.14). Typography: 'Big Shoulders Display' 700-900 uppercase for all headings and the wordmark, line-height .74-.96; 'Martian Mono' 400-600 at 9.5-11px with letter-spacing .05em-.12em, uppercase, for labels, and at 11px with line-height 1.85-1.9 for body copy. Border-radius 0 everywhere including buttons. MUST keep the brass to type, a marker or a single rule and never a filled area. DO NOT use a gradient, a glow banner, a bento grid, a card row, or a drop shadow on anything other than the product cut-out."
  },
  "layout_and_structure": {
    "description": "Six sections. The hero splits the wordmark either side of the product; then a pinned oscillation study, two-column prose against hairline-ruled specification rows, a series table, and a close with the wordmark cropped by the page edge.",
    "prompts": [
      {
        "part": "Navigation",
        "prompt": "Fixed 60px bar on a translucent ground with a 14px backdrop blur and a bottom hairline. Condensed wordmark at 22px with a trailing period in the brass, monospaced uppercase links at 9.5px taking a brass underline on hover, and one square button."
      },
      {
        "part": "Hero",
        "prompt": "Full viewport minus the nav on the secondary ground, overflow clipped with isolation isolate. Copy stack left at no more than 44vw: monospaced eyebrow, a three-line uppercase headline at clamp(34px,5vw,74px) with the last line in brass, a monospaced lede at line-height 1.85, two buttons. Specifications pin to the TOP right, never the bottom \u2014 the wordmark fills the bottom band and anything placed there collides with it."
      },
      {
        "part": "Pinned study",
        "prompt": "A tall section with a sticky full-height stage: a heading, an SVG arc with a hand swinging across it and a filled pivot, and a row of monospaced readouts. Derive the swing, the amplitude decay and the elapsed count from the product's published frequency so the drawing and the figures are one calculation."
      },
      {
        "part": "Two-column specification",
        "prompt": "A monospaced index tag with a hairline rule, an uppercase heading, a monospaced lede, and hairline-ruled rows carrying a monospaced brass label, a description and a right-aligned tabular value; beside it the product shown again at a different crop."
      },
      {
        "part": "Process rows",
        "prompt": "A single column of hairline-ruled rows, each a monospaced brass label, a description and a right-aligned duration or quantity."
      },
      {
        "part": "Series table and close",
        "prompt": "A table with monospaced uppercase headers over a hairline, a condensed uppercase reference name at clamp(18px,2vw,26px) and monospaced metadata columns. Then a short headline with a brass phrase, a monospaced fine-print line, two buttons at the opposite edge, a hairline footer strip, and the wordmark full width at clamp(84px,22vw,340px) translated down .16em so the page edge crops it."
      }
    ]
  },
  "special_ui_components": [
    {
      "component": "Horizontal wordmark bracket",
      "description": "The signature: the product interrupts the wordmark mid-line.",
      "prompt": "Split the wordmark into two halves on ONE baseline, laid out with space-between across the full width at clamp(96px,25vw,370px) and line-height .74, with the product standing in the gap: the left half BEHIND the product in the stacking order and the right half IN FRONT of it, so the object weaves through the word rather than sitting on it. Size the product by height so it never outgrows the hero. On scroll, translate the halves apart by around 15vw each while the product rotates \u2014 for an instrument, rotation is the subject's own behaviour and is the reason the hero moves at all."
    },
    {
      "component": "Computed oscillation",
      "description": "A pinned study driven by the product's real numbers.",
      "prompt": "Take the product's published frequency and derive everything from it: beats elapsed against running time, the swing angle as a sine of scroll progress scaled to the stated amplitude, and an amplitude that decays realistically across the stated reserve. Redraw the arc from the current amplitude each frame so the drawn sweep and the printed figure are the same value. Never animate the hand on a timer \u2014 bind it to scroll so it reads in both directions."
    },
    {
      "component": "Hero motion floor",
      "description": "How much the hero must actually move.",
      "prompt": "Measure it: over the first 700px of scroll, something in the hero should travel well over 100px. A 20px drift is invisible and reads as a static image, and a hero whose height equals one viewport will silently compute NEGATIVE scroll progress if you divide by (offsetHeight - innerHeight), clamping every transform to zero forever. Drive such a hero off the viewport height instead, and verify the travel rather than trusting the code."
    },
    {
      "component": "Reveal grammar",
      "description": "How copy arrives, and why it must not reverse.",
      "prompt": "Reveal blocks from {opacity:0, translateY(18px)} with .07s steps, scoped to a class added only when prefers-reduced-motion is not set, so the reduced-motion and no-JS renders are the finished page. Entry reveals fire once and must not un-reveal. Keep a separate scroll-position-bound layer \u2014 the rotation, the swing, the readouts \u2014 so the page is alive scrolling up as well as down."
    },
    {
      "component": "Evidence rules",
      "description": "What the page may claim.",
      "prompt": "Only the product's own specifications. DO NOT invent press quotes, awards, retailer logos or customer counts. Any figure that appears twice must agree with itself."
    }
  ]
}
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
