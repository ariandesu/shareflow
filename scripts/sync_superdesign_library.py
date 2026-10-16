#!/usr/bin/env python3
"""
Sync 100+ production design prompts and interactive previews from Superdesign library.
Classifies into: Landing Page, Style, Animation, UI Component, Mobile App, Dashboard.
Downloads previews, saves prompts.json, builds markdown guides, and zips the package.
"""

import os
import json
import time
import zipfile
import urllib.request
import urllib.parse
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import Counter

BASE_API = "https://api.superdesign.dev/v1/prompt-library"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
}

ROOT_DIR = "/home/mahir-linux/Development/shareflow"
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
PRODUCTS_DIR = os.path.join(PUBLIC_DIR, "products")
PREVIEWS_DIR = os.path.join(PUBLIC_DIR, "previews")
BUNDLE_DIR = os.path.join(PRODUCTS_DIR, "bundle")
MD_DIR = os.path.join(BUNDLE_DIR, "prompts_markdown")
BUNDLE_PREVIEWS_DIR = os.path.join(BUNDLE_DIR, "previews")
ZIP_OUTPUT = os.path.join(PRODUCTS_DIR, "shareflow-superdesign-prompts-and-previews.zip")

os.makedirs(PRODUCTS_DIR, exist_ok=True)
os.makedirs(PREVIEWS_DIR, exist_ok=True)
os.makedirs(BUNDLE_DIR, exist_ok=True)
os.makedirs(MD_DIR, exist_ok=True)
os.makedirs(BUNDLE_PREVIEWS_DIR, exist_ok=True)


def fetch_api(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"API fetch error for {url}: {e}")
        return {}


def classify_category(item):
    tags = [t.lower() for t in (item.get("tags") or [])]
    title_lower = (item.get("title") or "").lower()
    desc_lower = (item.get("description") or "").lower()

    if any(t in ['mobile app', 'mobile', 'ios', 'android'] for t in tags) or 'mobile app' in title_lower or 'mobile app' in desc_lower:
        return 'Mobile App'
    if any(t in ['dashboard', 'analytics', 'admin', 'metrics', 'crm', 'saas dashboard'] for t in tags) or 'dashboard' in title_lower:
        return 'Dashboard'
    if any(t in ['ui component', 'component', 'navbar', 'sticky-nav', 'pricing page', 'pricing card', 'dock', 'bento grid', 'pricing table'] for t in tags) or 'component' in title_lower:
        return 'UI Component'
    if any(t in ['animation', 'motion', 'animated', 'aurora', 'canvas', 'particle', 'shader', 'reveal', 'hero animation', 'interactive hover'] for t in tags) or 'animat' in title_lower or 'motion' in title_lower:
        return 'Animation'
    if any(t in ['style', 'brutalist', 'minimal', 'glassmorphism', 'bauhaus', 'retro', 'cyberpunk', 'editorial', 'claymorphism', 'monochrome', 'neumorphism'] for t in tags) or 'style' in title_lower:
        return 'Style'
    
    return 'Landing Page'


def collect_prompts():
    print("Collecting prompts from library...")
    queries = [
        ("landing-page", 60),
        ("style", 50),
        ("animation", 50),
        ("ui component", 40),
        ("mobile app", 30),
        ("dashboard", 30),
        ("saas", 40),
        ("portfolio", 30),
        ("", 60)
    ]

    seen_ids = set()
    collected = []

    for tag, limit in queries:
        url = f"{BASE_API}?isPublic=true&limit={limit}"
        if tag:
            url += f"&tags={urllib.parse.quote(tag)}"
        print(f"Querying tag: '{tag}' (limit={limit})...")
        data = fetch_api(url)
        items = data.get("items", [])
        for it in items:
            slug = it.get("slug")
            if not slug or slug in seen_ids:
                continue
            preview_url = it.get("previewUrl")
            title = it.get("title")
            if not preview_url or not title:
                continue
            
            seen_ids.add(slug)
            category = classify_category(it)
            
            item_entry = {
                "id": it.get("id"),
                "slug": slug,
                "title": title.strip(),
                "description": (it.get("description") or "").strip(),
                "category": category,
                "tags": it.get("tags") or [],
                "previewUrl": preview_url,
                "localPreviewUrl": f"/previews/{slug}.html",
                "previewDevice": it.get("previewDevice") or "desktop",
                "thumbnail": it.get("thumbnail") or (it.get("images")[0] if it.get("images") else ""),
                "images": it.get("images") or [],
                "prompt": it.get("prompt"),
                "price": 49,
                "currency": "BDT",
                "supportKoriUrl": "https://www.supportkori.com/mhr3d"
            }
            collected.append(item_entry)
        time.sleep(0.2)

    print(f"Collected {len(collected)} unique items.")
    print("Distribution:", Counter(x["category"] for x in collected))
    return collected


def download_single_preview(item):
    slug = item["slug"]
    preview_url = item["previewUrl"]
    target_path = os.path.join(PREVIEWS_DIR, f"{slug}.html")
    bundle_path = os.path.join(BUNDLE_PREVIEWS_DIR, f"{slug}.html")

    # If already downloaded and has good content, keep it
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
        if not os.path.exists(bundle_path):
            with open(target_path, "rb") as src, open(bundle_path, "wb") as dst:
                dst.write(src.read())
        return slug, True, os.path.getsize(target_path)

    req = urllib.request.Request(preview_url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            with open(target_path, "wb") as f:
                f.write(content)
            with open(bundle_path, "wb") as f:
                f.write(content)
            return slug, True, len(content)
    except Exception as e:
        # Fallback template if download fails
        fallback_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{item['title']}</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<style>body {{ font-family: 'Plus Jakarta Sans', sans-serif; }}</style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col items-center justify-center p-6">
  <div class="max-w-xl w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 text-center backdrop-blur-md shadow-2xl">
    <span class="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold rounded-full mb-4">
      {item['category']}
    </span>
    <h1 class="text-2xl font-bold mb-3">{item['title']}</h1>
    <p class="text-zinc-400 text-sm mb-6 leading-relaxed">{item['description']}</p>
    <a href="{preview_url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-500/20">
      Open Live Superdesign Preview ↗
    </a>
  </div>
</body>
</html>"""
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(fallback_html)
        with open(bundle_path, "w", encoding="utf-8") as f:
            f.write(fallback_html)
        return slug, False, len(fallback_html)


def main():
    prompts = collect_prompts()
    
    # Save prompts.json
    json_path = os.path.join(PRODUCTS_DIR, "prompts.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(prompts, f, indent=2, ensure_ascii=False)
    
    # Save inside bundle too
    bundle_json_path = os.path.join(BUNDLE_DIR, "prompts.json")
    with open(bundle_json_path, "w", encoding="utf-8") as f:
        json.dump(prompts, f, indent=2, ensure_ascii=False)

    print(f"\nSaved prompts.json with {len(prompts)} items.")

    # Concurrently download previews
    print(f"\nDownloading interactive HTML previews for {len(prompts)} items (concurrency=8)...")
    success_count = 0
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(download_single_preview, item): item for item in prompts}
        for i, fut in enumerate(as_completed(futures), 1):
            slug, ok, size = fut.result()
            if ok:
                success_count += 1
            if i % 20 == 0 or i == len(prompts):
                print(f"[{i}/{len(prompts)}] Downloaded {slug} ({size/1024:.1f} KB) - success={ok}")

    print(f"Downloaded {success_count}/{len(prompts)} previews successfully.")

    # Generate Markdown documentation for each prompt
    print("\nGenerating markdown guides for each prompt...")
    for idx, item in enumerate(prompts, 1):
        slug = item["slug"]
        md_file = os.path.join(MD_DIR, f"{idx:03d}_{slug}.md")
        tags_str = ", ".join(item.get("tags") or [])
        prompt_content = item.get("prompt") or ""
        
        # If prompt is a JSON string, pretty print it, else keep as is
        try:
            parsed = json.loads(prompt_content)
            formatted_prompt = json.dumps(parsed, indent=2)
        except Exception:
            formatted_prompt = prompt_content

        md_text = f"""# {item['title']}

**Category:** {item['category']}  
**Tags:** {tags_str}  
**Price:** ৳49 BDT (SupportKori: {item['supportKoriUrl']})  
**Live Preview:** [{item['previewUrl']}]({item['previewUrl']})  
**Local Standalone Preview:** `previews/{slug}.html`

---

## Architectural & Aesthetic Breakdown
{item['description']}

---

## Production System Prompt Specification
Copy and paste this into Cursor Composer, Claude 3.5 Sonnet, v0, Bolt.new, or Windsurf:

```markdown
{formatted_prompt}
```

---
*Generated by ShareFlow Design Prompt Library · © {time.strftime('%Y')} Mahir Faisal (MHR3D)*
"""
        with open(md_file, "w", encoding="utf-8") as f:
            f.write(md_text)

    # Write Bundle README
    readme_text = f"""# ShareFlow SuperDesign Pro Prompt Library (100+ Production Prompts & Interactive Previews)

Curated high-end interactive UI design prompts inspired by Superdesign, categorized and bundled for direct use in modern AI coding environments (Cursor, v0, Bolt, Claude, Windsurf).

## What's Included
- **`prompts.json`**: Complete database of {len(prompts)} design prompts with metadata, categories, live previews, and system prompts.
- **`prompts_markdown/`**: Individual markdown files for every single design prompt with full system prompt specification and design notes.
- **`previews/`**: Standalone, self-contained interactive HTML previews that you can open locally in any browser with zero setup.

## Categories
{chr(10).join(f"- **{cat}**: {count} prompts" for cat, count in sorted(Counter(x['category'] for x in prompts).items()))}

## How to Use
1. Browse the `previews/` folder to preview any design in your browser.
2. Open the matching file in `prompts_markdown/` to read the design philosophy.
3. Copy the system prompt specification into your AI tool (Cursor, Claude, Bolt, v0).

---
**Author:** Mahir Faisal (MHR3D)  
**Profile:** https://www.supportkori.com/mhr3d  
**Platform:** https://shareflow.mhr3d.online/products
"""
    with open(os.path.join(BUNDLE_DIR, "README.md"), "w", encoding="utf-8") as f:
        f.write(readme_text)

    # Build ZIP archive
    print(f"\nBuilding master zip archive at {ZIP_OUTPUT}...")
    with zipfile.ZipFile(ZIP_OUTPUT, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(BUNDLE_DIR):
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, BUNDLE_DIR)
                zipf.write(abs_path, os.path.join("shareflow-superdesign-prompts", rel_path))

    zip_size_mb = os.path.getsize(ZIP_OUTPUT) / (1024 * 1024)
    print(f"SUCCESS! Zip created: {ZIP_OUTPUT} ({zip_size_mb:.2f} MB)")


if __name__ == "__main__":
    main()
