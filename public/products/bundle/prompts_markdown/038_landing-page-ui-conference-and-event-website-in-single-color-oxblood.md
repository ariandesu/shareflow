# Landing Page UI: Conference and Event Website in Single-Color Oxblood

**Category:** Style  
**Tags:** landing-page, website, conference-website, event-website, conference-landing-page, event-landing-page, ticket-page, monochrome-poster, editorial, single-color, monochrome, oxblood, maroon, deep-red, expanded-type, archivo, ibm-plex-mono, typographic, ghost-type, sharp-corners, hairline-rules, agenda-timetable, speakers-grid, ticket-tiers, sponsor-tiers, dark, responsive  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/0c687aaa-850c-4f1a-b130-3d8bd7476c67](https://p.superdesign.dev/draft/0c687aaa-850c-4f1a-b130-3d8bd7476c67)  
**Local Standalone Preview:** `previews/landing-page-ui-conference-and-event-website-in-single-color-oxblood.html`

---

## Architectural & Aesthetic Breakdown
A landing page design for a conference or event website, built as a single-color print poster instead of the usual SaaS marketing page. One deep oxblood field owns the entire site, pale pink is the only light, and all depth comes from a third value of the same red, so the tone-on-tone ghost wordmark bleeds off the hero. Sharp corners everywhere, hairline rules, expanded uppercase display type over mono labels, a pure black event card, a typographic speaker grid with no photos, and an agenda that inverts the whole page to pale pink so the timetable is the most legible surface on the site. Reusable for any conference, festival, meetup, workshop series or product launch event, and the inverted timetable and ticket tiers work on their own as sections.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{
  "summary": "A DESKTOP landing page (a full marketing website that scrolls, roughly 5800px tall at 1440) for a fictional two-day conference for design engineers, OVERPRINT '26 in Rotterdam. It is built as a single-color PRINT POSTER system rather than a standard SaaS marketing page. ONE HUE ONLY: deep oxblood #70020F owns the entire canvas, pale pink #FEDEE1 is the only light, a tone-on-tone ghost #8A0A18 supplies every bit of depth, and pure black #0A0708 is reserved for the two hard surfaces (the event card and the buttons). Nine sections in order: a slim top bar (wordmark, dates and city, a solid black GET TICKETS button); a hero that is a giant two-line stacked left-aligned wordmark with a huge ghost repeat of the same word bleeding off the right edge, over a mono meta row of DATES / CITY / VENUE / EDITION; a pure-black sharp-cornered event card holding a one-sentence positioning line and two hairline-divided rows (DAY 01 WORKSHOPS with an arrow and 14 MAY right-aligned, DAY 02 TALKS with 15 MAY); a speakers section as a hairline grid of eight TYPOGRAPHIC cells, each a large ghost monogram of the speaker's initials behind a name in expanded display caps with role and studio in mono, no photos and no avatar circles; an AGENDA section that INVERTS the entire system to a pale-pink ground with oxblood ink, laid out as a printed timetable of ten sessions with mono times in a left column, session title, speaker and a right-aligned stage tag, hairline rules between every row; three sharp-cornered ticket tiers (Early Bird sold out and struck through, Standard as a solid black card, Studio Pass) with large display prices and hairline-ruled feature lists; a venue and getting-there block in three columns of mono label over display value; a sponsors block as three hairline-ruled tier rows (PRESENTING / SUPPORTING / MEDIA AND PRINT) with names in the display face at descending sizes; and a closing CTA band with a left-aligned headline, a mono scarcity line and a black button on the right, over a giant ghost wordmark bleeding off the bottom. Pure HTML and CSS, no JavaScript, no images, no icon fonts, no gradients, no shadows, no blur.",
  "style": {
    "description": "A single-hue print field. The point of view is that a conference identity is a poster, so the site is built from one saturated ink and its values rather than from a palette: the ground, a slightly lighter ghost tone and a pale tint are the ENTIRE color system, and anything that would normally be a second color is instead a change in value or a shift to pure black. Three moves carry it. First, the ghost type: an oversized display word in the ghost tone sits behind and bleeds past live content, so the hero has depth without a gradient, a glow or a photo. Second, the INVERSION: the agenda flips the whole field to pale pink with oxblood ink, which makes the timetable the most legible surface on the site, which is exactly what a visitor came for. Third, total geometric discipline: every corner is square, every divider is a one-pixel hairline, there is not a single shadow, pill or rounded card. Type does the rest, with an EXPANDED grotesk in uppercase for display and a mono for every label, time and numeral, and no serif anywhere.",
    "prompt": "Design in a SINGLE-HUE PRINT POSTER register. Use exactly one saturated ground color and derive everything else from its values: ground #70020F, a ghost tone #8A0A18 that is only ever used for oversized decorative type and nothing else, pale pink #FEDEE1 for all live type, a 62% pale pink for secondary text, a 28% pale pink for hairline rules, and pure black #0A0708 for hard surfaces. Set display type in ARCHIVO at width 125 (font-stretch: 125% plus font-variation-settings: 'wdth' 125), weight 900, uppercase, letter-spacing -0.01em, sized with clamp(). Set every label, time, price unit and numeral in IBM PLEX MONO, uppercase, letter-spacing 0.14em, 11 to 13px. Never use Inter and never use a serif. border-radius is 0 on every element without exception. No shadows, no blur, no glass, no gradients, no glow, no pills, no emoji, and absolutely NO dot-grid or line-grid background texture of any kind. Separate every section and every row with a 1px hairline in the rule color. Invert exactly ONE interior section to the pale ground with the deep hue as ink, and pick the section a visitor most needs to read."
  },
  "layout_and_structure": {
    "description": "A full-width page with no fixed container width, sections stacked edge to edge and divided by hairlines, content held in a max-width 80rem centered block with 16 to 32px side padding. Order: top bar, hero, black event card, speakers grid, inverted agenda, ticket tiers, venue, sponsor tiers, closing CTA and footer. Every grid collapses to one column below 760px and the display type is fluid, so the page holds at 390px with no horizontal overflow.",
    "prompts": [
      {
        "part": "Top bar",
        "prompt": "A slim sticky-feeling bar with a hairline bottom border: the wordmark left in display caps at 20px, the dates and city centered in mono 12px at 62% opacity (hide this below 768px), and a solid black rectangular GET TICKETS button right in mono 12px with 12px by 24px padding and zero radius. No logo mark, no icon, no rounded pill."
      },
      {
        "part": "Hero with ghost bleed",
        "prompt": "A tall section with generous top padding and overflow hidden. Inside a relatively positioned block, place the brand word as TWO stacked lines in the display face at clamp(4rem, 13vw, 11rem) with leading-none, hard LEFT aligned, in pale pink. Behind it, absolutely positioned and vertically centered, set the SAME word once more in the ghost tone at clamp(10rem, 30vw, 30rem), pushed right so it bleeds off the right edge of the viewport and is clipped by the section. Under the headline, a row of four meta cells with 48px gaps: a 10px mono label at 60% opacity (DATES / CITY / VENUE / EDITION) over a 14px mono value. Do NOT centre anything, do NOT place the headline over a band, a glow, a gradient or a device mockup."
      },
      {
        "part": "Black event card",
        "prompt": "A pure black #0A0708 block with zero radius and 32 to 48px padding, sitting in the page's content column. Inside: a positioning sentence in the display face at 20 to 24px, uppercase, max 44ch, in pale pink. Below it, two rows separated by hairlines in a 28% pale-pink tone, each row a flex line with the day label in display caps (DAY 01) plus a dimmed word (WORKSHOPS) on the left, and on the right a diagonal arrow glyph followed by the date in mono 14px with white-space nowrap so it never wraps."
      },
      {
        "part": "Typographic speakers grid",
        "prompt": "A 4-column grid (2 at tablet, 1 at mobile) built from borders only: put border-top and border-left on the grid container and border-right plus border-bottom on each cell, so the cells share single hairlines. Each cell is 260px tall, relatively positioned with overflow hidden, and lays its content out with flex-col justify-end. Absolutely position the speaker's two INITIALS in the top-right corner in the display face at 8rem in the ghost tone at 55% opacity, overflowing the corner slightly. Over it, the speaker name in display caps at 24px in full pale pink, then role and studio on two lines in mono 12px at 62%. Never use a photo, an avatar circle or a placeholder image, and make sure the initials actually match the name."
      },
      {
        "part": "Inverted agenda timetable",
        "prompt": "One section that INVERTS the system: background pale pink #FEDEE1, all text deep oxblood #70020F, rules at 22% oxblood. A mono section label, then per day a display heading (DAY 01 with a 50%-opacity WORKSHOPS beside it) followed by a table of five rows. Each row is a flex line with 24 to 32px vertical padding and a hairline bottom border: a fixed 8rem mono time column (09:00), a flexible middle with the session title in display caps at 20 to 24px and the speaker under it in mono 12px, and a right-aligned 8rem mono stage tag at 60% (ROOM A / MAIN STAGE / FOYER). Rows stack to a single column below 768px. This inverted block should be the most legible surface on the whole page."
      },
      {
        "part": "Ticket tiers",
        "prompt": "Three equal columns with 32px gaps, each a card with 1px hairline border, zero radius and 32px padding, laid out flex-col so the buttons align at the bottom. Tier name in display caps 24px, price in the DISPLAY face at 3rem (not mono, it is the conversion number), then a hairline-ruled list of three feature rows in mono 12px at FULL pale-pink strength. Render the sold-out tier at 50% opacity with the name and price struck through and a bordered SOLD OUT block instead of a button. Render the middle tier as a solid black card with a pale-pink filled button. Render the third with a bordered button that inverts to pale pink on hover."
      },
      {
        "part": "Venue and sponsor tiers",
        "prompt": "Venue: three columns, each a 10px mono label at 62% over a display-caps value at 28px over two or three lines of 15px body text. Sponsors: a hairline-ruled stack of three tier ROWS, not a centered logo cloud. Each row is a flex line with a fixed 10rem mono tier label on the left (PRESENTING / SUPPORTING / MEDIA AND PRINT) and, on the right, the sponsor names set in the display face and wrapped in a flex-wrap row, sized down per tier (48px, 30px, 20px) with the last tier dimmed to 62%. Use obviously fictional names only, and never render a real company's name as a sponsor."
      },
      {
        "part": "Closing CTA and footer",
        "prompt": "A section with overflow hidden. A flex row that stacks on mobile: on the left a two-line display headline at clamp(2.5rem, 6vw, 4rem) plus a mono scarcity line underneath (seat count and a sales-close date); on the right, bottom-aligned, the solid black button in display caps. Do NOT centre this block. Absolutely position the brand word one last time at the bottom of the section in the display face at clamp(10rem, 25vw, 25rem), in the ghost tone at 17% opacity, translated down 8% so it bleeds off the page edge and is clipped. Over it, a footer row with the copyright left and two mono links right."
      }
    ]
  },
  "special_ui_components": [
    {
      "component": "Tone-on-tone ghost wordmark",
      "description": "The device that gives a flat single-color page real depth without a gradient, a glow or a photo: the same word repeated at enormous size in a slightly lighter value of the ground, bleeding off the edge and clipped by its section.",
      "prompt": "Give the section position: relative and overflow: hidden. Inside it, absolutely position a div holding the brand word in the display face at clamp(10rem, 30vw, 30rem) with line-height 1, colored in the ghost tone (a value roughly 8% lighter than the ground, e.g. #8A0A18 on #70020F), user-select none and pointer-events none, positioned so it runs past the right or bottom edge and gets clipped. Keep live content in a sibling with position relative and a higher z-index. The ghost must be readable as letterforms, never a blur or a texture, and it must never be lighter than the live type."
    },
    {
      "component": "Inverted timetable spread",
      "description": "One interior section that flips the whole color system, borrowed from how a printed program alternates spreads. It makes the schedule the highest-contrast surface on the site, which is what most event visitors actually came to read.",
      "prompt": "Define an .inverted class that swaps the palette wholesale: background becomes the pale tint, color becomes the deep hue, and the rule color becomes a 22% alpha of the deep hue. Apply it to exactly ONE full-bleed section, the one carrying the densest information. Inside, build a timetable of flex rows with a fixed mono time column, a flexible title column in display caps with a mono sub-line, and a right-aligned mono location tag, each row separated by a hairline. Do not invert more than one section or the effect stops reading as a deliberate spread."
    },
    {
      "component": "Hairline-shared grid",
      "description": "A grid of cells that share single one-pixel rules instead of each carrying its own border, so the whole block reads as one ruled sheet rather than a set of floating cards.",
      "prompt": "Put border-top and border-left on the grid CONTAINER and border-right plus border-bottom on EACH cell, all in the same 28%-alpha hairline color, with zero gap and zero radius. Cells get internal padding rather than external margin. The result must read as a single ruled table, so never add a shadow, a background fill or a corner radius to an individual cell."
    },
    {
      "component": "Sponsor tier rows",
      "description": "The alternative to a centered logo cloud: sponsors set as typography in ruled tiers, which keeps the page's system intact and avoids fabricating borrowed brand marks.",
      "prompt": "Build three flex rows separated by hairlines. Each row has a fixed-width mono tier label on the left at 62% opacity (PRESENTING / SUPPORTING / MEDIA AND PRINT) and a flex-wrap group of sponsor names on the right, set in the display face and stepped down by tier (roughly 48px, 30px, 20px) with items baseline-aligned. Use invented names only. Never render a real company's wordmark or name, and never substitute grey placeholder logo rectangles."
    }
  ]
}
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
