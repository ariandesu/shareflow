/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PROMPTS_FILE = '/home/mahir-linux/Development/shareflow/data/prompts.json';
const PREVIEWS_DIR = '/home/mahir-linux/Development/shareflow/public/previews';
const SCREENSHOTS_DIR = '/home/mahir-linux/Development/shareflow/public/screenshots';
const BUNDLE_BASE_DIR = '/home/mahir-linux/Development/shareflow/public/products/prompts_bundle';

async function main() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  if (!fs.existsSync(BUNDLE_BASE_DIR)) fs.mkdirSync(BUNDLE_BASE_DIR, { recursive: true });

  const raw = fs.readFileSync(PROMPTS_FILE, 'utf8');
  const prompts = JSON.parse(raw);
  console.log(`Processing ${prompts.length} prompts...`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const CONCURRENCY = 4;
  const queue = [...prompts];
  let completed = 0;
  let failed = 0;

  async function worker(workerId) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1
    });
    const page = await context.newPage();

    while (queue.length > 0) {
      const p = queue.shift();
      if (!p) break;

      const slug = p.slug;
      const htmlFilename = `${slug}.html`;
      const htmlSourcePath = path.join(PREVIEWS_DIR, htmlFilename);
      const screenshotPath = path.join(SCREENSHOTS_DIR, `${slug}.png`);

      // 1. Folder for this prompt
      const promptFolder = path.join(BUNDLE_BASE_DIR, slug);
      if (!fs.existsSync(promptFolder)) fs.mkdirSync(promptFolder, { recursive: true });

      // 2. Generate prompt.md and prompt.txt
      const promptMdPath = path.join(promptFolder, 'prompt.md');
      const promptTxtPath = path.join(promptFolder, 'prompt.txt');
      const previewHtmlDest = path.join(promptFolder, 'preview.html');
      const screenshotDest = path.join(promptFolder, 'screenshot.png');

      const promptContentStr = typeof p.promptContent === 'string'
        ? p.promptContent
        : JSON.stringify(p.promptContent || p.prompt || {}, null, 2);

      const promptMd = `# ${p.title}

- **Category:** ${p.category || 'Landing Page'}
- **Slug:** \`${p.slug}\`
- **Target AI Tools:** Cursor, Claude 3.7 / 3.5 Sonnet, Bolt.new, v0.dev, Windsurf, Lovable
- **Price:** ৳49 BDT (SupportKori: https://www.supportkori.com/mhr3d)
- **Tags:** ${(p.tags || []).join(', ')}

---

## Architectural Philosophy & Overview
${p.description || 'Curated high-performance design architecture.'}

---

## Production System Prompt Specification
\`\`\`
${promptContentStr}
\`\`\`
`;

      fs.writeFileSync(promptMdPath, promptMd, 'utf8');
      fs.writeFileSync(promptTxtPath, promptContentStr, 'utf8');

      // 3. Copy preview HTML if exists
      if (fs.existsSync(htmlSourcePath)) {
        fs.copyFileSync(htmlSourcePath, previewHtmlDest);
      }

      // 4. Capture screenshot if not already done
      if (fs.existsSync(screenshotDest) && fs.statSync(screenshotDest).size > 0 && fs.existsSync(screenshotPath) && fs.statSync(screenshotPath).size > 0) {
        completed++;
        continue;
      }

      try {
        const previewUrl = `http://localhost:4173/previews/${encodeURIComponent(htmlFilename)}`;
        await page.goto(previewUrl, { waitUntil: 'load', timeout: 12000 });
        await page.waitForTimeout(400); // allow styles & fonts to settle
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Copy screenshot to prompt folder
        if (fs.existsSync(screenshotPath)) {
          fs.copyFileSync(screenshotPath, screenshotDest);
        }

        completed++;
        if (completed % 25 === 0 || completed === prompts.length) {
          console.log(`[Worker ${workerId}] Progress: ${completed}/${prompts.length} prompts processed.`);
        }
      } catch (err) {
        console.error(`[Worker ${workerId}] Error taking screenshot for ${slug}:`, err.message);
        failed++;
      }
    }

    await context.close();
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1));
  await Promise.all(workers);
  await browser.close();

  console.log(`Done! Completed: ${completed}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
