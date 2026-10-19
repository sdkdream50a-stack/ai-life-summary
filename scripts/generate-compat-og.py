#!/usr/bin/env python3
"""Generate per-couple compatibility share images (1200x630) → assets/images/cc/{token}.jpg

Shared /{lang}/compatibility/s/{token}/ links had no og:image, so KakaoTalk/LINE/X
unfurled them as bare cards. One language-neutral image per couple (emoji pair +
English name + one line), the same pattern as assets/images/pt/ for personality
types; the localized couple name travels in og:title.

Tokens come from the shipped data via build-shared-entry.js --dump-compat-tokens,
so a new couple only needs a re-run. Contains no user data: tokens are result labels.

Usage: python3 scripts/generate-compat-og.py   (needs Pillow; macOS system fonts)
"""
import json
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "images", "cc")
W, H = 1200, 630
EMOJI_FONT = "/System/Library/Fonts/Apple Color Emoji.ttc"
BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
REG = "/System/Library/Fonts/Supplemental/Arial.ttf"


def gradient():
    img = Image.new("RGB", (W, H))
    c1, c2 = (0xEF, 0xE6, 0xFA), (0xBB, 0xA8, 0xDA)  # lavender, as on the share pages
    px = img.load()
    for y in range(H):
        for x in range(W):
            t = (x / W + y / H) / 2
            px[x, y] = tuple(int(a * (1 - t) + b * t) for a, b in zip(c1, c2))
    return img


def emoji_strip(text, height):
    # Apple Color Emoji only renders at its bitmap strike (160); draw there, then scale.
    font = ImageFont.truetype(EMOJI_FONT, 160)
    probe = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    box = probe.textbbox((0, 0), text, font=font, embedded_color=True)
    strip = Image.new("RGBA", (box[2] - box[0] + 20, box[3] - box[1] + 20), (0, 0, 0, 0))
    ImageDraw.Draw(strip).text((10 - box[0], 10 - box[1]), text, font=font, embedded_color=True)
    scale = height / strip.height
    return strip.resize((int(strip.width * scale), height), Image.LANCZOS)


def wrap(draw, text, font, width):
    words, lines, line = text.split(), [], ""
    for w in words:
        trial = (line + " " + w).strip()
        if draw.textlength(trial, font=font) <= width:
            line = trial
        else:
            lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines[:2]


def card(item):
    img = gradient()
    d = ImageDraw.Draw(img)
    kicker = ImageFont.truetype(BOLD, 30)
    title = ImageFont.truetype(BOLD, 64)
    body = ImageFont.truetype(REG, 32)
    d.text((80, 64), "ANIMAL COUPLE TYPE", font=kicker, fill=(0x6B, 0x5B, 0x86))
    strip = emoji_strip(item["emoji"], 190)
    img.paste(strip, ((W - strip.width) // 2, 130), strip)
    tw = d.textlength(item["title"], font=title)
    d.text(((W - tw) / 2, 350), item["title"], font=title, fill=(0x16, 0x13, 0x0F))
    y = 440
    for line in wrap(d, item.get("desc") or "", body, 980):
        lw = d.textlength(line, font=body)
        d.text(((W - lw) / 2, y), line, font=body, fill=(0x3A, 0x33, 0x48))
        y += 44
    domain = ImageFont.truetype(BOLD, 30)
    dw = d.textlength("smartaitest.com", font=domain)
    d.text((W - 80 - dw, H - 70), "smartaitest.com", font=domain, fill=(0x4A, 0x3F, 0x5E))
    return img


def main():
    raw = subprocess.run(["node", os.path.join(ROOT, "scripts/build-shared-entry.js"), "--dump-compat-tokens"],
                         capture_output=True, text=True, check=True).stdout
    items = json.loads(raw)
    os.makedirs(OUT, exist_ok=True)
    for item in items:
        card(item).save(os.path.join(OUT, f"{item['token']}.jpg"), "JPEG", quality=86, optimize=True)
    print(f"generate-compat-og: wrote {len(items)} image(s) to assets/images/cc/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
