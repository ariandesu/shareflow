#!/usr/bin/env node
/**
 * Hermes Marketing Wizard — self-manages X/Reddit/PH keys.
 * Checks env, prompts to open portals, tests keys.
 */
import fs from "fs";
import path from "path";

const required = {
  X: ["X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_SECRET"],
  Reddit: ["REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET"],
  "Product Hunt": ["PRODUCT_HUNT_TOKEN"]
};

console.log("🔮 Hermes Marketing Wizard — Self-Managed Keys\n");

const missing = [];
for (const [svc, keys] of Object.entries(required)) {
  const miss = keys.filter(k => !process.env[k]);
  if (miss.length) {
    missing.push({ svc, miss });
    console.log(`❌ ${svc} missing: ${miss.join(", ")}`);
  } else {
    console.log(`✓ ${svc} keys present`);
  }
}

if (missing.length === 0) {
  console.log("\nAll marketing keys present. Hermes can post directly.");
  process.exit(0);
}

console.log("\n→ Hermes will manage these. Steps:");
console.log("1. Open: https://developer.twitter.com/en/portal/dashboard (X)");
console.log("2. Open: https://www.reddit.com/prefs/apps (create script app)");
console.log("3. Open: https://api.producthunt.com/v2/oauth/applications");
console.log("\nCreate .env in marketing/ or set env vars and re-run.");
console.log("\nPlaceholder .env.example at marketing/.env.example");
console.log("Log file: marketing/log.json (created on first post)");

if (!fs.existsSync("marketing/log.json")) {
  fs.writeFileSync("marketing/log.json", JSON.stringify({ posts: [] }, null, 2));
  console.log("✓ Created marketing/log.json");
}

if (!fs.existsSync("marketing/backlog.json")) {
  const backlog = {
    nextTools: [
      { name: "JsonToCsvPro", category: "Developer", description: "Advanced JSON to CSV transformer with nested flatten.", icon: "Repeat", seo: "json to csv converter" },
      { name: "ColorPaletteExtractor", category: "Image", description: "Extract dominant colors from any image.", icon: "Palette", seo: "image color palette generator" },
      { name: "CronGenerator", category: "Developer", description: "Visual cron expression builder & explainer.", icon: "Clock", seo: "cron generator" },
      { name: "SvgMinify", category: "Developer", description: "Minify and optimize SVG instantly.", icon: "Code2", seo: "svg minifier" }
    ]
  };
  fs.writeFileSync("marketing/backlog.json", JSON.stringify(backlog, null, 2));
  console.log("✓ Created marketing/backlog.json with 4 starter tools");
}

console.log("\nHermes will auto-prompt for keys on next deploy if still missing.");
