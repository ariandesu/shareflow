# Atelier Vermillion — Editorial Burgundy Agency Website

**Category:** Style  
**Tags:** agency-website, agency, studio, portfolio, editorial, serif-display, fraunces, cream, burgundy, gold, print-inspired, asymmetric, marquee, case-studies, responsive, light  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/64f2dd4e-13ed-4a73-ad0b-93936de9f04f](https://p.superdesign.dev/draft/64f2dd4e-13ed-4a73-ad0b-93936de9f04f)  
**Local Standalone Preview:** `previews/atelier-vermillion-editorial-burgundy-agency-website.html`

---

## Architectural & Aesthetic Breakdown
An editorial, print-inspired agency studio website on a warm cream canvas: a tall Fraunces serif headline with burgundy italic accent words beside stacked case-study image cards, framed by gold hairlines, with a scrolling stat marquee, alternating asymmetric case studies, a dark pull-quote band, a burgundy contact section, and a giant clamp-scaled footer wordmark.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{
  "summary": "An editorial, print-inspired agency studio website on a warm cream 'paper' canvas with a deep burgundy + gold accent system. A sticky translucent nav sits above an asymmetric hero where a tall Fraunces serif headline (with two burgundy italic accent words) pairs with a stacked column of case-study image cards, a status pill, dual pill CTAs, a trust row, and an infinite scrolling stat marquee. Below: a two-column section intro, two alternating asymmetric case studies (image-left / image-right) framed by gold hairlines, a dark full-bleed pull-quote band, a four-up stat counter strip, a two-column services block, a three-step numbered process, a burgundy contact band with a cream form card, and a near-black footer that ends on a giant clamp-sized VERMILLION wordmark.",
  "style": {
    "description": "Editorial print-magazine aesthetic rendered for the web: a warm cream paper background with a faint dotted grain, a tall Fraunces serif display face for headlines (mixed with true italic accent words) over a clean Inter grotesque body, a deep burgundy primary with a darker burgundy hover, and a muted gold reserved for hairline rules, accent words, and dividers. Surfaces are large-radius rounded image cards with thin gold hairline borders, generous editorial whitespace, faint vertical column-grid lines as texture, and a subtle warm 'editorial' image filter (slight grayscale + sepia + contrast). Two full-bleed inverted bands (near-black ink and solid burgundy) punctuate the cream flow.",
    "prompt": "Use a warm cream 'paper' background (#faf6ef) with a slightly deeper cream for inset bands and cards (#f1eadd). Text uses an ink ramp: near-black #1c1815 for headings and the dark/footer bands, a softer #4a423b for body and muted copy. The primary accent is a deep burgundy #7b2d3b with a darker hover/active #5e1f2b, and a muted antique gold #b9974e reserved for hairlines, dividers, accent italic words, star ratings, and footer hover. Typography: Fraunces (serif, class 'display', optical-sizing on, letter-spacing -0.02em, tight line-height ~0.96) for the logo wordmark, hero H1, section H2/H3 headings, plan/case names, stat numerals, and the giant footer wordmark, weights 300-700 with TRUE ITALIC light (font-light) for the colored accent words; Inter (sans, weights 400/500/600) for nav, body, labels, buttons, and form fields. Decorative textures: a faint dotted 'grain' (radial-gradient 1px dots, 4px tile, ~2.5% ink) on the body; a faint vertical 'column grid' (linear-gradient 1px gold lines at 25% intervals, ~16% opacity) behind the hero and inside the dark/burgundy bands at low opacity. Hairline borders use rgba(185,151,78,0.45) gold; a 'gold-rule' divider is a horizontal gradient fading gold in/out at the edges. Image cards are rounded 20-24px with a 1px gold hairline border and an 'editorial' filter (grayscale .25, contrast 1.05, sepia .18, saturate 1.05) plus a directional ink/burgundy gradient scrim for caption legibility. Buttons and pills use full radius; primary CTAs are near-black or burgundy fills with a cream circular arrow chip on the right. Hover lift on cards (translateY -6px + long burgundy-tinted shadow). Smooth scroll, antialiased; selection is burgundy bg / cream text. No em-dashes in copy."
  },
  "layout_and_structure": {
    "description": "A frameless, fully responsive single-page agency site centered in a max-w-[1240px] column with px-6/px-10 gutters. Top is a sticky translucent cream nav (72px). Then an asymmetric hero: a ~1.05fr editorial-copy column beside a ~0.95fr stacked image column, followed by a full-width scrolling stat marquee on a hairline-bordered band. Below flow: a two-column (label + paragraph) selected-work intro; case study 01 as a 1.15fr image / 0.85fr text asymmetric grid; a full-bleed near-black pull-quote band; case study 02 with the columns reversed (text-left / image-right, order-swapped on mobile); a four-up bordered stat counter strip; a services block split ~0.4fr intro / ~0.6fr 2x2 service grid (gold hairline gutters); a three-column numbered process with gold vertical dividers; a full-bleed burgundy contact band split ~0.55fr copy / ~0.45fr cream form card; and a near-black footer with a 4-column link grid, a giant clamp-scaled wordmark, and a bottom bar. Responsive: nav links collapse to a hamburger under lg; every asymmetric two-col grid stacks to one column on small screens (case 02 reorders so the image leads on mobile); service grid goes 2-up to 1-up; stat strip goes 4-up to 2-up; process goes 3-up to 1-up; the giant footer wordmark scales with clamp(52px,13.5vw,210px).",
    "prompts": [
      {
        "part": "Sticky nav",
        "prompt": "A sticky top header (z-50) with a translucent cream background (bg-cream/85) + backdrop-blur and a hairline gold bottom border. Inside a centered max-w-[1240px] row, 72px tall: left cluster is a logo (a 36px near-black rounded-full chip holding a cream asterisk icon) followed by a Fraunces serif wordmark 'Atelier Vermillion' (~22px). Center/left of the right side: nav links (Work, Services, Process, Studio, Contact) in ~14px Inter, muted ink that darkens on hover with an animated grow-underline. Right side: a pill 'Start a brief' CTA in burgundy with cream text and a small cream circular arrow-up-right chip (hidden under lg), plus a hamburger icon button (a gold-hairline rounded circle) shown only under lg."
      },
      {
        "part": "Hero (asymmetric editorial)",
        "prompt": "An asymmetric hero on the cream canvas with a faint vertical column-grid texture behind it. Two columns (lg-grid 1.05fr / 0.95fr, items-end). LEFT: a gold-hairline pill with a pulsing burgundy dot reading 'Two studio slots open - Summer 26' in uppercase tracked 12px burgundy; a huge Fraunces H1 (~52px mobile to ~82px desktop, leading 0.98) reading 'Agency websites, composed like a piece of print.' where 'composed' and 'print.' are set in italic font-light burgundy; a ~17px muted subhead (max-w 34ch); a CTA row with a primary near-black pill 'Book an intro call' (cream circular arrow chip that rotates 45deg on hover) and a secondary gold-hairline pill 'View the work' (burgundy circular arrow-down chip); and a trust row with three overlapping gradient avatar chips, five gold stars, and 'Trusted by 90+ founders and design teams'. RIGHT: a vertical stack of two case-study figure cards (aspect 16/10 and 16/9), each a rounded-20px gold-hairline image card with the editorial filter, a directional ink/burgundy gradient scrim, and a bottom figcaption with a 'Case 0X' label, a Fraunces name, and a small pill stat ('+212% leads' / 'CSS site of the day'). Both cards use the hover lift."
      },
      {
        "part": "Stat marquee",
        "prompt": "A full-width band below the hero with hairline gold top+bottom borders and a deeper-cream bg, overflow hidden. Inside, an infinite horizontal marquee (CSS keyframe translateX 0 to -50%, ~32s linear loop) of ~14px tracked inksoft stats, each prefixed with a burgundy '//' mark: '340+ pages shipped', '4.9 / 5 client rating', '90+ brands launched', '7 awards on the canvas', '11-day average turnaround'. The row is duplicated (aria-hidden) for a seamless loop."
      },
      {
        "part": "Selected-work intro",
        "prompt": "A two-column section (lg-grid 0.42fr / 0.58fr, items-start). LEFT: a small burgundy uppercase tracked label '( Selected work )' above a Fraunces H2 (~40-52px) 'Sites that read like a magazine, ship like software.'. RIGHT: a single ~18px muted paragraph (max-w 44ch, justify-self-end) about composing the homepage as a spread and handing over clean components."
      },
      {
        "part": "Case studies (alternating asymmetric)",
        "prompt": "Two case-study articles with mirrored asymmetry. CASE 01 (id=work): grid 1.15fr image / 0.85fr text. Image is a rounded-24px gold-hairline aspect-4/3 editorial-filtered figure with a corner '01 / 04' serif index and an ink gradient scrim. Text: a burgundy uppercase tracked eyebrow ('Brand & web - Studio retainer'), a Fraunces H3 'Marble & Co.' (~34-44px), a ~17px muted paragraph (max-w 42ch), a 2-up stat tile pair (gold hairline gutter, cream tiles) with burgundy Fraunces numbers ('+212%' qualified inbound, '9 days' brief to launch), and a grow-underline 'Read the case study' link with a burgundy arrow. CASE 02 (mirrored): grid 0.85fr text / 1.15fr image with order swapped (lg text-left/image-right; on mobile the image leads). Text: eyebrow 'Webflow to handoff - Product launch', Fraunces H3 'Field Notes Studio', a muted paragraph, and a 3-item check list (burgundy check-circle icons, gold hairline dividers between rows). Image is a rounded-24px aspect-5/4 editorial figure with a '02 / 04' corner index and a burgundy gradient scrim."
      },
      {
        "part": "Pull-quote band (dark)",
        "prompt": "A full-bleed near-black (ink) band with cream text (id=voice), a faint gold column-grid texture at ~8% opacity, centered max-w-[1100px], generous py. Centered: a burgundy quotes icon, a large Fraunces font-light blockquote (~32-50px, leading 1.08) 'They didn't hand us a template. They handed us a point of view, and the code to run it.' with 'point of view' set in italic gold, and a figcaption with a burgundy gradient avatar chip + name 'Renata Diaz' / role 'Founder, Field Notes Studio'."
      },
      {
        "part": "Stat counter strip",
        "prompt": "A bordered band (hairline gold top+bottom, deeper-cream bg) with a centered max-w-[1240px] row split into four equal cells (2-up on mobile, 4-up on lg) divided by gold hairline dividers. Each cell is centered: a big Fraunces numeral (~44-58px) with its trailing unit in burgundy (11y, 98%, 90+, 7x) over a ~13px tracked muted caption (years on the canvas / client satisfaction / brands launched / awards repaid in leads)."
      },
      {
        "part": "Services block",
        "prompt": "A two-column section (id=services, lg-grid 0.4fr / 0.6fr). LEFT intro: a burgundy uppercase label '( What we do )', a multi-line Fraunces H2 'One studio, the whole site stack.' with 'site stack.' italic font-light burgundy, a ~16px muted paragraph (max-w 34ch), and a burgundy pill 'Plan your project' CTA with a cream arrow chip. RIGHT: a 2x2 service grid (sm 2-col) built as cells separated by gold hairline gutters inside a rounded-3xl gold-hairline frame; each cell is a cream card with a 30px burgundy Phosphor icon (pen-nib, sparkle, code-block, compass-tool), a ~24px Fraunces title (Editorial web design / Prompted on canvas / Shippable handoff / Brand systems), a ~15px muted description, and a gold-rule divider that fades in on hover, with a cell bg that warms to deeper cream on hover."
      },
      {
        "part": "Process (numbered)",
        "prompt": "A section with a hairline gold top border (id=process), centered max-w-[1240px]. A header row (flex, wrap) pairs a Fraunces H2 'How a brief becomes a site.' with a short ~14px muted note (max-w 30ch) 'Four moves, roughly eleven days, one canvas the whole way through.'. Below, a three-column grid (1-up on mobile) of numbered steps separated by gold vertical hairline dividers (md:border-r) with right padding: each step has a Fraunces burgundy tracked step label ('STEP 01', 'STEP 02', 'STEP 03 - 04'), a ~26px Fraunces title (The brief read closely / Composed on canvas / Refine & hand off), and a ~15px muted paragraph."
      },
      {
        "part": "Contact band + form card",
        "prompt": "A full-bleed solid burgundy band with cream text (id=contact), a faint gold column-grid texture at ~10% opacity, centered max-w-[1240px], split lg-grid 0.55fr copy / 0.45fr form, items-center. LEFT: a cream/70 uppercase tracked label '( Start a brief )', a large Fraunces H2 (~44-64px) 'Have a site that deserves better type?' with 'better type?' italic font-light gold, a ~17px cream/80 paragraph (max-w 40ch), and a wrap row of two grow-underline contact links (gold envelope + gold phone icons). RIGHT: a rounded-24px cream form card with a gold/40 border and a deep burgundy-tinted shadow, holding a fake (onsubmit return false) form: labeled text/email inputs and a textarea (rounded-xl, gold-hairline, cream bg, focus border burgundy) for name / work email / 'What are we building?', plus a full-width near-black pill submit 'Send the brief' with a cream arrow chip."
      },
      {
        "part": "Footer",
        "prompt": "A near-black (ink) footer with cream text, centered max-w-[1240px]. TOP: a 4-column link grid (sm 2-up, lg 4-up) divided by a cream/10 bottom border. Column 1 'Newsletter': a tracked uppercase label, a cream/80 blurb (max-w 26ch), and a pill email-capture row (cream/5 input with cream/15 border focusing to gold, plus a burgundy circular arrow button that turns gold on hover). Column 2 'Studio' and Column 3 'Company': tracked uppercase labels over cream/80 grow-underline link lists. Column 4 'Elsewhere': a tracked label, a row of four cream/15 hairline circular social icon buttons (x, dribbble, instagram, linkedin) that turn gold on hover, and a faint 'San Francisco - Lisbon - remote' line. MIDDLE: a giant Fraunces wordmark 'VERMILLION' (font-medium, leading-none, clamp(52px,13.5vw,210px)) with a burgundy period, overflow hidden. BOTTOM bar: a wrap row with a cream/10 top border holding a faint copyright '\u00a9 2026 Atelier Vermillion. An independent design studio.' and a 'Composed on the canvas' line with a small gold asterisk icon."
      }
    ]
  },
  "special_ui_components": [
    {
      "component": "Infinite stat marquee",
      "description": "A seamless horizontal auto-scrolling strip of studio stats separated by burgundy slash marks, used as a thin band between the hero and the work section.",
      "prompt": "Build a full-width overflow-hidden band with hairline gold top+bottom borders and a deeper-cream background. Inside, a flex row of width max-content animated by a CSS keyframe (translateX 0 to -50%, ~32s linear infinite). The content is two identical inline-flex groups (the second aria-hidden) of ~14px tracked muted stat spans, each led by a burgundy bold '//' mark: '340+ pages shipped', '4.9 / 5 client rating', '90+ brands launched', '7 awards on the canvas', '11-day average turnaround'. Duplicating the group and translating -50% yields a seamless loop."
    },
    {
      "component": "Editorial image card (filter + scrim + hover lift)",
      "description": "The recurring case-study / hero image treatment: a rounded gold-hairline frame with a warm editorial photo filter, a directional gradient scrim for caption legibility, an optional corner index, and a hover lift.",
      "prompt": "Create a rounded (20-24px) figure with a 1px gold hairline border and overflow hidden, fixed aspect-ratio (16/10, 16/9, 4/3 or 5/4). Layer: a bg-cover bg-center image div with an 'editorial' filter (grayscale .25, contrast 1.05, sepia .18, saturate 1.05); an absolute directional gradient scrim (e.g. from-ink/60 or from-burgundydeep/65 fading to transparent toward the top or a corner); an absolute corner index in Fraunces cream (e.g. '01 / 04', tracked 0.2em); and an absolute bottom figcaption with a small uppercase 'Case 0X' label, a Fraunces name, and a pill stat chip (cream/90 or gold). Add a 'lift' transition: on hover translateY(-6px) with a long burgundy-tinted shadow (0 30px 60px -28px rgba(94,31,43,0.45))."
    },
    {
      "component": "Pill CTA with circular arrow chip",
      "description": "The signature button style across the site: a full-radius near-black / burgundy / outline pill with a contrasting circular arrow chip pinned to its right edge that animates on hover.",
      "prompt": "Build a full-radius pill button with asymmetric padding (pl-6 pr-2 py-2.5) so a circular icon chip sits flush to the right. Variants: primary near-black (bg-ink, cream text) hovering to burgundydeep; burgundy (bg-burgundy cream) hovering to burgundydeep; and outline (transparent + gold hairline border) hovering to a burgundy border. The right chip is a 36px (or 28px) circle whose color inverts the button (cream chip with ink/burgundy icon, or burgundy chip with cream icon) holding a Phosphor arrow-up-right / arrow-down icon; animate the chip on hover (rotate 45deg, translate-x, or translate-y) via a 300ms transition."
    },
    {
      "component": "Gold-rule + column-grid editorial textures",
      "description": "Two reusable decorative primitives that carry the print aesthetic: a center-fading gold hairline divider, and a faint vertical column-grid backdrop used behind the hero and inside the inverted bands.",
      "prompt": "Define a 'gold-rule' class as a 1px-tall element with a horizontal linear-gradient that fades gold (rgba(185,151,78,0.8)) in at 12% and out at 88% with transparent ends, used as section dividers and as hover reveals under service cards. Define a 'col-grid' class as a repeating vertical linear-gradient (1px gold lines, rgba(185,151,78,0.16), background-size 25% 100%) layered as a low-opacity (60% on cream, 8-10% on dark/burgundy bands) absolute pointer-events-none backdrop. Also apply a faint dotted 'grain' (radial-gradient 1px ~2.5% ink dots, 4px tile) to the body for paper texture."
    }
  ],
  "special_notes": "Render as a FRAMELESS, fully responsive single-page web design (no browser window chrome). The defining transferable moves to preserve: a warm cream 'paper' canvas with a faint dotted grain and gold column-grid texture; a deep burgundy + antique gold accent system on near-black ink type; a tall Fraunces serif display headline mixed with TRUE ITALIC font-light accent words (burgundy on light, gold on dark) over an Inter body; asymmetric editorial grids (1.05/0.95, 1.15/0.85, 0.4/0.6) rather than centered symmetry; gold hairline borders and a center-fading gold-rule divider as the recurring frame; rounded image cards with a warm editorial photo filter, gradient scrims, corner indices and a hover lift; the signature pill CTA with a circular arrow chip; two full-bleed inverted bands (near-black pull-quote, solid burgundy contact) to punctuate the cream flow; an infinite stat marquee; and a closing giant clamp-scaled VERMILLION footer wordmark with a burgundy period. Icons are Phosphor (iconify ph:* set). Keep the sticky translucent nav persistent and collapse it to a hamburger under lg; every asymmetric grid stacks to one column on mobile (case 02 reorders so its image leads). No em-dashes anywhere in the copy; use commas, colons, periods, and a middot for separators."
}
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
