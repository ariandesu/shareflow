# Hermes Marketing

Hermes self-manages X / Reddit / Product Hunt keys and auto-posts after each tool deploy.

## Setup (Hermes Wizard)

Run `node marketing/wizard.mjs` — checks env, creates `log.json` + `backlog.json`.

## Keys (Self-Managed by Hermes)

See `marketing/.env.example`. Fill `.env` or set env vars:

- X: developer.twitter.com
- Reddit: reddit.com/prefs/apps (script)
- Product Hunt: api.producthunt.com/v2/oauth/applications

Leave empty for dry-run — Hermes will log `[PENDING_KEYS]` and retry next deploy.

## Posting

After `npm run build && git push && wrangler deploy` succeeds:

```bash
node marketing/post.mjs --tool=MyTool --url=https://shareflow.mhr3d.online/my-tool
```

Posts directly (Q3) if keys present, otherwise logs skipped and prompts wizard.

Transpired deployments in `marketing/log.json`.
