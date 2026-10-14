# ShareFlow Wallpaper Store & Admin Management Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Pivot ShareFlow's monetization catalog from obsolete developer boilerplate code to premium curated 4K/8K wallpaper bundles and digital art packs, complete with an administrative portal for manual and programmatic bundle management.

**Architecture:** 
1. **Data & Storage:** Structured `data/wallpapers.json` repository supporting both manual administrative submission and automated programmatic ingestion by Sanctuary/Sera.
2. **API & Server:** Dual-environment CRUD endpoints (`server.ts` Express runtime and `functions/api/wallpapers.ts` Cloudflare Pages Functions) secured by Telegram 2FA administrative session tokens.
3. **Frontend Store:** Visual gallery in `src/pages/Products.tsx` (aliased to `/wallpapers` and `/products`) with resolution badges, responsive image cards, category filters, and 5-step Adsterra sponsor unlock + Gumroad coupon minting.
4. **Admin Dashboard:** Wallpaper management tab in `src/pages/AdminDashboard.tsx` with a bundle creation form, live thumbnail previews, publish/unpublish toggles, and catalog metrics.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Express 4 / Cloudflare Pages Functions, Adsterra Smart Link, Gumroad API.

---

### Task 1: Define Wallpaper Bundle Schema & Initial Catalog Data

**Objective:** Create the core TypeScript model and seed initial wallpaper catalog entries with high-resolution metadata.

**Files:**
- Create: `/home/mahir-linux/Development/shareflow/src/types/wallpaper.ts`
- Create: `/home/mahir-linux/Development/shareflow/data/wallpapers.json`

**Step 1: Create Wallpaper TypeScript definitions**
Define interface `WallpaperBundle` in `src/types/wallpaper.ts`:
```typescript
export interface WallpaperBundle {
  id: string;
  title: string;
  description: string;
  category: "Desktop 8K" | "Mobile OLED" | "Dual Monitor" | "3D Sci-Fi" | "Minimalist Dark";
  resolution: string;
  itemCount: number;
  format: string;
  previewUrl: string;
  sampleImages?: string[];
  price: string;
  downloadUrl: string;
  gumroadBaseUrl: string;
  features: string[];
  tags: string[];
  featured?: boolean;
  active: boolean;
  createdAt: string;
}
```

**Step 2: Initialize Seed Catalog**
Populate `data/wallpapers.json` with initial curated sets:
- "Cyberpunk Neo Tokyo 8K Pack" (Desktop 8K, 15 PNGs, OLED deep blacks)
- "Deep Cosmos & Nebula 8K Series" (Desktop & Mobile, 12 PNGs, HDR10)
- "Minimalist Obsidian OLED Collection" (Mobile OLED, 20 PNGs, 100% True Black)
- "Futuristic Mech & Cybernetic 3D Renders" (Dual Monitor & UltraWide, 10 PNGs)

**Step 3: Verification**
Verify JSON syntax with Node:
```bash
node -e "const d = JSON.parse(fs.readFileSync('/home/mahir-linux/Development/shareflow/data/wallpapers.json', 'utf8')); console.log('Loaded ' + d.length + ' bundles');"
```
Expected: `Loaded 4 bundles`

---

### Task 2: Backend API Endpoints for Wallpaper Management

**Objective:** Implement REST endpoints for fetching, creating, updating, and deleting wallpaper bundles in both `server.ts` and `functions/api/wallpapers.ts`.

**Files:**
- Modify: `/home/mahir-linux/Development/shareflow/server.ts`
- Create: `/home/mahir-linux/Development/shareflow/functions/api/wallpapers.ts`
- Create: `/home/mahir-linux/Development/shareflow/functions/api/wallpapers/[id].ts`

**Step 1: Implement Express Endpoints in `server.ts`**
- `GET /api/wallpapers`: Reads `data/wallpapers.json`. If `?all=true` and valid admin header, returns all items; otherwise returns only active items.
- `POST /api/wallpapers`: Requires admin token (`sf_admin_authed_token` or Telegram 2FA session). Validates payload and prepends/updates the bundle in `data/wallpapers.json`.
- `DELETE /api/wallpapers/:id`: Admin-only removal of bundle by ID.

**Step 2: Implement Cloudflare Pages Function in `functions/api/wallpapers.ts`**
- Handle `GET`, `POST`, and `DELETE` requests utilizing Cloudflare KV (with fallback to default seed array).

**Step 3: Verification**
Test local endpoints with curl:
```bash
curl -s http://localhost:3000/api/wallpapers | grep -o "Cyberpunk"
```
Expected: `Cyberpunk`

---

### Task 3: Redesign Storefront (`src/pages/Products.tsx`) into Wallpaper Gallery

**Objective:** Transform the product showcase from developer boilerplates to a high-aesthetic wallpaper bundle storefront with live API data and category filtering.

**Files:**
- Modify: `/home/mahir-linux/Development/shareflow/src/pages/Products.tsx`

**Step 1: Replace Hardcoded Boilerplates with Dynamic Wallpaper Hook**
- Fetch bundles on mount from `/api/wallpapers` with fallback to default seed bundles.
- Add category filter tabs: All, Desktop 8K, Mobile OLED, Dual Monitor, 3D Sci-Fi, Minimalist Dark.

**Step 2: Build Visual Wallpaper Card Layout**
- Aspect ratio preview banner (16:9 / 21:9 preview image with zoom-on-hover effect).
- Resolution badges ("8K UHD", "OLED Deep Black", "UltraWide 21:9").
- Device compatibility indicator (Monitor icon for Desktop, Smartphone icon for Mobile).
- Feature pill checklist (e.g., "15 Uncompressed PNGs", "Zero Compression", "Commercial License").
- "Free Unlock via Sponsor" primary action button.

**Step 3: Update 5-Step Sponsor Unlock & Gumroad Modal**
- Maintain existing 5-step Adsterra Smart Link verification progression.
- Connect unlock completion to `/api/mint-coupon` to generate 100% OFF coupon for the selected wallpaper's `gumroadBaseUrl`.

**Step 4: Verification**
Run build test:
```bash
npm --prefix /home/mahir-linux/Development/shareflow run lint
```
Expected: Clean compilation with no TypeScript errors.

---

### Task 4: Add Wallpaper Bundle Manager to Admin Dashboard

**Objective:** Add a dedicated "Wallpapers" management tab in `AdminDashboard.tsx` to let Mahir manually create, publish, and delete wallpaper bundles.

**Files:**
- Modify: `/home/mahir-linux/Development/shareflow/src/pages/AdminDashboard.tsx`

**Step 1: Add Tab & State**
- Add `"wallpapers"` to `activeTab` union type:
  `const [activeTab, setActiveTab] = useState<"telemetry" | "users" | "apikeys" | "wallpapers">("telemetry");`
- Add state for wallpaper items, loading state, and creation modal form:
  `const [wallpapers, setWallpapers] = useState<WallpaperBundle[]>([]);`
  `const [showAddModal, setShowAddModal] = useState(false);`

**Step 2: Add Manual Creation Form**
Create an administrative modal/drawer with fields:
- Title (e.g. "Neon Horizon 8K")
- Slug/ID (auto-slugified from title)
- Category select (Desktop 8K, Mobile OLED, Dual Monitor, 3D Sci-Fi, Minimalist Dark)
- Resolution (e.g. "7680x4320 (8K UHD)")
- Item Count & Format (e.g. 15, "PNG")
- Preview Thumbnail URL (direct image link)
- Gumroad Product Base URL (`https://mhr3d.gumroad.com/l/...`)
- Direct Download Zip URL
- Features & Tags (comma-separated inputs)
- Active / Live toggle

**Step 3: Add Catalog Table & Management Controls**
- Table with thumbnail preview, title, category, resolution, active status badge.
- Toggle switch for instant publish/unpublish.
- Direct "Test Unlock" action to inspect user-facing modal.
- Delete button with confirmation.

**Step 4: Verification**
Verify tab rendering and state binding by inspecting component exports and TypeScript typing.

---

### Task 5: Enhance Admin Login Flow & Navigation Discovery

**Objective:** Provide clear navigation links to the wallpaper store and make Admin Login accessible from the UI.

**Files:**
- Modify: `/home/mahir-linux/Development/shareflow/src/App.tsx`
- Modify: `/home/mahir-linux/Development/shareflow/src/components/Layout.tsx`
- Modify: `/home/mahir-linux/Development/shareflow/src/pages/DeveloperLogin.tsx`

**Step 1: Update Navigation & Routes**
- In `src/App.tsx`:
  - Route `/wallpapers` -> `<Products />`
  - Route `/products` -> `<Products />` (retained for backward compatibility)
- In `src/components/Layout.tsx`:
  - Change navbar link from "Developer Kits" to "Wallpapers" (with `Sparkles` or `Palette` icon).
  - Update footer link to "Wallpaper Bundles".
  - Add explicit "Admin Sign In" link in the footer leading to `/dev/login`.

**Step 2: Polish `DeveloperLogin.tsx` for Admin Access**
- Add prominent "Admin / Creator Login" toggle/hint explaining Telegram 2FA access for `mahirfaisalarian@gmail.com`.
- Maintain automatic redirect to `/admin` upon successful 6-digit Telegram 2FA code verification.

**Step 3: Verification**
Run client type check:
```bash
npm --prefix /home/mahir-linux/Development/shareflow run lint
```
Expected: `tsc --noEmit` exits with 0.

---

### Task 6: Programmatic Ingestion Tooling for Sanctuary/Sera

**Objective:** Enable the AI assistant (Sanctuary / Sera) to autonomously add and catalog new wallpaper packs from Mahir's local storage or generation pipelines.

**Files:**
- Create: `/home/mahir-linux/Development/shareflow/scripts/manage_wallpapers.py`

**Step 1: Write CLI Ingestion Helper**
Write Python helper `manage_wallpapers.py` supporting:
- `python3 scripts/manage_wallpapers.py list`: List all cataloged wallpapers.
- `python3 scripts/manage_wallpapers.py add --title "..." --category "..." --preview "..." --gumroad "..."`: Programmatically append new bundle to `data/wallpapers.json`.
- `python3 scripts/manage_wallpapers.py toggle --id "..."`: Toggle active status.

**Step 2: Verification**
Execute test CLI invocation:
```bash
python3 /home/mahir-linux/Development/shareflow/scripts/manage_wallpapers.py list
```
Expected: JSON list of bundles printed to stdout.

---

### Task 7: End-to-End Build & Deployment Verification

**Objective:** Build production bundle and verify all pages, routes, and admin tools compile cleanly without regressions.

**Files:**
- Test execution across whole repo.

**Step 1: Run Vite Production Build**
```bash
npm --prefix /home/mahir-linux/Development/shareflow run build
```
Expected: `dist/` generated with zero errors.

**Step 2: Verify Assets and Route Structure**
Ensure `dist/index.html` and bundled assets contain the new wallpaper bundle routes and endpoints.
