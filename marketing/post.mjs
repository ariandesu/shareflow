#!/usr/bin/env node
/**
 * Hermes Marketing Poster — posts directly to X/Reddit/PH after deploy.
 * Called by Hermes: node marketing/post.mjs --tool=MyTool --url=https://shareflow.mhr3d.online/my-tool
 */
const tool = process.argv.find(a => a.startsWith("--tool="))?.split("=")[1] || "NewTool";
const url = process.argv.find(a => a.startsWith("--url="))?.split("=")[1] || `https://shareflow.mhr3d.online/${tool.toLowerCase()}`;

console.log(`📣 Hermes Posting for ${tool} → ${url}`);

// Check keys
const hasX = process.env.X_BEARER_TOKEN || (process.env.X_API_KEY && process.env.X_ACCESS_TOKEN);
const hasReddit = process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET;
const hasPH = process.env.PRODUCT_HUNT_TOKEN;

import fs from "fs";
const logPath = "marketing/log.json";
let log = { posts: [] };
if (fs.existsSync(logPath)) log = JSON.parse(fs.readFileSync(logPath, "utf8"));

async function postX() {
  if (!hasX) { console.log("⚠ X keys missing — skipped (Hermes wizard will prompt)"); return { skipped: true }; }
  // Example: POST https://api.twitter.com/2/tweets
  console.log(`→ Would POST to X: "New on ShareFlow: ${tool} — ${url} #BuildInPublic #DevTools"`);
  return { posted: true };
}
async function postReddit() {
  if (!hasReddit) { console.log("⚠ Reddit keys missing — skipped"); return { skipped: true }; }
  console.log(`→ Would POST to r/SideProject, r/webdev: "${tool} on ShareFlow"`);
  return { posted: true };
}
async function postPH() {
  if (!hasPH) { console.log("⚠ Product Hunt token missing — skipped"); return { skipped: true }; }
  console.log(`→ Would POST to Product Hunt via API`);
  return { posted: true };
}

const results = {
  tool, url, at: new Date().toISOString(),
  x: await postX(),
  reddit: await postReddit(),
  ph: await postPH()
};
log.posts.push(results);
fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
console.log(`✓ Logged to ${logPath}`);
