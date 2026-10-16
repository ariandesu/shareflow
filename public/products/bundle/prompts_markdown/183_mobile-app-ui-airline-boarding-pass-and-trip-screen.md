# Mobile App UI: Airline Boarding Pass and Trip Screen

**Category:** Mobile App  
**Tags:** mobile app, mobile app design, travel app, flight app, boarding pass, ticket, trip detail, editorial-print, condensed caps, bebas neue, perforation, die-cut, barcode, airmail stripe, coral red, newsprint, light mode, responsive  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/20517198-f1a3-425d-84ca-f94cd5ffa19d](https://p.superdesign.dev/draft/20517198-f1a3-425d-84ca-f94cd5ffa19d)  
**Local Standalone Preview:** `previews/mobile-app-ui-airline-boarding-pass-and-trip-screen.html`

---

## Architectural & Aesthetic Breakdown
A mobile app design prompt for a travel app boarding pass and trip screen, built like a printed airline ticket instead of a stack of generic app cards. One coral red accent on white and cool newsprint grey, tall condensed caps with hierarchy from size alone, a die-cut ticket card with a real perforation and punched notch cutouts, a pure CSS barcode stub, an airmail stripe that repeats as a material marker, a printed timetable route line instead of the usual plane arc, plus a live boarding status strip, a flight timeline and hairline detail rows. Copy it for any flight, rail, ferry or event ticket app, or lift the ticket card on its own as a pass, coupon or wristband component. Pure HTML and CSS, no JavaScript, no photos, responsive at 390 and up.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{
  "summary": "A MOBILE app screen (390px wide, scrolls to natural height) for a flight app: the BOARDING PASS / trip-detail screen for a fictional airline (Skyline Air, LIS -> IST, flight SA 214). The whole screen is an airline PRINT system translated onto a phone rather than a generic stack of app cards. ONE ACCENT ONLY: coral-tomato red #F0524A, against white ticket surfaces, a cool newsprint-grey page #e9ebec, near-black #1a1a1a ink, a faint pink #f9d5d1 stripe tint, cool hairlines #d7dbdc and cool grey label ink #7d8285. ALL display type and every value is BEBAS NEUE in UPPERCASE with hierarchy from SIZE ALONE (never a weight or family switch); Inter carries only the tiny tracked caps labels and body text. Top to bottom: a status bar; an app bar with a back chevron, BOARDING PASS centered and a share glyph; the BOARDING PASS CARD (rounded white card with a full-bleed coral top band carrying a boxed SA monogram + SKYLINE AIR wordmark, an outlined FIRST CLASS badge and the flight number; a route block with giant LIS and IST codes, city names and times, and between them a printed-timetable centerline of hairline rules running into NONSTOP with 3H 45M and A320 stacked under it, NO decorative aircraft glyph anywhere; a red-and-white AIRMAIL DIAGONAL STRIPE band as the tear edge; a 4-up field grid of tiny caps label over condensed value for PASSENGER / SEAT / GATE / BOARDING; a DASHED PERFORATION with real CIRCULAR NOTCH CUTOUTS punched into both card edges so the page ground shows through; and a stub with a pure-CSS barcode, a tracked code number and a ZONE numeral); a square coral BOARDING STATUS strip with a countdown, gate and a thin progress rule; a square hairline-bordered FLIGHT TIMELINE block (filled origin dot, dashed rail, mono caps duration line with a rule running off it, hollow destination dot); a square hairline-bordered TRIP DETAILS block whose top edge repeats the airmail stripe, holding hairline-divided BAGGAGE / MEAL / SEAT / AIRCRAFT rows; a hard-cornered black ADD TO WALLET button plus a red VIEW SEAT MAP text link; and a 4-tab bottom bar with the active tab in coral. Pure HTML + CSS + inline SVG, no JavaScript, no photos, no icon fonts, no gradients, glow or blur.",
  "style": {
    "description": "Utilitarian airline print, on a phone. The design's point of view is that a boarding pass is a printed object, so the screen is built from real print grammar instead of app chrome: condensed uppercase everywhere with hierarchy from size alone, a single saturated ink, hairline rules, die-cut edges and a barcode. Two moves carry it. First, the red-and-white AIRMAIL HAZARD STRIPE is used twice as a structural material marker, once as the ticket's tear edge and once as the top edge of the details block, so the whole page reads as one material rather than a ticket sitting on a stock iOS screen. Second, the route uses a PRINTED-TIMETABLE CENTERLINE (hairline rules running into NONSTOP, with the duration and aircraft type stacked beneath) instead of the usual dashed arc with a little plane on it. Everything below the pass is square-cornered with hairline borders and no soft shadows; only the ticket itself keeps a radius, because it is the physical object. Value contrast is guaranteed by construction: near-black condensed type on white, a full-bleed coral band, a hard black CTA.",
    "prompt": "Design in a utilitarian AIRLINE PRINT register. ONE accent only: coral-tomato #F0524A. White ticket surfaces on a cool newsprint-grey page #e9ebec, near-black #1a1a1a ink, faint pink #f9d5d1 stripe tint, cool hairlines #d7dbdc, cool grey label ink #7d8285. Set ALL display type and values in BEBAS NEUE (or Oswald / Anton) UPPERCASE with hierarchy from SIZE ALONE, never a weight or family switch; use Inter only for 9-11px tracked caps labels and body text. Build from print grammar, not app chrome: hairline rules instead of dividers, die-cut edges instead of borders, a barcode instead of an illustration. Use a red-and-white AIRMAIL DIAGONAL STRIPE band (repeating-linear-gradient at 45deg, #F0524A and #f9d5d1) TWICE as a structural marker: as the ticket's tear edge and as the top edge of one lower block. Square corners, hairline borders and NO soft drop shadows on every block except the ticket card itself, which keeps an 18px radius because it is the physical object. NO decorative aircraft glyph anywhere, NO gradients, glow, blur or glass, NO photos, NO icon fonts, NO second accent color."
  },
  "layout_and_structure": {
    "description": "A 390px-wide mobile column that scrolls to its natural height (on wide viewports the column is centered at max-width 430px against a darker gutter, never stretched). Order: status bar; app bar (back chevron / BOARDING PASS / share); the boarding-pass card (coral top band, route block, airmail tear edge, 4-up field grid, dashed perforation with circular notch cutouts, barcode stub with ZONE); coral boarding-status strip with a progress rule; flight timeline block; trip-details block with an airmail top edge and hairline rows; ADD TO WALLET button plus a VIEW SEAT MAP text link; 4-tab bottom bar.",
    "prompts": [
      {
        "part": "App shell",
        "prompt": "Build a mobile app column: full width up to max-width 430px, centered horizontally, min-height 100vh but NEVER a fixed h-screen with an inner overflow-y-auto scroller (the page must grow to its natural height). Page background cool newsprint grey #e9ebec, with a slightly darker #dadedf behind the column on wide viewports. Top: a status bar (time left, signal / wifi / battery glyphs right) in near-black. Under it an app bar with 56px pt-14 top padding: a back chevron left, BOARDING PASS centered in Bebas Neue caps, a share glyph right, a hairline bottom border. Content is a single vertical stack with 24px gaps and 16px side padding."
      },
      {
        "part": "Boarding pass card: red band + route centerline",
        "prompt": "A white card, 18px radius, subtle print shadow, overflow hidden. Top: a full-bleed coral #F0524A band, 16px padding, holding on the left a 2px-outlined white box containing SA in Bebas caps next to the SKYLINE AIR wordmark in Bebas, and on the right a thin-outlined FIRST CLASS badge in 10px tracked caps plus the flight number SA 214 in Bebas. Below it a route block on plain white: LIS and IST in Bebas at 60px hard left and hard right, each with its city name under it in 11px tracked caps grey and its time (08:30 / 15:15) in Bebas 24px below that. Between the two codes, a printed-timetable centerline: a full-width row of two hairline rules meeting the word NONSTOP in 9px tracked caps grey, then 3H 45M in Bebas 18px centered under it, then A320 in 9px tracked caps grey. Do NOT draw an airplane glyph, a dashed flight arc or any route illustration."
      },
      {
        "part": "Airmail tear edge + field grid",
        "prompt": "Directly under the route block, a 6px full-width band filled with a 45deg repeating-linear-gradient alternating #F0524A 0-5px and #f9d5d1 5-10px, so it reads as an airmail hazard stripe. Under it, 24px padding and a 2-column grid with 20px row gaps: PASSENGER / A. VON LINDEN, SEAT / 12A (value in coral), GATE / B12, BOARDING / 09:00. Each cell is a 10px tracked uppercase grey label over a Bebas 24px value."
      },
      {
        "part": "Perforation with real notch cutouts",
        "prompt": "Split the card with a 2px DASHED horizontal rule in the hairline color running edge to edge. At each end of that rule, absolutely position a 20px circle filled with the PAGE background color, offset by -10px so half of it sits outside the card on the left and right. The result must read as a genuine die-cut tear-off, not a printed line."
      },
      {
        "part": "Stub: barcode + zone",
        "prompt": "Below the perforation, 24px padding, a row: on the left a 48px-tall barcode built purely with a repeating-linear-gradient of #1a1a1a bars at irregular widths (2px, 1px, 4px, 2px with varying gaps) so it reads as a real scannable code, with SA214 \u00b7 7720 4412 09 centered under it in Bebas with wide tracking; on the right, separated by a vertical hairline and 24px padding, a 10px tracked ZONE label over a Bebas 36px numeral 2."
      },
      {
        "part": "Boarding status strip",
        "prompt": "A SQUARE-cornered solid coral #F0524A block, 16px padding, white type: a row with BOARDING IN 42 MIN left and GATE B12 \u00b7 CLOSES 09:20 right, both Bebas 20px; under it a 4px square progress track at 30% white opacity with a solid white fill at 70% width."
      },
      {
        "part": "Flight timeline block",
        "prompt": "A white block with a 1px hairline border and NO radius and NO shadow, 20px padding. A vertical dashed rail down the left. Origin: a filled near-black dot with a ring, LIS \u00b7 LISBON in Bebas 20px with TERMINAL 1 in 11px tracked caps under it, and 08:30 in Bebas right-aligned. Midpoint: a small hollow dot and a row containing 3H 45M \u00b7 AIRBUS A320 in 10px tracked caps grey with a hairline rule running off it to the right edge (no pill, no chip, no rounded background). Destination: a hollow ring dot, IST \u00b7 ISTANBUL in Bebas with MAIN TERMINAL under it, and 15:15 right-aligned."
      },
      {
        "part": "Trip details block",
        "prompt": "A white block with a 1px hairline border, no radius, no shadow. Its TOP EDGE is a 6px airmail stripe band identical to the ticket's tear edge. Inside, 20px side padding and four rows divided by hairlines: BAGGAGE / 1 x 23KG, MEAL / INCLUDED, SEAT / WINDOW \u00b7 EXTRA LEGROOM, AIRCRAFT / A320-200. Each row is an 11px tracked uppercase grey label left and a Bebas 20px value right."
      },
      {
        "part": "CTAs + tab bar",
        "prompt": "A full-width SQUARE near-black #1a1a1a button, 16px vertical padding, ADD TO WALLET in Bebas 24px white with wide tracking; under it a centered VIEW SEAT MAP text link in 13px semibold tracked caps coral. Finally a bottom tab bar on white with a hairline top border and 34px bottom safe-area padding: four icon-over-10px-caps-label tabs (TRIPS / SEARCH / PASSES / ME) in grey, with the active PASSES tab in coral #F0524A. All tab icons are inline SVG strokes, no icon font."
      }
    ]
  },
  "special_ui_components": [
    {
      "component": "Die-cut perforation with real notch cutouts",
      "description": "The tear line that makes a card read as a physical ticket instead of a rounded div: a dashed rule with half-circles punched out of both card edges, filled with the page color so the background genuinely shows through.",
      "prompt": "Inside a relatively-positioned wrapper, render a 2px dashed horizontal border in the hairline color spanning the full card width. Absolutely position two 20px circles (border-radius 50%) filled with the PAGE background color, one at left:-10px and one at right:-10px, both at top:-10px relative to the rule, so each is half outside the card. Keep the card's overflow visible at those points. The notches must read as die-cut holes, not decorative dots."
    },
    {
      "component": "Airmail hazard stripe band",
      "description": "A 6px diagonal candy-stripe band in the accent and its tint, used as a structural material marker rather than decoration: once as the ticket's tear edge, once as the top edge of a lower block, so the page reads as one material.",
      "prompt": "background-image: repeating-linear-gradient(45deg, #F0524A 0 5px, #f9d5d1 5px 10px); height 6px; full width. Place it flush against the bottom of the ticket's route block and again flush against the top edge of one lower content block. Never use it more than twice, and never as a decorative frame."
    },
    {
      "component": "Printed-timetable route centerline",
      "description": "The anti-cliche route device: instead of a dashed arc with a plane icon, the space between the two airport codes carries printed-timetable typography, which is both more distinctive and more informative.",
      "prompt": "In the flex column between the two airport codes: a full-width row of two 1px rules at 25% ink opacity meeting a centered 9px tracked-caps NONSTOP; under it the duration in condensed caps at 18px in full ink; under that the aircraft type in 9px tracked caps grey. No arc, no dashes, no aircraft glyph."
    },
    {
      "component": "Pure-CSS barcode",
      "description": "A scannable-looking barcode with no image asset, so the whole pass stays copy-paste portable.",
      "prompt": "A 48px-tall block whose background is a repeating-linear-gradient to the right alternating #1a1a1a bars and transparent gaps at IRREGULAR widths (for example 2px bar, 3px gap, 1px bar, 4px gap, 4px bar, 2px gap, 2px bar, 4px gap) so it reads as encoded data rather than a regular stripe pattern. Set it at ~80% opacity and put the tracked code number centered underneath."
    },
    {
      "component": "Condensed-caps field grid",
      "description": "The boarding-pass information pattern: a tiny tracked uppercase label over a large condensed value, tiled in a grid, with hierarchy coming from size alone.",
      "prompt": "A 2-column grid with 20px row gaps and 16px column gaps. Each cell: a 10px uppercase label with 0.08em tracking in grey #7d8285 above a Bebas Neue 24px value in near-black with leading-none. Exactly one value may take the accent color (the seat) to mark the single most personal field. Never bold a label, never switch families inside the grid."
    }
  ]
}
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
