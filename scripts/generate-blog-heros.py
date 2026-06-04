#!/usr/bin/env python3
"""Generate hero PNGs (1200x630) for 31 psychology blog articles.

Brand-aligned gradient backgrounds varied by category, English title
center, AI Test Lab watermark bottom. One-shot script; idempotent
(overwrites). Output: assets/images/blog/{slug}-hero.png
"""
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import os
import textwrap

W, H = 1200, 630
OUT_DIR = "assets/images/blog"

ARTICLES = [
    ("ai-personality-analysis-accuracy", "AI Personality Analysis Accuracy", "Psychology"),
    ("barnum-effect-psychology",         "The Barnum Effect",                "Psychology"),
    ("biological-vs-mental-age",         "Biological vs Mental Age",         "Mental Age"),
    ("blood-type-compatibility-science", "Blood Type Compatibility",         "Compatibility"),
    ("compatibility-psychology",         "Compatibility Psychology",         "Compatibility"),
    ("compatible-couples-psychology",    "What Makes Couples Compatible",    "Compatibility"),
    ("couple-compatibility-science",     "The Science of Couple Compatibility","Compatibility"),
    ("erikson-psychosocial-stages",      "Erikson's 8 Stages",               "Mental Age"),
    ("healthy-relationship-signs",       "Signs of a Healthy Relationship",  "Compatibility"),
    ("mbti-vs-big5",                     "MBTI vs Big Five",                 "Personality"),
    ("mental-age-meaning",               "What is Mental Age?",              "Mental Age"),
    ("mental-age-science",               "The Science of Mental Age",        "Mental Age"),
    ("personality-career-guide",         "Personality and Career Guide",     "Personality"),
    ("personality-test-history",         "History of Personality Tests",     "Personality"),
    ("personality-types-love-patterns",  "Personality Types and Love",       "Personality"),
    ("psychology-test-stress-relief",    "Psychology Tests and Stress Relief","Psychology"),
    ("relationship-compatibility-factors","Relationship Compatibility Factors","Compatibility"),
    ("zodiac-vs-ai-compatibility",       "Zodiac vs AI Compatibility",       "Compatibility"),
    ("16personalities-vs-mbti",          "16Personalities vs MBTI",          "Personality"),
    ("attachment-styles-relationships",  "Attachment Styles in Love",        "Compatibility"),
    ("big-five-personality-guide",       "The Big Five Personality Guide",   "Personality"),
    ("cognitive-dissonance-psychology",  "Cognitive Dissonance",             "Psychology"),
    ("dark-triad-personality",           "The Dark Triad",                   "Personality"),
    ("does-personality-change",          "Does Personality Change?",         "Personality"),
    ("emotional-intelligence-psychology","Emotional Intelligence",           "Psychology"),
    ("enneagram-nine-types",             "The Enneagram's 9 Types",          "Personality"),
    ("mbti-cognitive-functions",         "MBTI Cognitive Functions",         "Personality"),
    ("piaget-cognitive-development",     "Piaget's Cognitive Development",   "Mental Age"),
    ("social-desirability-bias-tests",   "Social Desirability Bias",         "Psychology"),
    ("sternberg-triangular-love",        "Sternberg's Triangle of Love",     "Compatibility"),
    ("test-reliability-validity",        "Test Reliability & Validity",      "Psychology"),
]

CATEGORY_COLORS = {
    "Psychology":    ((99, 102, 241),  (139, 92, 246)),   # indigo → violet
    "Personality":   ((109, 40, 217),  (236, 56, 153)),   # purple → pink
    "Compatibility": ((236, 56, 153),  (251, 113, 133)),  # pink → rose
    "Mental Age":    ((6, 182, 212),   (99, 102, 241)),   # cyan → indigo
}

font_paths = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/Library/Fonts/Arial Bold.ttf",
]
def find_font(size):
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                continue
    return ImageFont.load_default()

title_font = find_font(72)
sub_font   = find_font(34)
brand_font = find_font(28)

os.makedirs(OUT_DIR, exist_ok=True)

xs, ys = np.meshgrid(np.linspace(0, 1, W), np.linspace(0, 1, H))
t = (xs + ys) / 2

for slug, title, category in ARTICLES:
    c1, c2 = CATEGORY_COLORS[category]
    arr = np.zeros((H, W, 3), dtype=np.uint8)
    for ch in range(3):
        arr[..., ch] = (c1[ch] * (1 - t) + c2[ch] * t).astype(np.uint8)
    img = Image.fromarray(arr, mode="RGB")
    draw = ImageDraw.Draw(img)

    cat_label = category.upper()
    cb = draw.textbbox((0, 0), cat_label, font=sub_font)
    draw.text(((W - (cb[2] - cb[0])) // 2, 90), cat_label,
              fill=(255, 255, 255), font=sub_font)

    lines = textwrap.wrap(title, width=22)
    line_h = 90
    total_h = len(lines) * line_h
    y0 = (H - total_h) // 2 + 10
    for i, ln in enumerate(lines):
        lb = draw.textbbox((0, 0), ln, font=title_font)
        draw.text(((W - (lb[2] - lb[0])) // 2, y0 + i * line_h),
                  ln, fill="white", font=title_font)

    brand = "AI Test Lab"
    bb = draw.textbbox((0, 0), brand, font=brand_font)
    draw.text(((W - (bb[2] - bb[0])) // 2, H - 70), brand,
              fill=(255, 255, 255), font=brand_font)

    out = f"{OUT_DIR}/{slug}-hero.png"
    img.save(out, "PNG", optimize=True)
    print(f"OK: {out} ({os.path.getsize(out)} bytes)")

print(f"\nDone: {len(ARTICLES)} hero images")
