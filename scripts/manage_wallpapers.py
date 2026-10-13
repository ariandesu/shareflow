#!/usr/bin/env python3
"""
ShareFlow Wallpaper Store Management CLI
Autonomous catalog manager for Sanctuary / Sera.
Usage:
  python3 scripts/manage_wallpapers.py list
  python3 scripts/manage_wallpapers.py stats
  python3 scripts/manage_wallpapers.py add --title "..." --category "Desktop 8K" --resolution "7680x4320" --items 12 --price "$4.99" --gumroad "https://..."
  python3 scripts/manage_wallpapers.py toggle --id "neo-tokyo-cyberpunk-8k"
  python3 scripts/manage_wallpapers.py delete --id "neo-tokyo-cyberpunk-8k"
"""

import os
import sys
import json
import argparse
import re
from datetime import datetime

DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "wallpapers.json"))

def load_data():
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    temp_path = f"{DATA_PATH}.tmp"
    with open(temp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    os.replace(temp_path, DATA_PATH)

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')
    return text or "wallpaper-bundle"

def cmd_list(args):
    data = load_data()
    print(f"\n📦 ShareFlow Wallpaper Catalog ({len(data)} bundles):")
    print(f"{'ID':<28} | {'Category':<15} | {'Resolution':<18} | {'Items':<6} | {'Price':<7} | {'Active'}")
    print("-" * 92)
    for w in data:
        active_str = "✅ YES" if w.get("active", True) else "❌ NO"
        print(f"{w.get('id', ''):<28} | {w.get('category', ''):<15} | {w.get('resolution', ''):<18} | {w.get('itemCount', 0):<6} | {w.get('price', ''):<7} | {active_str}")
    print()

def cmd_stats(args):
    data = load_data()
    total = len(data)
    active = sum(1 for w in data if w.get("active", True))
    by_cat = {}
    total_imgs = sum(w.get("itemCount", 0) for w in data)
    for w in data:
        cat = w.get("category", "Uncategorized")
        by_cat[cat] = by_cat.get(cat, 0) + 1
    
    print("\n📊 ShareFlow Wallpaper Store Statistics:")
    print(f"  • Total Bundles:     {total}")
    print(f"  • Active in Store:   {active}")
    print(f"  • Inactive / Draft:  {total - active}")
    print(f"  • Total Master 8K:   {total_imgs} images")
    print("  • By Category:")
    for cat, count in by_cat.items():
        print(f"    - {cat:<18}: {count} bundle(s)")
    print()

def cmd_add(args):
    data = load_data()
    bundle_id = args.id or slugify(args.title)
    
    # Check duplicate
    if any(w.get("id") == bundle_id for w in data):
        print(f"❌ Error: Bundle with ID '{bundle_id}' already exists.")
        sys.exit(1)
        
    new_bundle = {
        "id": bundle_id,
        "title": args.title,
        "description": args.description or f"High-fidelity {args.category} wallpaper pack in lossless resolution.",
        "category": args.category,
        "resolution": args.resolution,
        "aspectRatio": args.aspect_ratio or "16:9",
        "itemCount": args.items,
        "format": args.format or "Lossless PNG (HDR10)",
        "previewUrl": args.preview or "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
        "sampleImages": [args.preview] if args.preview else [],
        "price": args.price,
        "gumroadSlug": args.gumroad_slug or slugify(args.title),
        "gumroadBaseUrl": args.gumroad or "https://mhr3d.gumroad.com",
        "features": args.features.split(",") if args.features else [f"{args.resolution} Master", "HDR10 Wide Gamut", f"{args.items} Lossless Images"],
        "tags": args.tags.split(",") if args.tags else [args.category, "Wallpaper", "Ultra-HD"],
        "featured": args.featured,
        "active": True,
        "createdAt": datetime.utcnow().isoformat() + "Z"
    }
    
    data.append(new_bundle)
    save_data(data)
    print(f"✅ Successfully ingested wallpaper bundle '{args.title}' [ID: {bundle_id}].")

def cmd_toggle(args):
    data = load_data()
    target = None
    for w in data:
        if w.get("id") == args.id:
            target = w
            break
    if not target:
        print(f"❌ Bundle '{args.id}' not found.")
        sys.exit(1)
    
    target["active"] = not target.get("active", True)
    save_data(data)
    status = "ACTIVE" if target["active"] else "INACTIVE / DRAFT"
    print(f"✅ Bundle '{args.id}' status toggled to: {status}")

def cmd_delete(args):
    data = load_data()
    initial_len = len(data)
    data = [w for w in data if w.get("id") != args.id]
    if len(data) == initial_len:
        print(f"❌ Bundle '{args.id}' not found.")
        sys.exit(1)
    save_data(data)
    print(f"🗑️ Successfully deleted bundle '{args.id}'.")

def main():
    parser = argparse.ArgumentParser(description="ShareFlow Wallpaper Store Management CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # list
    subparsers.add_parser("list", help="List all wallpaper bundles")
    
    # stats
    subparsers.add_parser("stats", help="Show catalog statistics")

    # add
    p_add = subparsers.add_parser("add", help="Add a new wallpaper bundle")
    p_add.add_argument("--title", required=True, help="Bundle title")
    p_add.add_argument("--id", help="Optional specific slug ID")
    p_add.add_argument("--category", choices=["Desktop 8K", "Mobile OLED", "Dual Monitor", "3D Sci-Fi", "Minimalist Dark"], default="Desktop 8K")
    p_add.add_argument("--resolution", default="7680x4320", help="e.g. 7680x4320 or 3840x2160")
    p_add.add_argument("--aspect-ratio", default="16:9", help="e.g. 16:9, 32:9, 9:19.5")
    p_add.add_argument("--items", type=int, default=12, help="Number of included images")
    p_add.add_argument("--price", default="$4.99", help="Retail price")
    p_add.add_argument("--format", default="Lossless PNG (HDR10)")
    p_add.add_argument("--preview", help="Preview image URL")
    p_add.add_argument("--gumroad", help="Gumroad checkout URL")
    p_add.add_argument("--gumroad-slug", help="Gumroad slug")
    p_add.add_argument("--description", help="Description")
    p_add.add_argument("--features", help="Comma-separated feature list")
    p_add.add_argument("--tags", help="Comma-separated tags")
    p_add.add_argument("--featured", action="store_true", help="Mark as featured")

    # toggle
    p_tog = subparsers.add_parser("toggle", help="Toggle bundle active status")
    p_tog.add_argument("--id", required=True, help="Bundle ID")

    # delete
    p_del = subparsers.add_parser("delete", help="Delete a bundle")
    p_del.add_argument("--id", required=True, help="Bundle ID")

    args = parser.parse_args()
    if args.command == "list":
        cmd_list(args)
    elif args.command == "stats":
        cmd_stats(args)
    elif args.command == "add":
        cmd_add(args)
    elif args.command == "toggle":
        cmd_toggle(args)
    elif args.command == "delete":
        cmd_delete(args)

if __name__ == "__main__":
    main()
