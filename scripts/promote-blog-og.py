#!/usr/bin/env python3
"""Promote og:image / twitter:image / JSON-LD image of 18 blog articles
from generic og-default.png to per-article hero PNG.

Idempotent: skips files where og-default.png reference no longer exists
(i.e., already promoted or never set).
"""
import os

ARTICLES = [
    "ai-personality-analysis-accuracy",
    "barnum-effect-psychology",
    "biological-vs-mental-age",
    "blood-type-compatibility-science",
    "compatibility-psychology",
    "compatible-couples-psychology",
    "couple-compatibility-science",
    "erikson-psychosocial-stages",
    "healthy-relationship-signs",
    "mbti-vs-big5",
    "mental-age-meaning",
    "mental-age-science",
    "personality-career-guide",
    "personality-test-history",
    "personality-types-love-patterns",
    "psychology-test-stress-relief",
    "relationship-compatibility-factors",
    "zodiac-vs-ai-compatibility",
]

DEFAULT = "https://smartaitest.com/assets/images/og-default.png"

for slug in ARTICLES:
    path = f"blog/{slug}.html"
    if not os.path.exists(path):
        print(f"SKIP missing: {path}")
        continue
    with open(path, encoding="utf-8") as f:
        html = f.read()
    if DEFAULT not in html:
        print(f"SKIP no og-default ref: {path}")
        continue
    target = f"https://smartaitest.com/assets/images/blog/{slug}-hero.png"
    n = html.count(DEFAULT)
    new_html = html.replace(DEFAULT, target)
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_html)
    print(f"OK: {path} ({n} → hero)")

print("\nDone")
