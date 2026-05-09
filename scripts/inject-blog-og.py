#!/usr/bin/env python3
"""Inject og:image / twitter:image / JSON-LD image into 7 variant blog
posts (article-body structure) that lack these fields. Image points to
per-article hero PNG.

Idempotent: skips files already containing og:image.
"""
import os
import re

VARIANT_ARTICLES = [
    "biological-vs-mental-age",
    "compatible-couples-psychology",
    "erikson-psychosocial-stages",
    "personality-career-guide",
    "personality-types-love-patterns",
    "psychology-test-stress-relief",
    "zodiac-vs-ai-compatibility",
]

for slug in VARIANT_ARTICLES:
    path = f"blog/{slug}.html"
    if not os.path.exists(path):
        print(f"SKIP missing: {path}")
        continue
    with open(path, encoding="utf-8") as f:
        html = f.read()
    if 'property="og:image"' in html:
        print(f"SKIP already has og:image: {path}")
        continue

    image_url = f"https://smartaitest.com/assets/images/blog/{slug}-hero.png"

    # 1. og:image after og:locale
    html, n1 = re.subn(
        r'(<meta property="og:locale"[^>]*>)',
        r'\1' + f'\n  <meta property="og:image" content="{image_url}">',
        html, count=1
    )
    # 2. twitter:image after twitter:card
    html, n2 = re.subn(
        r'(<meta name="twitter:card"[^>]*>)',
        r'\1' + f'\n  <meta name="twitter:image" content="{image_url}">',
        html, count=1
    )
    # 3. JSON-LD: add "image" field after "@type": "BlogPosting"
    html, n3 = re.subn(
        r'("@type":\s*"BlogPosting")',
        r'\1' + f',\n    "image": "{image_url}"',
        html, count=1
    )
    if not (n1 and n2 and n3):
        print(f"WARN: {path} partial match og={n1} tw={n2} jsonld={n3}")
        continue

    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"OK: {path}")

print("\nDone")
