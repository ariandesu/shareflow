import json
import os

with open("public/products/prompts.json", "r", encoding="utf-8") as f:
    items = json.load(f)

formatted = []
for it in items:
    slug = it.get("slug")
    title = it.get("title")
    category = it.get("category")
    tags = it.get("tags") or []
    desc = it.get("description") or ""
    thumbnail = it.get("thumbnail") or ""
    preview_url = it.get("previewUrl") or ""
    local_preview = it.get("localPreviewUrl") or f"/previews/{slug}.html"
    prompt_text = it.get("prompt") or ""
    
    # Feature extraction from tags or description
    features = [t.capitalize() for t in tags[:6]]
    if not features:
        features = ["Responsive Layout", "Zero Dependencies", "Modern CSS/Tailwind", "Production Ready"]

    entry = {
        "id": it.get("id") or slug,
        "slug": slug,
        "title": title,
        "description": desc,
        "category": category,
        "tags": tags,
        "targetTool": "Universal",
        "isFree": False,
        "priceBdt": 49,
        "priceUsd": 0.49,
        "price": 49,
        "currency": "BDT",
        "promptContent": prompt_text,
        "prompt": prompt_text,
        "previewImage": thumbnail,
        "thumbnail": thumbnail,
        "previewUrl": preview_url,
        "localPreviewUrl": local_preview,
        "livePreviewUrl": local_preview,
        "previewDevice": it.get("previewDevice") or "desktop",
        "supportKoriUrl": "https://www.supportkori.com/mhr3d",
        "gumroadUrl": "",
        "features": features,
        "copyCount": 142,
        "active": True,
        "createdAt": "2026-10-15"
    }
    formatted.append(entry)

with open("data/prompts.json", "w", encoding="utf-8") as f:
    json.dump(formatted, f, indent=2, ensure_ascii=False)

with open("public/products/prompts.json", "w", encoding="utf-8") as f:
    json.dump(formatted, f, indent=2, ensure_ascii=False)

print(f"Successfully updated data/prompts.json and public/products/prompts.json with {len(formatted)} prompts!")
