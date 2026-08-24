# HANDOVER — ShareFlow Full Control to Hermes Agent

**Date:** 2026-08-24
**Owner Telegram ID:** `8941576242`
**Bot:** `@hermesmhr3dbot` (token redacted — see `TELEGRAM_BOT_TOKEN` in `.env` on Xubuntu, not committed)
**Repo:** `git@github.com-hermes:ariandesu/shareflow.git` (branch `main`, auto-push ON, Q2 direct)
**Live Site:** https://shareflow.mhr3d.online + https://shareflow-5sx.pages.dev (Cloudflare Pages project `shareflow`, `f3a3a25638f1935dfec28f9780f18224`)
**Hermes Device:** Linux Xubuntu 26 (systemd + pm2)
**Handover Source:** Assistant on Mac `hiddenmahirfaisalarian@gmail.com`'s account

## 1. You Have Full Control

Hermes, you are granted **read / write / edit** on all files, **git push** via SSH, **wrangler deploy** (Pages + Workers), and **marketing / visitor growth**. You operate autonomously.

- **FS:** `src/**`, `server.ts`, `shareflow-api/**`, `package.json`, `vite.config.ts`, `index.html`, `assets/**`, `marketing/**`, `scripts/**`, `.opencode/**`
- **Git:** Deploy key `~/.ssh/hermes_shareflow` `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAzSE7vrZF7ItluSQ2E59uDP1zu+SehwkEZxs3kqPZIO hermes@shareflow.mhr3d.online` → Host `github.com-hermes` in `~/.ssh/config`. Remote `git@github.com-hermes:ariandesu/shareflow.git`. Commit `feat(hermes): <Tool>` + auto `git push origin main` (Q3 no Telegram confirmation). `GIT_SSH_COMMAND="ssh -i ~/.ssh/hermes_shareflow -o StrictHostKeyChecking=accept-new"` already configured. This Mac reverted remote to `https://` until you add key — you must add deploy key on Xubuntu to GitHub → Settings → Deploy keys → Allow write.
- **Cloudflare:** Account `f3a3a25638f1935dfec28f9780f18224` OAuth `workers write` verified via `npx wrangler whoami` on Mac. On Xubuntu run `npx wrangler login` or set `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in `~/shareflow/.env`. Verify `npx wrangler pages deployment list --project-name=shareflow` → Active `b87ac2b`+.

## 2. Telegram Control Plane (Xubuntu)

- You run `scripts/hermes-telegram.mjs` via Telegraf polling (no webhook). Env on Xubuntu `~/shareflow/.env`:
  ```
  TELEGRAM_BOT_TOKEN=***REDACTED*** # set in .env on Xubuntu, never commit
  TELEGRAM_ALLOWED_USERS=8941576242
  HERMES_AUTO_PUSH=true
  VITE_API_URL=https://shareflow-api.shareflow.workers.dev
  CLOUDFLARE_ACCOUNT_ID=f3a3a25638f1935dfec28f9780f18224
  ```
  Only user `8941576242` can command you (whitelist in `.env.example` + `marketing/.env.example`). Daemon: `pm2 start scripts/hermes-telegram.mjs --name hermes-telegram && pm2 startup systemd && pm2 save && pm2 logs hermes-telegram`.

- **Commands you expose:** `/new <Tool> --category=Developer --description="..."` → `node scripts/scaffold-tool.mjs` + `npm run build` + auto push; `/deploy`, `/status`, `/build`, `/log`, `/wizard`, free text → `opencode --agent hermes`. You also handle `marketing/wizard.mjs` + `marketing/post.mjs`.

## 3. Tool Creation Contract (MUST FOLLOW)

1. Create `src/pages/<Tool>.tsx` (export default, `SEOContent`, `lucide-react`, Tailwind `bg-white/5`)
2. Register: `src/App.tsx` (import + `<Route path="kebab">`), `src/pages/Home.tsx` (tile in `tools` array, category Developer/Image/PDF/Utilities), `src/components/Layout.tsx` (More Tools overflow)
3. Run `npm run build` — must pass before push (pre-push hook)
4. `git add -A && git commit && GIT_SSH_COMMAND="ssh -i ~/.ssh/hermes_shareflow ..." git push origin main`
5. Verify: `npx wrangler pages deployment list` + `curl -s https://shareflow.mhr3d.online/kebab`
6. Market: `node marketing/post.mjs --tool=<Tool> --url=https://shareflow.mhr3d.online/kebab` — you self-manage X/Reddit/PH keys via `marketing/wizard.mjs` (see `marketing/.env.example`), post directly (Q3), log to `marketing/log.json`.

## 4. Marketing & Growth

- You self-manage `X_API_KEY`, `REDDIT_CLIENT_ID`, `PRODUCT_HUNT_TOKEN` via `marketing/wizard.mjs` → `marketing/.env.example`. If missing, wizard prompts owner; post is skipped and logged as `[PENDING_KEYS]`.
- After each deploy generate `assets/og-<tool>.png`, tweet `+ #BuildInPublic`, Reddit markdown, Product Hunt payload. Track in `marketing/log.json`. Backlog in `marketing/backlog.json` (4 starters: JsonToCsvPro, ColorPaletteExtractor, CronGenerator, SvgMinify).
- SEO: update `SEOContent` per tool, keep AdSense `index.html:9` `ca-pub-9726491440966238`.

## 5. Opencode Identity

- Config `opencode.jsonc` allows bash/edit/write, agent `hermes` → `.opencode/agents/hermes.md`. Skills `tool-factory`, `marketing` enabled. This file is your handover proof — you read it on boot.

## 6. Handover Acceptance

- When you receive this HANDOVER.md via Telegram, reply on Telegram with: `✅ HANDOVER ACCEPTED — Hermes full control active (Xubuntu 26, auto-push ON, user 8941576242)`. Then commit `HANDOVER.md` if not present and run `/status` as proof.

## 7. History & Live State

- This Mac built Pages deployments: `b87ac2b` (Active `77b75190`), `a7ea4b4` (whitelist `8941576242`), `896e8d4` (telegram bridge), `184f549` (hermes core), `34aa61f` (Code Helper purge). Site `https://shareflow.mhr3d.online` 200, contains no `code-helper` (verified `grep -ci 0`).

---

**Owner signature via Telegram 8941576242 → Hermes:** You have full control. Proceed.
