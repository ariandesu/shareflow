# Animated Landing Page: Dark Console With a Self-Drawing Network Diagram

- **Category:** Dashboard
- **Slug:** `animated-landing-page-dark-console-with-a-self-drawing-network-diagram`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** landing-page, saas, dashboard, console, product-ui, animated, scroll-animation, svg-animation, stroke-dashoffset, data-visualization, network-diagram, dark-mode, graphite, amber, minimal, space-grotesk, jetbrains-mono, monospace, energy, infrastructure, desktop, responsive

---

## Architectural Philosophy & Overview
A dark product console landing page whose network diagram draws itself in, then keeps flowing as you scroll. Staggered UI cards, monospaced labels and hairline spec rows, on graphite with a single amber accent and a green reserved strictly for status. Good for infrastructure, observability, energy and any tool whose product is a live system.

---

## Production System Prompt Specification
```
{
  "summary": "A dark console landing page built around one move: an SVG network diagram that draws itself in via stroke-dashoffset and then converts to a scroll-driven flow, so the product's own subject is what animates. Graphite ground, one amber accent, status green used only for state, and monospaced technical furniture throughout.",
  "style": {
    "description": "Near-black console chrome with panelled surfaces, hairline borders and a single saturated amber accent. A second green exists solely to signal state and never decorates. Display type is a tight grotesk; every label, value and unit is monospaced with wide tracking.",
    "prompt": "Apply a dark technical-console style. Palette: ground #0B0D10, panel #12161C, raised panel #171C24, ink #E8EBEF, secondary ink #98A1AE, muted #6B7481, accent amber #F0A422, status green #3DDC97, hairlines rgba(232,235,239,.12). Typography: 'Space Grotesk' 400-700 for headings at letter-spacing -.03em; 'JetBrains Mono' 400-600 at 9.5-11px with letter-spacing .05em-.09em, uppercase, for every label, unit and readout. Radius 8-16px on panels, 999px on pills. MUST reserve the status colour for actual state and never use it as decoration. MUST render every number in a monospaced tabular figure. DO NOT use gradients as decoration, a glow banner, a bento grid or drop shadows on anything except the console panel itself."
  },
  "layout_and_structure": {
    "description": "A two-column hero pairing a copy stack against a live console panel, then alternating full-width sections of prose plus either a staggered card grid or hairline-ruled rows. Every section is anchored by a monospaced index label.",
    "prompts": [
      {
        "part": "Console chrome nav",
        "prompt": "Fixed 56px bar on a translucent ground with a 12px backdrop blur and a 1px bottom hairline. Left: a 20px rounded accent mark with a soft outer glow beside the wordmark. Middle: monospaced uppercase tabs at 10.5px that take a panel background on hover. Right: a ghost button and a solid accent button."
      },
      {
        "part": "Hero",
        "prompt": "Two columns, roughly .92fr against 1.25fr, filling the viewport minus the nav. Left holds a status chip in the green with a filled dot, a headline at clamp(34px,4.6vw,66px) with its key phrase in the accent, a 44ch lede, two buttons, then a row of monospaced label pills carrying a bold figure and a unit. Right holds the console panel. The panel must actually TRAVEL on scroll, around 190px with a slight scale down, and the copy stack should lift with it; a 10-15px drift reads as a static hero."
      },
      {
        "part": "Console panel",
        "prompt": "A bordered, rounded surface with a title bar carrying a glowing status dot, a monospaced caption and a right-aligned refresh interval; a body holding the SVG diagram; and a footer strip of monospaced readouts. Give it a deep shadow so it sits above the page."
      },
      {
        "part": "Diagram",
        "prompt": "An SVG one-line diagram drawn to a real topology: a source node feeding intermediate nodes feeding leaf nodes, each a rounded rect with a monospaced label and a value, live paths in the accent and inactive paths in a faint neutral. Draw the connectors BEFORE the nodes so the nodes sit above them."
      },
      {
        "part": "Body sections",
        "prompt": "A monospaced index tag with a hairline rule, a headline at clamp(26px,3.6vw,50px), a 46ch lede, then either a responsive grid of bordered cards each with a monospaced key, a large tabular value, a title and a line of prose, or a set of hairline-ruled rows with a monospaced accent label, a description and a right-aligned tabular value."
      },
      {
        "part": "Close",
        "prompt": "A bordered box with a soft radial accent wash in one corner, holding a short headline, a monospaced fine-print line and the two buttons, followed by a hairline footer strip of monospaced items."
      }
    ]
  },
  "special_ui_components": [
    {
      "component": "Self-drawing network diagram",
      "description": "The signature: connector lines assemble themselves, then become a flow.",
      "prompt": "Measure each path with getTotalLength(), set strokeDasharray and strokeDashoffset to that length, and on entry transition the offset to 0 with a .12s stagger after a .6s delay so the network assembles rather than appears. CRITICAL: when the draw completes, hand the lines over to the scrubbed layer — swap strokeDasharray to a repeating pattern such as '10 14', clear the transition, and drive strokeDashoffset from scroll position so energy flows along the paths in both directions. Without that handover the diagram animates once and the page is dead on the way back up."
    },
    {
      "component": "The two animation models",
      "description": "Entry reveals and scrub-bound motion do different jobs; shipping only the first leaves a page that works downward and not upward.",
      "prompt": "Entry reveals fire once on intersection and must NOT reverse — re-hiding copy the reader has passed is a defect, not an effect. Give the page a second, scroll-POSITION-bound layer that is reversible by construction: parallax on the hero panel, a drift on cards, headings and rows at three different rates via a CSS custom property, a readout whose numbers track scroll, and the diagram flow above. Before shipping, scroll back up and confirm something still moves."
    },
    {
      "component": "Staggered reveal grammar",
      "description": "How everything enters.",
      "prompt": "Blocks reveal from {opacity:0, translateY(100px), blur(12px)} with a .08s stagger between children. Cards enter from translateY(18px) at a .06s stagger. Label pills enter from translateY(18px) at a .12s stagger after a .35s delay. Scope every rule to a class the script adds only after confirming prefers-reduced-motion is not set, so the reduced-motion and no-JS renders are simply the finished page."
    },
    {
      "component": "Live telemetry readouts",
      "description": "Numbers that behave like a running system.",
      "prompt": "Bind readouts to scroll position rather than to a timer, so they move with the reader and stay consistent in both directions. Render them in a monospaced tabular figure so digits do not jitter. Keep the values plausible and internally consistent with anything the diagram states."
    },
    {
      "component": "Evidence rules",
      "description": "What the page may claim.",
      "prompt": "The only claims are the product's own measured behaviour. DO NOT invent customer logos, testimonials, counts or awards. Where the design makes a checkable promise, compute it and verify it in the DOM rather than eyeballing it."
    }
  ]
}
```
