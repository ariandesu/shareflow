# Landing Page UI: Online Course Website Where Finished Modules Peel Off a Sticker Sheet

**Category:** Landing Page  
**Tags:** landing, landing-page, course, online-course, education, edtech, curriculum, sticker-sheet, die-cut, kiss-cut, peel, material, blush, pink, navy, crimson, league-spartan, responsive  
**Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)  
**Live Preview:** [https://p.superdesign.dev/draft/5d0dcbba-2822-4345-9c25-c49cb6bc7267](https://p.superdesign.dev/draft/5d0dcbba-2822-4345-9c25-c49cb6bc7267)  
**Local Standalone Preview:** `previews/landing-page-ui-online-course-website-where-finished-modules-peel-off-a-sticker-sheet.html`

---

## Architectural & Aesthetic Breakdown
A course landing page UI where the curriculum is a die-cut STICKER SHEET — an online course website design on a blush pink ground where every student is mailed the 8 modules as kiss-cut stickers: finish a module, peel its sticker, press it on your laptop lid. The hero shows a finished student's sheet (8 empty dated wells) next to her laptop lid carrying all 8 peeled stickers; the curriculum section is the fresh sheet itself, a cream backing panel with 8 same-size module stickers in a crimson/cream two-tone checkerboard, each ringed by a dashed kiss-cut contour, the first sticker's corner lifted. Three material states replace every progress bar: intact sticker (module ahead), lifted corner (peel next), empty dated well (finished). Navy League Spartan headline, Poppins everywhere else, one arced-text instructor seal, navy enroll band. Reusable for any course, curriculum, bootcamp, or milestone-based product landing page.

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{
  "summary": "A marketing LANDING PAGE for an online course whose signature is a physical, mailed KISS-CUT STICKER SHEET curriculum, built entirely out of that material system on a blush pink #f3c9d5 ground with deep navy #1A2540 ink, crimson #cc2b3f accent, and cream #f2e9db backing paper. The page's repeating unit is a sticker's MATERIAL STATE: an INTACT sticker (a chunky rounded badge ringed by a thin dashed kiss-cut contour) means a module still ahead; a LIFTED CORNER (a folded CSS triangle with a hatched shadow under it) means the module you peel next; an EMPTY WELL (the dashed ring with a faint silhouette on the backing, printing the module name and a peel date) means finished. The hero pairs a left-aligned navy League Spartan headline with the proof exhibit: a finished student's completed sheet (8 empty dated wells, dates ascending across six weeks) overlapping her navy laptop lid carrying all 8 peeled stickers, fills and icons matching the sheet sticker-for-sticker, captioned with the checkable claim that every sticker missing from the sheet is on the lid. The curriculum section IS the fresh sheet: a cream backing panel with a soft shadow floating on the blush ground, holding 8 same-size module stickers in a 4x2 grid (2-up on mobile), alternating crimson-filled (cream text) and cream-tint (crimson text and a printed crimson ring) in a checkerboard, each carrying a big numeral, a simple line icon, the module name and its duration, with sticker 01's corner pre-lifted. Below: a three-state 'how your sheet works' legend, one arced-text SVG roundel instructor seal, and a navy enroll band with a single crimson pill button. Flat print-like color, no gradients (only two hard-stop patterns: the corner fold and the hatch), no photos, fully responsive.",
  "style": {
    "description": "Print-shop material design: the page reads as a real sticker sheet product, not a themed illustration. Blush #f3c9d5 ground, navy #1A2540 ink, crimson #cc2b3f load-bearing accent, cream #f2e9db backing paper \u2014 a riso two-ink logic where every module sticker is either crimson-filled with cream print or cream-tint with crimson print, alternating in a checkerboard so the eight read as one set. The kiss-cut dashed contour, the folded lifted corner, the hatched peel shadow and the dated empty wells are the entire ornament vocabulary; there are no gradients, no glows, no photos. League Spartan 800 carries the navy headlines; Poppins does everything else. Uppercase is rationed to the enroll pills and one eyebrow.",
    "prompt": "Design a course landing page as a MATERIAL system: the curriculum is a physical kiss-cut sticker sheet and every element derives from sticker states. Ground the whole page in blush pink #f3c9d5 with deep navy #1A2540 ink and crimson #cc2b3f as the only load-bearing accent; render sheet backing in cream #f2e9db. Make every module sticker a chunky same-size rounded badge ringed by a thin dashed kiss-cut contour, alternating crimson-filled (cream text) with cream-tint (crimson text plus a printed crimson border ring) in a checkerboard. Express progress ONLY through material states: intact sticker, lifted folded corner with a hatched shadow, or an empty dashed well with a faint silhouette and a printed peel date on the backing. Set headlines in League Spartan 800 navy, all other text in Poppins. Flat print-like color throughout: no gradients, no glows, no photos, no progress bars, no percent counters. Ration uppercase to the CTA pill and one eyebrow."
  },
  "layout_and_structure": {
    "description": "Slim nav (wordmark left, one crimson enroll pill right) \u2192 hero: left column with eyebrow, two-line navy League Spartan headline, one-sentence subline about the mailed sticker-sheet curriculum, and a stat chip ('8 modules \u00b7 9 h 20 m \u00b7 peel as you go'); right column the proof exhibit \u2014 the finished student's sheet of 8 empty dated wells slightly rotated, overlapped by a navy laptop lid carrying the 8 peeled stickers, with an italic caption stating the conservation claim beneath. Then the curriculum as the page's biggest mass: a cream sheet panel on the blush ground holding the 8 module stickers in a 4x2 checkerboard grid. Then a three-state material legend, an instructor section (arced-text roundel seal + short bio), a navy enroll band, and a small cream footer. On mobile the hero exhibit stacks vertically (sheet above lid, both fully visible) and the sticker grid drops to 2-up.",
    "prompts": [
      {
        "part": "Hero with the finished-sheet proof exhibit",
        "prompt": "Build a hero whose right side is a physical proof exhibit: a cream #f2e9db sheet card (slightly rotated, soft shadow) containing a 2-column grid of 8 EMPTY kiss-cut wells \u2014 each a dashed blossom-pink ring with a faint pink silhouette, printing the module number, its full name, and a peel date in ascending order spanning six weeks \u2014 overlapped by a navy #1A2540 rounded laptop lid carrying the 8 peeled stickers at slight rotations, each printing the same numeral, icon and fill as its well's original sticker. Left side: a small crimson eyebrow, a two-line navy League Spartan headline, a one-sentence subline explaining the mailed sticker-sheet curriculum, and a bordered stat chip with module count, exact total duration and 'peel as you go'. Below the exhibit, an italic caption stating the checkable claim: every sticker missing from the sheet is on the lid."
      },
      {
        "part": "The curriculum as a fresh kiss-cut sheet",
        "prompt": "Render the curriculum as the actual product: a large cream #f2e9db backing panel with rounded corners and a soft shadow floating on the blush ground, titled 'Your sheet: eight modules'. Inside, a 4x2 grid (2-up on mobile) of 8 same-size sticker badges, each ringed by a thin dashed navy kiss-cut contour: big display numeral, a simple line icon, the module name, and its duration printed small. Alternate crimson-filled stickers (cream print) with cream-tint stickers (crimson print and a 2px printed crimson ring) in a checkerboard. Give sticker 01 a lifted corner: a folded triangle made with a hard-stop CSS gradient plus a hatched shadow peeking from under the fold. All stickers identical in size regardless of duration \u2014 duration is printed, never drawn."
      },
      {
        "part": "Three-state material legend",
        "prompt": "Explain the system with three states of ONE sticker side by side, each a small cream backing card: (1) the intact sticker \u2014 'Intact sticker: module ahead.'; (2) the same sticker with a folded lifted corner and hatched shadow \u2014 'Lifted corner: the module you peel next.'; (3) the empty well \u2014 a dashed ring with a faint silhouette printing the module name and 'Peeled' plus a date \u2014 'Empty well: module finished. Date recorded.' One short sentence under each; no icons, no progress bars."
      },
      {
        "part": "Instructor seal and enroll band",
        "prompt": "Introduce the instructor with ONE arced-text roundel seal: a crimson circle with a dashed cream inner ring, the instructor name curved along the top arc and the course specialty along the bottom arc via SVG textPath (size the text to the arc so it never clips; draw the bottom path left-to-right through the bottom so it reads upright), a simple centered line icon; set 2-3 sentences of bio beside it. Close with a full-width navy #1A2540 band with a thick crimson top border: heading, one line listing lifetime access with the exact module count and total duration, a line noting the physical sheet is mailed, and a single crimson pill button whose wording exactly matches the nav pill."
      }
    ]
  },
  "special_ui_components": [
    {
      "component": "Kiss-cut sticker badge (two-tone set)",
      "description": "The repeating curriculum unit: a same-size rounded sticker ringed by a dashed die-cut contour, alternating crimson-filled and cream-tint.",
      "prompt": "Build one reusable STICKER BADGE: a chunky rounded square with a big display numeral, a simple line icon, a name and a small printed duration, wrapped by a thin dashed kiss-cut contour offset just outside its edge. Make two colorways and alternate them in a checkerboard: crimson #cc2b3f filled with cream print, and cream #f2e9db tint with crimson print plus a 2px printed crimson ring. Keep every badge the same size regardless of its data."
    },
    {
      "component": "Lifted-corner peel invitation",
      "description": "A folded corner with a hatched shadow marking the next module \u2014 the material call to action.",
      "prompt": "On exactly one sticker, fold the bottom-right corner: a CSS triangle from a hard-stop two-color linear-gradient (backing color over the sticker fill) with a small drop shadow on the fold, and a hatched pattern (repeating-linear-gradient in blossom pink #EF9CC0) peeking out beneath it as the peel shadow. This single lifted corner is the page's only 'start here' affordance besides the CTA pill."
    },
    {
      "component": "Empty dated well",
      "description": "The record of a finished module: the sticker's absence, printed with its peel date.",
      "prompt": "Render a finished module as the sticker's ABSENCE: the same footprint holding only a dashed blossom-pink kiss-cut ring, a faint pink silhouette tint, and small printed backing text \u2014 the module numeral in blossom pink, the full module name in navy, and a 'Peeled [date]' line in muted navy sentence case. Never use checkmarks, progress bars or percent counters; the empty well IS the completion record."
    },
    {
      "component": "Sticker-conservation proof exhibit",
      "description": "A finished sheet and a laptop lid whose stickers match one-to-one \u2014 completion argued by conservation.",
      "prompt": "Pair a completed sheet (all wells empty and dated, dates ascending) with a navy laptop lid carrying the peeled stickers at slight rotations. Every lid sticker must match its well by number, fill colorway and printed icon, and the set must be exactly complete: state the claim in a caption ('All stickers missing from the sheet are on the lid') and honour it in the markup so a reader can verify it by counting."
    },
    {
      "component": "Arced-text instructor seal",
      "description": "One roundel seal with curved text top and bottom \u2014 the page's single uppercase flourish.",
      "prompt": "Draw one SVG roundel seal: a crimson circle, a dashed cream inner ring, a name curved along the top arc and a specialty along the bottom arc via textPath (top path sweeps over the top; bottom path drawn left-to-right through the bottom so the text reads upright; size each string to its arc length so nothing clips), and a simple centered cream line icon. Use it once, for the instructor \u2014 it is the page's only decorative uppercase."
    }
  ]
}
```

---
*Generated by ShareFlow Design Prompt Library · © 2026 Mahir Faisal (MHR3D)*
