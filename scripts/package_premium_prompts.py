#!/usr/bin/env python3
"""Bundle paid prompt collections into Gumroad-ready products with original covers."""
from __future__ import annotations
import json
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
PROMPT_DIR = DATA / "premium-prompts"
OUT = ROOT / "dist" / "gumroad-products"
PRODUCTS = {
    "micro-saas-launch-kit": ("01-micro-saas-launch-kit.md", "Micro-SaaS Launch Kit", 49, 0.99, "MICRO-SAAS LAUNCH KIT — 12 UI PROMPTS FOR v0 • LOVABLE • BOLT"),
    "design-system-architect": ("02-design-system-architect.md", "Design System Architect", 69, 1.49, "DESIGN SYSTEM ARCHITECT — UI TOKENS • COMPONENTS • ACCESSIBILITY"),
    "webgl-motion-studio": ("03-webgl-motion-studio.md", "WebGL Motion Studio", 79, 1.99, "WEBGL MOTION STUDIO — 12 PROMPTS FOR REACT THREE FIBER"),
    "b2b-commerce-blueprint": ("04-b2b-commerce-blueprint.md", "B2B Commerce Blueprint", 59, 1.29, "B2B COMMERCE BLUEPRINT — WHOLESALE • SUPPLIER • BULK ORDER"),
    "ai-workflow-canvas": ("05-ai-workflow-canvas.md", "AI Workflow Canvas", 89, 1.99, "AI WORKFLOW CANVAS — VISUAL AGENTS • AUTOMATION • DEBUGGING"),
}

def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, (source_name, title, bdt, usd, _) in PRODUCTS.items():
        source = PROMPT_DIR / source_name
        if not source.is_file():
            raise SystemExit(f"Missing prompt content: {source}")
        product_dir = OUT / slug
        product_dir.mkdir(exist_ok=True)
        shutil.copyfile(source, product_dir / "PROMPTS.md")
        readme = (
            f"# {title}\n\n"
            f"Thank you for purchasing {title}. The complete prompt collection is in `PROMPTS.md`.\n\n"
            "## Use\nReplace bracketed inputs with your own project details. Use prompts with your own AI design/code assistant. This download contains prompt text, not software, images, 3D models, fonts, or paid AI access. Generated code and accessibility claims require your own review and testing.\n\n"
            f"Suggested listing price: BDT {bdt} / USD {usd:.2f}; set and confirm your actual Gumroad price separately.\n"
        )
        (product_dir / "README.md").write_text(readme, encoding="utf-8")
        cover = DATA / "premium-covers" / f"{slug}.png"
        if cover.is_file():
            shutil.copyfile(cover, product_dir / "cover.png")
        else:
            print(f"WARNING: original cover image missing: {cover}")
        archive = OUT / f"{slug}.zip"
        with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as zf:
            for item in sorted(product_dir.iterdir()):
                if item.is_file():
                    zf.write(item, arcname=item.name)
        print(f"{title}: {archive} ({archive.stat().st_size} bytes)")

    manifest = []
    catalog = json.loads((DATA / "prompts.json").read_text(encoding="utf-8"))
    for slug, (_, title, bdt, usd, _) in PRODUCTS.items():
        item = next((p for p in catalog if p.get("id") == slug), {})
        manifest.append({
            "id": slug,
            "title": title,
            "price_bdt": bdt,
            "price_usd": usd,
            "gumroad_url": item.get("gumroadUrl"),
            "supportkori_url": item.get("supportKoriUrl"),
            "cover": f"{slug}/cover.png" if (OUT / slug / "cover.png").is_file() else None,
            "download": f"{slug}.zip",
            "source_prompt": f"data/premium-prompts/{PRODUCTS[slug][0]}",
        })
    (OUT / "product-manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Manifest: {OUT / 'product-manifest.json'}")

if __name__ == "__main__":
    main()
