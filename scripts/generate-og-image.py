#!/usr/bin/env python3
"""Generate default OG image (1200x630) for AI Test Lab.

One-shot script. Outputs assets/images/og-default.png with brand gradient
(#6366f1 → #ec4899) matching favicon, site name + tagline.
"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
OUT = "assets/images/og-default.png"

img = Image.new("RGB", (W, H), "#6366f1")
draw = ImageDraw.Draw(img)

# Diagonal gradient #6366f1 → #ec4899
c1 = (0x63, 0x66, 0xf1)
c2 = (0xec, 0x38, 0x99)
for y in range(H):
    for x in range(W):
        t = (x / W + y / H) / 2
        r = int(c1[0] * (1 - t) + c2[0] * t)
        g = int(c1[1] * (1 - t) + c2[1] * t)
        b = int(c1[2] * (1 - t) + c2[2] * t)
        img.putpixel((x, y), (r, g, b))

draw = ImageDraw.Draw(img)

# Try system fonts in priority order
font_paths = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/Library/Fonts/Arial Bold.ttf",
]
title_font = None
sub_font = None
for fp in font_paths:
    if os.path.exists(fp):
        try:
            title_font = ImageFont.truetype(fp, 96)
            sub_font = ImageFont.truetype(fp, 42)
            break
        except Exception:
            continue
if title_font is None:
    title_font = ImageFont.load_default()
    sub_font = ImageFont.load_default()

title = "AI Test Lab"
subtitle = "Free AI Personality Tests"

t_bbox = draw.textbbox((0, 0), title, font=title_font)
t_w = t_bbox[2] - t_bbox[0]
s_bbox = draw.textbbox((0, 0), subtitle, font=sub_font)
s_w = s_bbox[2] - s_bbox[0]

draw.text(((W - t_w) // 2, 240), title, fill="white", font=title_font)
draw.text(((W - s_w) // 2, 360), subtitle, fill=(255, 255, 255, 230), font=sub_font)

# Sparkle symbol (✨ would need emoji font; use simple star)
draw.text((W // 2 - 20, 100), "✨", fill="white", font=title_font)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT, "PNG", optimize=True)
print(f"Wrote {OUT} ({os.path.getsize(OUT)} bytes)")
