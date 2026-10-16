# Tablecloth — Data tables you actually want to look at

- **Category:** Dashboard
- **Slug:** `tablecloth-data-tables-you-actually-want-to-look-at`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** table, data-table, crm, status-badge, progress-bar, avatar, saas, dashboard, light, cream, sky-blue, coral, poppins, rounded, pill

---

## Architectural Philosophy & Overview
A warm light-SaaS marketing page built around data-table cards: avatar cells with presence dots, pill status badges with leading dots, inline usage progress bars, and due-date chips, on cream paper with a sky-blue + coral palette and fully rounded cards in Poppins.

---

## Production System Prompt Specification
```
{
  "summary": "A friendly light-SaaS marketing page for a table-generator product ('Tablecloth'), built around two data-table cards: a floating hero preview ('Active accounts') and a full 6-row 'Customer roster' showcase. Each row pairs an avatar cell with a live presence dot, a pill status badge with a leading dot, a slim inline progress bar with a percentage, and a due-date chip. The look is warm-cream paper with a sky-blue primary and coral secondary, fully rounded cards (rounded-4xl / 2rem) on soft sky-tinted shadows, Poppins throughout, a sticky blurred nav, and a responsive reflow where the desktop CSS-grid columns stack into 2-up labelled card rows on mobile.",
  "style": {
    "description": "A warm, playful light-SaaS aesthetic on a cream paper canvas (#fdf9f3) with a dark indigo-ink text color (#2c2a3a), a sky-blue primary family (#38bdf8 / deep #0ea5e9 / soft #e0f5ff) and a coral secondary family (#fb7185 / deep #f43f5e / soft #ffe7eb). Status colors are semantic: emerald for healthy/active, amber for at-risk, coral for churning, neutral ink for invited/pending. Cards are heavily rounded (2rem 'rounded-4xl') white surfaces floating on soft, colored, long-throw shadows (sky-tinted on cards, coral-tinted on lifts) over a faint radial-dot paper grain, with hairline ink/5 borders and ring outlines. Everything is set in Poppins (400-800). The mood is approachable and rounded rather than corporate: pill badges, pill buttons, gentle float animation, and a hand-drawn coral highlight swipe under a hero word.",
    "prompt": "Use a warm light-SaaS design system. Page background cream #fdf9f3; primary text 'ink' #2c2a3a. Primary color 'sky' #38bdf8 with deep #0ea5e9 and soft #e0f5ff; secondary 'coral' #fb7185 with deep #f43f5e and soft #ffe7eb. Semantic status palette: emerald (bg emerald-50 / text emerald-600 / dot emerald-500) = active/healthy, amber (bg amber-50 / text amber-600 / dot amber-500/amber-400 bar) = at risk, coral (bg coral-soft / text coral-deep / dot coral) = churning, neutral (bg cream / text ink/55 / dot ink/30) = invited/pending. Typeface: Poppins from Google Fonts (weights 400/500/600/700/800) for everything; headings are font-extrabold tracking-tight, body is text-ink at /45 /55 /60 /65 opacities for hierarchy. Add a faint paper grain via radial-gradient(rgba(44,42,58,0.04) 1px, transparent 1px) on a 22px tile. Cards are white, fully rounded (border-radius 2rem, Tailwind 'rounded-4xl'; smaller cards rounded-3xl/2xl), with a 1px ring-ink/5 and a soft long-throw colored shadow: card shadow '0 18px 50px -22px rgba(56,189,248,0.45)' (sky-tinted), soft shadow '0 10px 30px -16px rgba(44,42,58,0.30)', lift shadow '0 26px 70px -30px rgba(251,113,133,0.45)' (coral-tinted). Buttons and tags are pills (rounded-full); the primary CTA is a sky->sky-deep gradient pill with the card shadow that lifts (-translate-y-0.5) on hover, the dark CTA is a solid ink pill. Big blurred color blobs (bg-sky/25 and bg-coral/20, blur-3xl) sit behind the hero. No drop shadows that read as gray boxes: depth is warm, tinted, and soft."
  },
  "layout_and_structure": {
    "description": "A standard centered marketing page: every section uses a `mx-auto max-w-7xl px-6 lg:px-8` container. A sticky blurred header tops the page, then a two-column hero (copy left, a floating table-preview card right with a float animation and a floating prompt chip), a thin centered trust strip, the main 'showcase' section with a full 6-row customer table card (toolbar + grid column header + rows + pagination footer), a 4-up component-kit grid, a 3-step 'how it works' band, a dark rounded CTA banner, and a footer. The data tables are built as CSS grids (not <table>): a desktop column-header row plus row divs sharing the same `grid-template-columns`, reflowing to a 2-column labelled card layout below lg/sm.",
    "prompts": [
      {
        "part": "Sticky blurred nav",
        "prompt": "A `<header class=\"sticky top-0 z-50 backdrop-blur-md bg-cream/80 border-b border-ink/5\">` with an inner `mx-auto max-w-7xl px-6 lg:px-8` and a `flex items-center justify-between h-[72px]` nav. Left: a wordmark = a 36x36 (h-9 w-9) rounded-xl gradient tile (bg-gradient-to-br from-sky to-sky-deep, white Phosphor ph:table-bold icon, card shadow, rotate-6 on group hover) next to 'Tablecloth' in text-lg font-extrabold tracking-tight. Center (hidden md:flex, gap-9, text-sm font-medium text-ink/70): Showcase / Components / How it works / Pricing, each hover:text-ink. Right: a ghost 'Sign in' link (hidden sm:inline) plus a solid ink pill CTA 'Open canvas' (rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-soft) with a trailing ph:arrow-up-right-bold icon."
      },
      {
        "part": "Two-column hero with floating table preview",
        "prompt": "A `relative overflow-hidden` hero on the grain background with two big blurred blobs (an absolute -top-32 -right-24 h-80 w-80 rounded-full bg-sky/25 blur-3xl, and a top-40 -left-24 h-72 w-72 rounded-full bg-coral/20 blur-3xl). Inside the max-w-7xl container, a `grid lg:grid-cols-[1.05fr,1.25fr] gap-14 lg:gap-12 items-center`. LEFT column: a soft pill eyebrow badge (bg-sky-soft text-sky-deep, ph:sparkle-fill, 'Prompt -> production table'), an `text-5xl sm:text-6xl lg:text-[4.1rem] font-extrabold leading-[1.04] tracking-tight` H1 where one phrase ('actually want') sits above a hand-drawn coral highlight (an absolute bottom-1.5 h-4 bg-coral/35 -rotate-1 rounded-sm behind the text), a max-w-md text-lg text-ink/65 paragraph, a button row (a sky->sky-deep gradient pill 'Generate a table' with ph:magic-wand-fill + a white bordered pill 'See it live'), and a social-proof row (an overlapping -space-x-2.5 avatar stack ringed in cream + a coral '9k' counter chip, then 'Loved by 9,000+ builders'). RIGHT column: the floating preview card (see special components)."
      },
      {
        "part": "Trust strip",
        "prompt": "A thin `border-y border-ink/5 bg-white/60` band, max-w-7xl, py-7, with a centered `flex flex-wrap items-center justify-center gap-x-12 gap-y-4` row in muted ink: an uppercase tracking-widest label 'Drop-in ready for' followed by 5 inline icon+label lockups (React via ph:atom-bold, Vue/Svelte/Tailwind via simple-icons, Figma via ph:figma-logo-bold), each font-bold text-ink/55."
      },
      {
        "part": "Showcase full data-table card (CSS-grid table)",
        "prompt": "A `rounded-4xl bg-white shadow-soft ring-1 ring-ink/5 overflow-hidden` card holding the main table. (a) Toolbar: a `flex flex-wrap items-center justify-between gap-4 px-6 lg:px-8 py-5 border-b border-ink/5` row, left = a sky-soft rounded-xl icon tile (ph:users-three-bold) + a 'Customer roster' title and '128 members - 6 shown' subline; right = a cream search pill ('Search members', ph:magnifying-glass-bold, hidden sm:flex) + a solid ink 'Add' pill (ph:plus-bold). (b) Column header: a `hidden lg:grid grid-cols-[2fr,1fr,1fr,1.7fr,1.2fr,0.5fr] gap-4 px-6 lg:px-8 py-3.5 bg-cream/70 text-[0.66rem] font-bold uppercase tracking-wider text-ink/40` row = Member / Plan / Status / Usage / Renews (text-right) / (empty). (c) Rows: a `divide-y divide-ink/5` stack of 6 row divs, each `row-hover grid grid-cols-2 lg:grid-cols-[2fr,1fr,1fr,1.7fr,1.2fr,0.5fr] gap-x-3 gap-y-4 lg:gap-4 px-6 lg:px-8 py-5 lg:py-4 lg:items-center`, holding an avatar cell, a plan badge, a status badge, a usage progress cell, a renews date/chip, and a hidden-lg ph:dots-three-bold action. (d) Pagination footer: a `flex items-center justify-between px-6 lg:px-8 py-4 border-t border-ink/5 text-sm text-ink/50` row, left 'Showing 1-6 of 128', right a pager (caret-left, an active sky-filled '1' square button, ghost 2/3, caret-right). The grid uses identical grid-template-columns on the header and rows so columns align perfectly."
      },
      {
        "part": "Responsive table reflow",
        "prompt": "The table is NOT a <table>: it's CSS grid so it can reflow. On lg+ each row is a 6-track grid (2fr,1fr,1fr,1.7fr,1.2fr,0.5fr) with the desktop column-header row visible. Below lg the header hides and each row becomes `grid-cols-2` cards: the avatar cell and usage cell span both columns (col-span-2 lg:col-span-1), plan/status sit side by side, and each cell shows a tiny uppercase field label (.fld-label: display none, shown only under 1023px, text-[0.6rem] font-bold uppercase tracking, color ink/40) so the value keeps its meaning without a header. The trailing dots action is hidden lg:block. The hero preview table uses a simpler `hidden sm:grid grid-cols-[1.7fr,1fr,1.4fr,0.9fr]` that collapses below sm."
      },
      {
        "part": "Component kit + steps + dark CTA + footer",
        "prompt": "Below the table: a white `border-y border-ink/5` section with a centered heading and a `grid sm:grid-cols-2 lg:grid-cols-4 gap-6` of 4 cream rounded-3xl cards (Avatar cells / Status badges / Progress bars / Due-date chips), each with a white rounded-xl icon tile and a small live demo of that primitive inside a white rounded-2xl shadow-soft inset. Then a 'How it works' band: `grid lg:grid-cols-3 gap-8`, left = heading + a coral->coral-deep gradient pill CTA, right = `lg:col-span-2 grid sm:grid-cols-3 gap-5` of 3 white step cards each with a giant translucent number (text-5xl font-extrabold text-sky/30 or coral/30) 01/02/03. Then a CTA banner: a `rounded-[2.4rem] bg-gradient-to-br from-ink to-[#3a3852] px-8 lg:px-16 py-14 lg:py-20 text-center` dark panel with two blurred sky/coral blobs, a white H2, a white/65 subline, a sky pill 'Start free' + a white/10 glass 'Book a demo', and a white/45 reassurance line. Footer: a cream `flex flex-col md:flex-row items-center justify-between` row with the wordmark, nav links, two round social icon buttons, and a centered copyright hairline."
      }
    ]
  },
  "special_ui_components": [
    {
      "name": "Avatar cell with presence dot",
      "prompt": "A horizontal cell: a `relative shrink-0` wrapper holding a rounded-full object-cover photo (h-10/h-11) plus an absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full presence dot ring-2 ring-white whose color is semantic (bg-emerald-400 = online/active, bg-amber-400 = at risk, bg-coral = churning, bg-ink/20 = invited/offline), next to a two-line label = a text-sm font-semibold truncate name over a text-xs text-ink/45 truncate secondary line (email or 'Company - Plan'). Wrap name/secondary in a min-w-0 + truncate so long values clip instead of breaking the grid."
    },
    {
      "name": "Pill status badge with leading dot",
      "prompt": "A `.badge` = inline-flex items-center gap-[.4rem] font-semibold text-[.72rem] px-[.7rem] py-[.28rem] rounded-full leading-none, tinted by state: Active = bg-emerald-50 text-emerald-600 with a bg-emerald-500 dot; At risk = bg-amber-50 text-amber-600 with a bg-amber-500 dot; Churning = bg-coral-soft text-coral-deep with a bg-coral dot; Invited = bg-cream text-ink/55 with a bg-ink/30 dot. The leading dot is a 1.5x1.5 (h-1.5 w-1.5) rounded-full span. Reuse the same .badge for plan tags (Pro = bg-sky-soft text-sky-deep, Team/Free = bg-cream text-ink/60) and date chips."
    },
    {
      "name": "Inline usage progress bar",
      "prompt": "A usage cell: a `flex items-center justify-between text-xs mb-1.5` row with a font-bold value ('8.4k / 10k credits') and a text-ink/40 percentage, above a `.progress-track` (bg #eef0f4, rounded-full, overflow-hidden, h-2) containing a `.progress-bar` (height 100%, rounded-full) whose width is the percentage and whose fill color encodes health: bg-sky for healthy/high, bg-amber-400 for mid/at-risk, bg-coral for low/churning, bg-ink/15 for none."
    },
    {
      "name": "Due-date chip (with overdue state)",
      "prompt": "A right-aligned date chip reusing .badge: an upcoming date = bg-sky-soft text-sky-deep ('Jul 02', optionally a ph:clock-bold icon), a soon/relative date = bg-cream text-ink/55 ('Tomorrow'), and an overdue date = bg-coral-soft text-coral-deep ('Overdue', optionally ph:warning-bold). In the full table the 'Renews' cell can also be plain text (text-sm text-ink/60 date) or a muted 'Pending' (text-ink/40)."
    },
    {
      "name": "Floating hero preview card",
      "prompt": "The hero centerpiece: a `relative` wrapper with a `.marquee` float animation (translateY 0 to -9px over 7s ease-in-out infinite), a blurred -inset-3 rounded-[2.4rem] sky/coral gradient glow behind it, and the card itself `relative rounded-4xl bg-white shadow-card ring-1 ring-ink/5 overflow-hidden`: a header ('Active accounts' + 'Q2 customer success board' + two cream icon buttons funnel/export), a `hidden sm:grid grid-cols-[1.7fr,1fr,1.4fr,0.9fr]` cream column header (Member/Status/Onboarding/Due), 4 rows reusing the avatar+badge+progress+date-chip primitives, and a floating dark prompt chip pinned -bottom-5 -left-4 (rounded-2xl bg-ink text-white shadow-lift, a coral ph:chat-circle-dots-fill icon + the quoted prompt \"a CRM board with status badges + progress\")."
    }
  ],
  "special_notes": "Stack: Tailwind (CDN) with a custom theme, Poppins via Google Fonts, Phosphor + Simple Icons via Iconify (icons used: ph:table-bold, ph:arrow-up-right-bold, ph:sparkle-fill, ph:magic-wand-fill, ph:funnel-bold, ph:export-bold, ph:users-three-bold, ph:magnifying-glass-bold, ph:plus-bold, ph:dots-three-bold, ph:caret-left/right-bold, ph:identification-badge-bold, ph:seal-check-bold, ph:chart-bar-horizontal-bold, ph:calendar-dots-bold, ph:clock-bold, ph:warning-bold, ph:chat-circle-dots-fill, ph:path-fill, ph:squares-four-fill, ph:stack-fill, ph:atom-bold, ph:figma-logo-bold, ph:x-logo-bold, ph:github-logo-bold, simple-icons:vuedotjs/svelte/tailwindcss). Exact tokens: cream #fdf9f3 (page), ink #2c2a3a (text, used at /40 /45 /55 /60 /65 /5 opacities), sky #38bdf8 / sky-deep #0ea5e9 / sky-soft #e0f5ff (primary), coral #fb7185 / coral-deep #f43f5e / coral-soft #ffe7eb (secondary), progress track #eef0f4, dark CTA gradient ink -> #3a3852. Tailwind extras: borderRadius '4xl' = 2rem; boxShadow card '0 18px 50px -22px rgba(56,189,248,0.45)', soft '0 10px 30px -16px rgba(44,42,58,0.30)', lift '0 26px 70px -30px rgba(251,113,133,0.45)'. Key technique: the data tables are CSS grids (matching grid-template-columns on the header row and the row divs) rather than <table> elements, which is what lets them reflow to labelled 2-up cards on mobile via the .fld-label helper (hidden on lg, shown below 1023px). Use min-w-0 + truncate on text cells so long names/emails clip instead of overflowing the grid track."
}

```
