# SmartAITest Release 1 — Product Rebase (2026-09-17)

> 사용자 결정: 기존 버전 실험을 닫고 제품을 개선한 뒤, 검증된 개선 버전을 새 Control 로 삼는다.
> 운영 기록(harness) = `multi-agent-harness/tasks/smartaitest-product-rebase-0917/`

## 1. PRE-REBASE 실험 종료 (실패 판정 아님)

```text
PRE_REBASE_EXPERIMENT_STATUS = CLOSED
PRE_REBASE_VERDICT           = NO_VERDICT
CLOSE_REASON                 = PRODUCT_REBASE
HISTORICAL_DATA              = PRESERVED
```

| experiment | 시작 | 종료 시 관측 |
|---|---|---|
| P1 ko compat birthdate fast path (`docs/smartaitest-v3/P1_KO_COMPAT_FASTPATH_EXPERIMENT_20260910.md`) | 2026-09-09T21:56Z | GSC KO 노출 floor · compat_fast_impression 11 · complete 6 (누계) · §9 freeze(~10-08)는 rebase 로 해제 |
| E1 compatibility result CTA position (PR #11) | 2026-09-13T06:13Z | result-page GA4 이벤트 0 · FateAIverse 도착 3(compatibility_result 0) → 분모 0 |

PRE_REBASE_VERSION = `7aade6d` · PRE_REBASE_PERIOD = 2026-06-01 .. Release 1 배포 직전 ·
PRE_REBASE_LIMITATIONS = 표본 극소(일 세션 1~60) · 09-08~10 QA 트래픽 혼입 · 레거시 중복 이벤트(page_view/test_completed/share_clicked) 포함 ·
VERDICT = NO_VERDICT_PRODUCT_REBASE. 이 기간 데이터는 새 baseline 데이터와 섞지 않는다.

## 2. Release 1 변경

| 영역 | 변경 |
|---|---|
| RESULT | 45개 결과 표면에 공통 레일(`js/result-rail.js`): 결과 카드 → 친구에게 보내기 → 다음 테스트 1개(+더 보기) → 관련 글(indexable 글만) → 문맥 Fate bridge → affiliate 슬롯(비활성). 무작위성 목록("더 많은 테스트", "5개 챌린지", Coming Soon, 빈 '광고' 자리) 제거 |
| SHARE | 공통 브랜드 카드(SMART AI TEST · 나는 · 결과 이름 · 한 줄 · 너도 해보기 · smartaitest.com), 이름·생년월일·답변 미포함. 궁합/나이/인생요약은 기존 카드 유지 |
| FATE | relevance: HIGH compatibility·marriage·love-type·life-summary / MEDIUM friend·personality / LOW·NONE 나머지(미노출). locale ko/ja/en 만. 기존 궁합 CTA 유지 + 런타임 `origin_test/origin_surface/origin_locale` |
| HOME | "지금의 나, 어떤 사람일까?" · 제대로 알아보기 / 빠르게 해보기 / 둘이 해보기 |
| TRUST | 가짜 "5만 커플" 3건 제거 · 거짓 affiliate(Netflix 링크 + 제휴 고지) 비활성 · es 블로그 AI 과장 문구 정정 · 블로그 사실 오류 3건 정정(gemini 전수 감사 45편) |
| LOCALE/LINKS | locale 페이지에서 `/vibe-check/` 등 루트 링크(→/en/ 301) 188건 → 로케일 경로 · 결과/정책 페이지 푸터 현지화 · 결과 페이지 영어 meta 정정 · 깨진 링크 8건 |
| ANALYTICS | 레거시 자동 이벤트(page_view 중복·test_started·share_clicked·test_completed) 제거 → canonical 퍼널만 · 인라인 gtagSafe 동의 우회 → AnalyticsEvents.track · 인라인 결과 테스트에 result_view/test_complete · 신규 next_test_impression/next_test_click/related_article_click/share_invite_friend |
| SEO | ko/about hreflang 상호성 · widget noindex · `sitemap.xml.backup` 제거 · URL 변경 0 |
| CSP | Clarity·GA4 regional·AdSense 보조 도메인 허용(기존 차단 결함) |
| 기타 | streak.js undefined 크래시(life-summary 결과, 기존 production 결함) 수리 |
| GUARD | `scripts/check-result-rail.js` (verify 포함, 변이 4/4 검출) |

## 3. 새 실험 순서 (새 Control = Release 1)

EXP1 Result→Next Test · EXP2 Share UX · EXP3 Fate bridge copy/placement · EXP4 AdSense placement · EXP5 Friend Challenge · EXP6 Affiliate pilot · EXP7 Big Five — 한 번에 하나.

## 4. NEW BASELINE

production 검증 후 아래에 기록한다.
