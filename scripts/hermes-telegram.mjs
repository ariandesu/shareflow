#!/usr/bin/env node
/**
 * Hermes Telegram Bridge — Xubuntu 26 (auto-push without confirmation)
 * Polling via Telegraf. Forwards Telegram messages to Hermes agent and system.
 * Q3: AUTO_PUSH=true — git push origin main without Telegram confirmation.
 *
 * Env required (on Xubuntu device):
 *  TELEGRAM_BOT_TOKEN - from @BotFather
 *  TELEGRAM_ALLOWED_USERS - comma-separated Telegram user IDs (e.g., "123456,789012")
 *  CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID - for wrangler (or wrangler login OAuth)
 *  GIT_SSH_COMMAND uses ~/.ssh/hermes_shareflow
 *
 * Run: node scripts/hermes-telegram.mjs
 * Daemon: pm2 start scripts/hermes-telegram.mjs --name hermes-telegram
 *         pm2 startup systemd && pm2 save
 */

import { Telegraf } from "telegraf";
import { execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const AUTO_PUSH = process.env.HERMES_AUTO_PUSH !== "false"; // default true per user Q3
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED = (process.env.TELEGRAM_ALLOWED_USERS || "").split(",").map(s => s.trim()).filter(Boolean);

if (!BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN missing in env. Set it in .env or export.");
  console.error("   Get token from @BotFather → /newbot");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

function isAllowed(ctx) {
  if (ALLOWED.length === 0) return true; // allow all if not configured (warn)
  const uid = String(ctx.from?.id || "");
  return ALLOWED.includes(uid);
}

function run(cmd, opts = {}) {
  try {
    const out = execSync(cmd, { encoding: "utf8", timeout: 120000, maxBuffer: 10 * 1024 * 1024, ...opts });
    return { ok: true, out };
  } catch (e) {
    return { ok: false, out: (e.stdout || "") + "\n" + (e.stderr || "") + "\n" + e.message };
  }
}

function replyLong(ctx, text) {
  const MAX = 4000;
  if (text.length <= MAX) return ctx.reply(text);
  // split
  const chunks = [];
  for (let i = 0; i < text.length; i += MAX) chunks.push(text.slice(i, i + MAX));
  return (async () => {
    for (const c of chunks) await ctx.reply("```\n" + c + "\n```", { parse_mode: "Markdown" });
  })();
}

bot.start((ctx) => {
  if (!isAllowed(ctx)) return ctx.reply("⛔ Unauthorized. Your ID: " + ctx.from.id);
  return ctx.reply(
    "⚡ Hermes online (Xubuntu 26, auto-push: " + (AUTO_PUSH ? "ON" : "OFF") + ")\n\n" +
    "Commands:\n" +
    "/new <ToolName> [--category=Developer] — scaffold + build + push\n" +
    "/deploy — wrangler pages deployments\n" +
    "/status — git status + build\n" +
    "/build — npm run build\n" +
    "/log — marketing/log.json\n" +
    "/wizard — marketing wizard\n" +
    "/help — this\n\n" +
    "Any free text → forwarded to Hermes agent."
  );
});

bot.command("help", (ctx) => {
  if (!isAllowed(ctx)) return;
  ctx.reply("/new /deploy /status /build /log /wizard — or just chat with Hermes.");
});

bot.command("status", (ctx) => {
  if (!isAllowed(ctx)) return ctx.reply("⛔ Unauthorized");
  ctx.reply("⏳ Checking status...");
  const git = run("git status --short; echo '---'; git log --oneline -3");
  const build = run("npm run lint 2>&1 | head -n 20");
  replyLong(ctx, `📊 Status\n\`\`\`\n${git.out.slice(0, 3000)}\n---lint---\n${build.out.slice(0, 1500)}\n\`\`\``);
});

bot.command("deploy", (ctx) => {
  if (!isAllowed(ctx)) return ctx.reply("⛔ Unauthorized");
  ctx.reply("⏳ Fetching Cloudflare Pages deployments...");
  const r = run("npx wrangler pages deployment list --project-name=shareflow 2>&1 | head -n 40");
  replyLong(ctx, "☁️ Deployments\n```\n" + r.out.slice(0, 3500) + "\n```");
});

bot.command("log", (ctx) => {
  if (!isAllowed(ctx)) return ctx.reply("⛔ Unauthorized");
  const p = "marketing/log.json";
  if (!fs.existsSync(p)) return ctx.reply("No log yet.");
  const data = fs.readFileSync(p, "utf8").slice(0, 3500);
  ctx.reply("📜 marketing/log.json\n```\n" + data + "\n```");
});

bot.command("wizard", (ctx) => {
  if (!isAllowed(ctx)) return ctx.reply("⛔ Unauthorized");
  const r = run("node marketing/wizard.mjs 2>&1");
  replyLong(ctx, "🧙 Wizard\n```\n" + r.out.slice(0, 3500) + "\n```");
});

bot.command("build", (ctx) => {
  if (!isAllowed(ctx)) return ctx.reply("⛔ Unauthorized");
  ctx.reply("🔨 Building...");
  const r = run("npm run build 2>&1 | tail -n 40");
  replyLong(ctx, (r.ok ? "✅ Build ok\n" : "❌ Build failed\n") + "```\n" + r.out.slice(0, 3500) + "\n```");
});

bot.command("new", async (ctx) => {
  if (!isAllowed(ctx)) return ctx.reply("⛔ Unauthorized");
  const args = ctx.message.text.split(" ").slice(1).join(" ").trim();
  if (!args) return ctx.reply("Usage: /new <ToolName> [--category=Developer] [--description=\"...\"]");
  const toolName = args.split(" ")[0];
  await ctx.reply(`⚙️ Scaffolding ${toolName} (auto-push=${AUTO_PUSH ? "ON" : "OFF"})...`);
  const scaffold = run(`node scripts/scaffold-tool.mjs ${args} 2>&1`);
  if (!scaffold.ok) {
    return replyLong(ctx, "❌ Scaffold failed\n```\n" + scaffold.out.slice(0, 3500) + "\n```");
  }
  await ctx.reply("🔨 Building...");
  const build = run("npm run build 2>&1 | tail -n 30");
  if (!build.ok && build.out.includes("error")) {
    return replyLong(ctx, "❌ Build failed, not pushing\n```\n" + build.out.slice(0, 3500) + "\n```");
  }
  // Auto-push without confirmation
  await ctx.reply(AUTO_PUSH ? "🚀 Auto-pushing to main (no confirmation per config)..." : "🚀 Pushing...");
  const gitAdd = run("git add -A 2>&1");
  const gitCommit = run(`git commit -m "feat(hermes): add ${toolName} via Telegram" 2>&1`);
  const pushCmd = process.env.GIT_SSH_COMMAND
    ? `GIT_SSH_COMMAND="${process.env.GIT_SSH_COMMAND}" git push origin main 2>&1`
    : `GIT_SSH_COMMAND="ssh -i ~/.ssh/hermes_shareflow -o StrictHostKeyChecking=accept-new" git push origin main 2>&1`;
  const push = run(pushCmd);
  if (!push.ok) {
    return replyLong(ctx, "❌ Push failed — check SSH deploy key\n```\n" + push.out.slice(0, 3000) + "\nCommit:\n" + gitCommit.out.slice(0, 1000) + "\n```");
  }
  await ctx.reply("☁️ Pushed to GitHub. Polling Cloudflare Pages...");
  // wait 5s then check deployment
  await new Promise(r => setTimeout(r, 5000));
  const deploy = run("npx wrangler pages deployment list --project-name=shareflow 2>&1 | head -n 20");
  const url = `https://shareflow.mhr3d.online/${toolName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;
  // marketing post (Hermes self-manages X/Reddit/PH keys)
  const post = run(`node marketing/post.mjs --tool=${toolName} --url=${url} 2>&1 | head -n 30`);
  replyLong(ctx,
    `✅ ${toolName} live!\n` +
    `🔗 ${url}\n` +
    `📦 Git: ${gitCommit.out.slice(0, 500)}\n` +
    `☁️ Deploy:\n\`\`\`\n${deploy.out.slice(0, 1200)}\n\`\`\`\n` +
    `📣 Marketing:\n\`\`\`\n${post.out.slice(0, 1200)}\n\`\`\`\n` +
    `Scaffold:\n\`\`\`\n${scaffold.out.slice(0, 800)}\n\`\`\``
  );
});

// Free text → Hermes agent (opencode)
bot.on("text", async (ctx) => {
  if (!isAllowed(ctx)) return;
  const text = ctx.message.text;
  if (text.startsWith("/")) return; // already handled
  await ctx.reply("🤖 Hermes thinking...");
  // Forward to opencode Hermes agent via npx opencode run (if available) or just echo
  // For now, run a simple tee: use opencode if installed, else fallback
  let out = "";
  try {
    const hasOpencode = fs.existsSync("node_modules/.bin/opencode") || run("npx opencode --version 2>&1").ok;
    if (hasOpencode && text.length > 5) {
      // Try to run hermes agent non-interactively
      const r = run(`echo ${JSON.stringify(text)} | npx opencode run --agent hermes 2>&1 | head -n 100`, { timeout: 30000 });
      out = r.out.slice(0, 3000);
    } else {
      out = `You said: ${text}\n(Hermes agent would handle this. Opencode bridge not yet configured for free text — use /new for tools)`;
    }
  } catch (e) {
    out = String(e).slice(0, 2000);
  }
  replyLong(ctx, "🧠 Hermes:\n```\n" + out + "\n```");
});

bot.launch().then(() => {
  console.log("🤖 Hermes Telegram bridge running (Xubuntu 26, auto-push=" + (AUTO_PUSH ? "ON" : "OFF") + ")");
  console.log("   Allowed users:", ALLOWED.length ? ALLOWED.join(",") : "ALL (set TELEGRAM_ALLOWED_USERS!)");
  if (ALLOWED.length === 0) console.warn("⚠️  TELEGRAM_ALLOWED_USERS empty — anyone with bot link can control Hermes! Set it in .env");
}).catch(e => {
  console.error("Failed to launch bot:", e);
  process.exit(1);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
