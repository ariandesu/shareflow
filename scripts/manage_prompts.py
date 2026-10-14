#!/usr/bin/env python3
"""
ShareFlow AI Website Design Prompts Management CLI
Autonomous prompt catalog manager for Sanctuary / Sera.
Usage:
  python3 scripts/manage_prompts.py list
  python3 scripts/manage_prompts.py stats
  python3 scripts/manage_prompts.py add --title "..." --tool "v0" --category "Landing Page" --free --prompt "..."
  python3 scripts/manage_prompts.py add --title "..." --tool "Cursor" --category "Micro-SaaS" --price-bdt 49 --price-usd 0.99 --supportkori "https://www.supportkori.com/mhr3d" --prompt "..."
  python3 scripts/manage_prompts.py toggle --id "dark-saas-bento-hero-v0"
  python3 scripts/manage_prompts.py delete --id "dark-saas-bento-hero-v0"
"""

import os
import sys
import json
import argparse
import re
from datetime import datetime

DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "prompts.json"))

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
    return text or "ai-prompt"

def cmd_list(args):
    data = load_data()
    print(f"\n⚡ ShareFlow AI Website Design Prompts ({len(data)} items):")
    print(f"{'ID':<32} | {'Category':<14} | {'Tool':<10} | {'Type':<8} | {'Price':<12} | {'Copies':<6} | {'Active'}")
    print("-" * 102)
    for p in data:
        is_free = p.get("isFree", True)
        type_str = "🎁 FREE" if is_free else "💎 PAID"
        if is_free:
            price_str = "0 BDT / $0"
        else:
            price_str = f"৳{p.get('priceBdt', 49)} (${p.get('priceUsd', 0.99)})"
        active_str = "✅ YES" if p.get("active", True) else "❌ NO"
        print(f"{p.get('id', ''):<32} | {p.get('category', ''):<14} | {p.get('targetTool', ''):<10} | {type_str:<8} | {price_str:<12} | {p.get('copyCount', 0):<6} | {active_str}")
    print()

def cmd_stats(args):
    data = load_data()
    total = len(data)
    free_count = sum(1 for p in data if p.get("isFree", True))
    paid_count = total - free_count
    active = sum(1 for p in data if p.get("active", True))
    total_copies = sum(p.get("copyCount", 0) for p in data)
    
    by_tool = {}
    by_cat = {}
    for p in data:
        tool = p.get("targetTool", "Universal")
        cat = p.get("category", "Landing Page")
        by_tool[tool] = by_tool.get(tool, 0) + 1
        by_cat[cat] = by_cat.get(cat, 0) + 1
        
    print("\n📊 ShareFlow AI Prompt Store Analytics:")
    print(f"  • Total Prompts:         {total}")
    print(f"  • Free Giveaways:        {free_count} (SuperDesign.dev model)")
    print(f"  • Premium Micro-Packs:   {paid_count} (SupportKori & Gumroad)")
    print(f"  • Total Copies / Uses:   {total_copies:,}")
    print(f"  • Active in Production:  {active}")
    print("  • By AI Generator / Tool:")
    for tool, count in by_tool.items():
        print(f"    - {tool:<12}: {count} prompt(s)")
    print("  • By Design Category:")
    for cat, count in by_cat.items():
        print(f"    - {cat:<14}: {count} prompt(s)")
    print()

def cmd_add(args):
    data = load_data()
    prompt_id = args.id or slugify(f"{args.title}-{args.tool}")
    
    if any(p.get("id") == prompt_id for p in data):
        print(f"❌ Error: Prompt with ID '{prompt_id}' already exists.")
        sys.exit(1)
        
    is_free = args.free or (args.price_bdt is None and args.price_usd is None)
    
    new_item = {
        "id": prompt_id,
        "title": args.title,
        "description": args.description or f"Curated AI website design prompt for {args.tool}.",
        "category": args.category,
        "targetTool": args.tool,
        "isFree": is_free,
        "priceBdt": None if is_free else (args.price_bdt or 49),
        "priceUsd": None if is_free else (args.price_usd or 0.99),
        "promptContent": args.prompt,
        "systemInstruction": args.system or "You are an elite principal UI/UX frontend designer.",
        "previewImage": args.preview or "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        "livePreviewUrl": args.preview_url or "https://superdesign.dev",
        "supportKoriUrl": None if is_free else (args.supportkori or "https://www.supportkori.com/mhr3d"),
        "gumroadUrl": None if is_free else (args.gumroad or "https://mhr3d.gumroad.com"),
        "tags": args.tags.split(",") if args.tags else [args.tool, args.category, "AI Prompt"],
        "features": args.features.split(",") if args.features else ["Production Ready", "Tailwind CSS", "React Component"],
        "copyCount": 0,
        "active": True,
        "createdAt": datetime.utcnow().isoformat() + "Z"
    }
    
    data.append(new_item)
    save_data(data)
    print(f"✅ Successfully added AI prompt '{args.title}' [ID: {prompt_id}].")

def cmd_toggle(args):
    data = load_data()
    target = None
    for p in data:
        if p.get("id") == args.id:
            target = p
            break
    if not target:
        print(f"❌ Prompt '{args.id}' not found.")
        sys.exit(1)
        
    target["active"] = not target.get("active", True)
    save_data(data)
    status = "ACTIVE" if target["active"] else "INACTIVE / DRAFT"
    print(f"✅ Prompt '{args.id}' status toggled to: {status}")

def cmd_delete(args):
    data = load_data()
    initial_len = len(data)
    data = [p for p in data if p.get("id") != args.id]
    if len(data) == initial_len:
        print(f"❌ Prompt '{args.id}' not found.")
        sys.exit(1)
    save_data(data)
    print(f"🗑️ Successfully deleted prompt '{args.id}'.")

def main():
    parser = argparse.ArgumentParser(description="ShareFlow AI Prompts Management CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # list
    subparsers.add_parser("list", help="List all AI prompts")

    # stats
    subparsers.add_parser("stats", help="Show prompt catalog statistics")

    # add
    p_add = subparsers.add_parser("add", help="Add a new AI prompt")
    p_add.add_argument("--title", required=True, help="Prompt title")
    p_add.add_argument("--prompt", required=True, help="Full text prompt specification")
    p_add.add_argument("--id", help="Optional specific ID slug")
    p_add.add_argument("--tool", choices=["v0", "Bolt.new", "Lovable", "Cursor", "Claude", "Universal"], default="v0")
    p_add.add_argument("--category", choices=["Landing Page", "Dashboard", "E-Commerce", "Portfolio", "Micro-SaaS", "Mobile UI"], default="Landing Page")
    p_add.add_argument("--free", action="store_true", help="Set as 100%% free giveaway")
    p_add.add_argument("--price-bdt", type=int, help="Price in Bangladeshi Taka (e.g. 49)")
    p_add.add_argument("--price-usd", type=float, help="Price in USD (e.g. 0.99)")
    p_add.add_argument("--supportkori", help="SupportKori payment link")
    p_add.add_argument("--gumroad", help="Gumroad payment link")
    p_add.add_argument("--system", help="Recommended system persona prompt")
    p_add.add_argument("--description", help="Short description")
    p_add.add_argument("--preview", help="Preview image URL")
    p_add.add_argument("--preview-url", help="Live website demo or reference URL")
    p_add.add_argument("--features", help="Comma-separated feature bullets")
    p_add.add_argument("--tags", help="Comma-separated tags")

    # toggle
    p_tog = subparsers.add_parser("toggle", help="Toggle prompt active status")
    p_tog.add_argument("--id", required=True, help="Prompt ID")

    # delete
    p_del = subparsers.add_parser("delete", help="Delete a prompt")
    p_del.add_argument("--id", required=True, help="Prompt ID")

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
