#!/usr/bin/env python3
"""Render original landscape product covers for the premium prompt bundles."""
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "premium-covers"
W, H = 1600, 900

PRODUCTS = {
    "micro-saas-launch-kit": {
        "title": "MICRO-SAAS\nLAUNCH KIT",
        "subtitle": "12 UI PROMPTS FOR v0 • LOVABLE • BOLT",
        "eyebrow": "SHAREFLOW / PRODUCT DESIGN SERIES 01",
        "colors": ("#081522", "#102a43", "#27d7ed", "#a78bfa"),
        "scene": "dashboard",
    },
    "design-system-architect": {
        "title": "DESIGN SYSTEM\nARCHITECT",
        "subtitle": "UI TOKENS • COMPONENTS • ACCESSIBILITY",
        "eyebrow": "SHAREFLOW / PRODUCT DESIGN SERIES 02",
        "colors": ("#151419", "#26232e", "#a78bfa", "#9ce6c4"),
        "scene": "tokens",
    },
    "webgl-motion-studio": {
        "title": "WEBGL MOTION\nSTUDIO",
        "subtitle": "12 PROMPTS FOR REACT THREE FIBER",
        "eyebrow": "THREE.JS • SHADERS • INTERACTIVE 3D",
        "colors": ("#070a16", "#101b39", "#20d9ff", "#7868ff"),
        "scene": "webgl",
    },
    "b2b-commerce-blueprint": {
        "title": "B2B COMMERCE\nBLUEPRINT",
        "subtitle": "WHOLESALE • SUPPLIER • BULK ORDER",
        "eyebrow": "SHAREFLOW / PRODUCT DESIGN SERIES 04",
        "colors": ("#f4f0e7", "#e7e0d1", "#17334d", "#e68d48"),
        "scene": "commerce",
    },
    "ai-workflow-canvas": {
        "title": "AI WORKFLOW\nCANVAS",
        "subtitle": "VISUAL AGENTS • AUTOMATION • DEBUGGING",
        "eyebrow": "REACT FLOW • PROMPT COLLECTION 05",
        "colors": ("#0a0c17", "#171b2c", "#8e78ff", "#38d7cb"),
        "scene": "workflow",
    },
}


def font(size: int, bold: bool = False) -> Any:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).is_file():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def rgb(color: str) -> tuple[int, int, int]:
    color = color.lstrip("#")
    channels = tuple(int(color[i:i+2], 16) for i in (0, 2, 4))
    return channels[0], channels[1], channels[2]


def draw_gradient(draw: ImageDraw.ImageDraw, top: str, bottom: str) -> None:
    a, b = rgb(top), rgb(bottom)
    for y in range(H):
        t = y / (H - 1)
        c = tuple(int(a[i] * (1-t) + b[i] * t) for i in range(3))
        draw.line((0, y, W, y), fill=c)


def panel(draw: ImageDraw.ImageDraw, box, fill, outline, radius=24, width=2):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def art(draw: ImageDraw.ImageDraw, product) -> None:
    scene = product["scene"]
    accent, accent2 = product["colors"][2:]
    if scene == "workflow":
        nodes = [(1010, 210), (1300, 310), (1050, 480), (1350, 590), (1150, 720)]
        for a, b in zip(nodes, nodes[1:]):
            x1, y1 = a; x2, y2 = b
            draw.line((x1+72, y1+40, (x1+x2)//2, y1+40, (x1+x2)//2, y2+40, x2, y2+40), fill=rgb(accent), width=5)
        for i, (x, y) in enumerate(nodes):
            panel(draw, (x, y, x+150, y+82), "#20263b", accent if i % 2 == 0 else accent2, 18, 3)
            draw.ellipse((x+18, y+24, x+42, y+48), fill=rgb(accent if i % 2 == 0 else accent2))
            draw.line((x+57, y+29, x+128, y+29), fill="#edf2ff", width=4)
            draw.line((x+57, y+48, x+110, y+48), fill="#8893ad", width=3)
    elif scene == "tokens":
        panel(draw, (980, 205, 1505, 706), "#26232e", "#514c5d", 28, 2)
        for i, color in enumerate(["#a78bfa", "#9ce6c4", "#f6cf78", "#f18c8c", "#9ac7ff"]):
            x = 1020 + i*88
            draw.rounded_rectangle((x, 260, x+66, 326), radius=15, fill=color)
            draw.text((x, 339), f"0{i+1}", font=font(15, True), fill="#d9d4e2")
        for row, width in enumerate([340, 270, 390, 310]):
            y=408+row*56
            panel(draw, (1020, y, 1020+width, y+39), "#302d39", "#494552", 10, 1)
            draw.text((1040,y+8), ["BUTTON / PRIMARY", "INPUT / DEFAULT", "CARD / SURFACE", "TYPE / HEADING"][row], font=font(15, True), fill="#eeeaf5")
        draw.text((1020, 650), "FOUNDATIONS     COMPONENTS     STATES", font=font(14, True), fill=accent)
    elif scene == "commerce":
        panel(draw, (965, 190, 1510, 710), "#fffdf8", "#d6cebd", 25, 2)
        draw.text((1005, 220), "WHOLESALE ORDER", font=font(19, True), fill="#17334d")
        draw.line((1005, 264, 1465, 264), fill="#d9d2c5", width=2)
        for i, (name, price) in enumerate([("Studio chair", "$148.00"), ("Desk lamp", "$52.00"), ("Monitor arm", "$36.00"), ("Cable tray", "$18.00")]):
            y=292+i*73
            draw.rounded_rectangle((1005,y,1055,y+48), radius=9, fill=["#e8eef0", "#efe9df", "#e8e6f4", "#e5eee8"][i])
            draw.text((1075,y+4), name, font=font(17, True), fill="#24384a")
            draw.text((1075,y+29), "SKU-10"+str(i+1)+"  •  MOQ 4", font=font(12), fill="#75808a")
            draw.text((1380,y+12), price, font=font(16, True), fill="#17334d")
        panel(draw, (1005, 603, 1465, 670), "#17334d", "#17334d", 15, 1)
        draw.text((1040, 621), "REQUEST BULK QUOTE", font=font(19, True), fill="#fffdf8")
    elif scene == "webgl":
        cx, cy = 1240, 455
        for r, count in [(185, 44), (140, 34), (90, 23)]:
            for i in range(count):
                import math
                theta = i*2.399963 + r/37
                x = cx + math.cos(theta)*r*(0.65 + 0.35*math.sin(i*1.7)**2)
                y = cy + math.sin(theta)*r*0.72
                rad = 2 + (i % 5 == 0)*3
                draw.ellipse((x-rad,y-rad,x+rad,y+rad), fill=rgb(accent if i%3 else accent2))
        draw.ellipse((cx-27,cy-27,cx+27,cy+27), outline=rgb(accent), width=3)
        for i in range(6):
            y=195+i*94
            draw.line((960,y,1500,y), fill="#283653", width=1)
    else:
        panel(draw, (970, 190, 1510, 710), "#101c2b", "#28425a", 25, 2)
        # Clean miniature landing-page dashboard mockup.
        draw.rounded_rectangle((1000,220,1480,274), radius=13, fill="#172b40")
        draw.ellipse((1020,238,1034,252), fill=rgb(accent))
        draw.text((1050, 236), "NORTHSTAR  /  PLATFORM", font=font(14, True), fill="#e8f5fc")
        panel(draw,(1000,300,1480,440),"#142338","#26455e",18,1)
        draw.text((1030,324),"Build your next idea.",font=font(26,True),fill="#f3f8ff")
        draw.text((1030,368),"Reliable tools for ambitious teams.",font=font(15),fill="#97adc0")
        draw.rounded_rectangle((1030,402,1168,430), radius=12, fill=rgb(accent))
        for i in range(3):
            x=1000+i*163
            panel(draw,(x,466,x+150,660),"#17283b","#2a4055",16,1)
            draw.ellipse((x+17,485,x+44,512),fill=rgb(accent if i%2==0 else accent2))
            draw.line((x+17,535,x+125,535),fill="#eef5fb",width=3)
            draw.line((x+17,555,x+115,555),fill="#829aae",width=2)
            draw.line((x+17,575,x+100,575),fill="#829aae",width=2)
            panel(draw,(x+17,612,x+92,639),"#213a51","#213a51",9,1)


def render(slug: str, product: dict) -> None:
    top, bottom, accent, accent2 = product["colors"]
    image=Image.new("RGB",(W,H))
    draw=ImageDraw.Draw(image)
    draw_gradient(draw,top,bottom)
    # quiet grid and section divider
    grid = "#243343" if product["scene"] != "commerce" else "#e5dfd3"
    for x in range(50,W,50): draw.line((x,0,x,H),fill=grid,width=1)
    for y in range(50,H,50): draw.line((0,y,W,y),fill=grid,width=1)
    art(draw,product)
    fg="#f7f8fb" if product["scene"] != "commerce" else "#14283b"
    muted="#b7c4d1" if product["scene"] != "commerce" else "#5d6b72"
    draw.rounded_rectangle((78,83,91,96),radius=6,fill=rgb(accent))
    draw.text((108,77),product["eyebrow"],font=font(17,True),fill=muted)
    draw.line((78,125,876,125),fill=accent,width=2)
    title_font=font(79,True)
    draw.multiline_text((78,205),product["title"],font=title_font,fill=fg,spacing=4,stroke_width=0)
    draw.rounded_rectangle((78,492,855,498),radius=3,fill=rgb(accent))
    draw.text((80,537),product["subtitle"],font=font(20,True),fill=fg)
    draw.text((80,593),"A practical prompt collection for real product work.",font=font(18),fill=muted)
    panel(draw,(78,690,460,755),"#ffffff" if product["scene"]=="commerce" else "#ffffff12",accent,16,2)
    draw.text((101,709),"12 COMPLETE PROMPT BLUEPRINTS",font=font(15,True),fill=fg)
    draw.text((80,824),"SHAREFLOW  •  DIGITAL DOWNLOAD  •  PROMPTS ONLY",font=font(13,True),fill=muted)
    OUT.mkdir(parents=True,exist_ok=True)
    path=OUT/f"{slug}.png"
    image.save(path,optimize=True)
    print(f"{path}  {image.size}  {path.stat().st_size} bytes")

if __name__ == "__main__":
    for product_slug, product_data in PRODUCTS.items():
        render(product_slug, product_data)
