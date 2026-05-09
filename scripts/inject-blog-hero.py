#!/usr/bin/env python3
"""Inject hero <figure> into 18 psychology blog HTML files.

Idempotent (skips files already containing the hero marker class).
Inserts at the start of <div class="prose prose-lg max-w-none">.
"""
import re
import os

ARTICLES = [
    ("ai-personality-analysis-accuracy", "AI 성격 분석의 정확도 시각화"),
    ("barnum-effect-psychology",         "바넘 효과 심리학 시각화"),
    ("biological-vs-mental-age",         "생물학적 나이와 정신연령 비교 시각화"),
    ("blood-type-compatibility-science", "혈액형 궁합의 과학 시각화"),
    ("compatibility-psychology",         "관계 호환성 심리학 시각화"),
    ("compatible-couples-psychology",    "잘 맞는 커플의 심리학 시각화"),
    ("couple-compatibility-science",     "커플 궁합 과학 시각화"),
    ("erikson-psychosocial-stages",      "에릭슨 심리사회적 발달 8단계 시각화"),
    ("healthy-relationship-signs",       "건강한 관계의 신호 시각화"),
    ("mbti-vs-big5",                     "MBTI와 Big 5 성격 모델 비교 시각화"),
    ("mental-age-meaning",               "정신연령의 의미 시각화"),
    ("mental-age-science",               "정신연령 측정 과학 시각화"),
    ("personality-career-guide",         "성격유형별 커리어 가이드 시각화"),
    ("personality-test-history",         "성격 테스트의 역사 시각화"),
    ("personality-types-love-patterns",  "성격유형과 연애 패턴 시각화"),
    ("psychology-test-stress-relief",    "심리 테스트와 스트레스 해소 시각화"),
    ("relationship-compatibility-factors","관계 호환성 요인 시각화"),
    ("zodiac-vs-ai-compatibility",       "별자리 vs AI 궁합 시각화"),
]

PATTERN_PROSE    = re.compile(r'(<div[^>]*\bclass="[^"]*\bprose\b[^"]*"[^>]*>\s*\n)')
PATTERN_ARTICLE  = re.compile(r'(<article class="article-body">\s*\n)')
MARKER = "blog-hero-image"

for slug, alt_ko in ARTICLES:
    path = f"blog/{slug}.html"
    if not os.path.exists(path):
        print(f"SKIP missing: {path}")
        continue
    with open(path, encoding="utf-8") as f:
        html = f.read()
    if MARKER in html:
        print(f"SKIP already injected: {path}")
        continue
    figure = (
        f'\n                    <figure class="my-6 {MARKER}">\n'
        f'                        <img src="/assets/images/blog/{slug}-hero.png" '
        f'alt="{alt_ko}" width="1200" height="630" '
        f'class="rounded-xl shadow-lg w-full h-auto" loading="lazy" />\n'
        f'                    </figure>\n'
    )
    new_html, n = PATTERN_PROSE.subn(lambda m: m.group(1) + figure, html, count=1)
    if n != 1:
        new_html, n = PATTERN_ARTICLE.subn(lambda m: m.group(1) + figure, html, count=1)
    if n != 1:
        print(f"WARN: {path} no insertion point matched")
        continue
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_html)
    print(f"OK: {path}")

print("\nDone")
