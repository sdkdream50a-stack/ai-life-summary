#!/usr/bin/env python3
"""Generate per-couple compatibility share images (1200x630) → assets/images/cc/{lang}/{token}.jpg

Shared /{lang}/compatibility/s/{token}/ links had no og:image, so KakaoTalk/LINE/X
unfurled them as bare cards. Each couple gets a localized image per language
(emoji pair, translated kicker, name and description), matching the share page.

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
FONTS = {
    "en": ((BOLD, 0), (REG, 0)),
    "ko": (("/System/Library/Fonts/AppleSDGothicNeo.ttc", 6),
           ("/System/Library/Fonts/AppleSDGothicNeo.ttc", 2)),
    "ja": (("/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc", 0),
           ("/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc", 0)),
    "zh": (("/System/Library/Fonts/Hiragino Sans GB.ttc", 2),
           ("/System/Library/Fonts/Hiragino Sans GB.ttc", 0)),
    "es": ((BOLD, 0), (REG, 0)),
}


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


def wrap(draw, text, font, width, lang):
    units = text if lang in ("ja", "zh") else text.split()
    separator = "" if lang in ("ja", "zh") else " "
    lines, line = [], ""
    for w in units:
        trial = (line + separator + w).strip()
        if draw.textlength(trial, font=font) <= width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines[:2]


def card(item):
    img = gradient()
    d = ImageDraw.Draw(img)
    bold, regular = FONTS[item["lang"]]
    kicker = ImageFont.truetype(bold[0], 30, index=bold[1])
    title_size = 64
    title = ImageFont.truetype(bold[0], title_size, index=bold[1])
    while d.textlength(item["title"], font=title) > 1120 and title_size > 1:
        title_size -= 1
        title = ImageFont.truetype(bold[0], title_size, index=bold[1])
    body = ImageFont.truetype(regular[0], 32, index=regular[1])
    d.text((80, 64), item["kicker"], font=kicker, fill=(0x6B, 0x5B, 0x86))
    strip = emoji_strip(item["emoji"], 190)
    img.paste(strip, ((W - strip.width) // 2, 130), strip)
    tw = d.textlength(item["title"], font=title)
    d.text(((W - tw) / 2, 350), item["title"], font=title, fill=(0x16, 0x13, 0x0F))
    y = 440
    for line in wrap(d, item.get("desc") or "", body, 980, item["lang"]):
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
    for item in items:
        lang_out = os.path.join(OUT, item["lang"])
        os.makedirs(lang_out, exist_ok=True)
        card(item).save(os.path.join(lang_out, f"{item['token']}.jpg"), "JPEG", quality=86, optimize=True)
    print(f"generate-compat-og: wrote {len(items)} image(s) to assets/images/cc/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
