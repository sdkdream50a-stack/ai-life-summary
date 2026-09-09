# CHECKPOINT — S3-P0 / GA4 FORENSICS (pre-clear)

> 2026-09-09 · 세션 클리어 직전 상태 봉인
> **CODE CHANGE 0 · S3 IMPLEMENTATION 0 · SEO 0 · ROUTE 0 · NOINDEX 0 · GA4 0 · DEPLOY 0**
> 이 문서는 checkpoint다. 기존 문서를 파괴적으로 재작성하지 않았다.

---

## 1. CANONICAL PRODUCTION (실제 명령으로 확인, 추정 아님)

```
PROJECT            SmartAItest  (/Users/seong/project/smartaitest)
production/main    8312aaaa1f1a42dbcf3b5a08b5be7ce9fb4e9665   ← origin/main 실측 일치
로컬 브랜치         pre-s3-hardening @ 1036135c015e9b2e9a90a1b15a1d0fcf57641e09
                   (= main의 조상. PR #4로 병합 완료된 상태이며 추가 작업 없음)
worktree           tracked 수정 0
untracked          docs/smartaitest-v2/CHECKPOINT_SMART_S2_DONE_PRE_CLEAR_20260908.md
                   docs/smartaitest-v3/  (아래 문서들)

S2                          PRODUCTION VERIFIED
PRE-S3 HARDENING            PRODUCTION VERIFIED
S3-G0                       DONE
S3-P0 PORTFOLIO ACTUALS     DONE
S3 구현                      NOT STARTED
```

### 다음 세션 첫 동작 — re-anchor
```
git status --short --branch
git rev-parse HEAD
git fetch origin && git rev-parse origin/main     # 기대값 8312aaa…
```
`origin/main`이 8312aaa가 아니면 **수정 금지, drift만 보고하고 STOP.**

---

## 2. CANONICAL DOCUMENTS

| 문서 | 줄수 | git 상태 |
|---|---:|---|
| `docs/smartaitest-v3/S3_G0_RESULT_SHARE_VIRAL_AUDIT.md` | 248 | untracked |
| `docs/smartaitest-v3/S3_P0_PRODUCT_PORTFOLIO_ACTUALS_20260909.md` | 245 | untracked |
| `docs/smartaitest-v3/CHECKPOINT_S3_P0_GA4_FORENSICS_PRE_CLEAR_20260909.md` (본 문서) | — | untracked |
| `multi-agent-harness/docs/portfolio-audit/SMARTAITEST_PRODUCT_MATRIX.md` | 172 | supersede 배너 삽입됨 |

> **관례 불일치 보고(조치 안 함):** 이 repo에서 `docs/smartaitest-v2`는 **10개 파일이 git tracked**인 반면
> `docs/smartaitest-v3`는 **0개(전부 untracked)**다. v3 문서를 canonical로 삼으려면 추적이 필요할 수 있으나,
> 이번 세션 지시대로 **commit/push하지 않았다.** 다음 세션에서 사용자 판단.

---

## 3. GSC — 검색 붕괴 (CONFIRMED)

```
SOURCE  GSC searchAnalytics/query · sc-domain:smartaitest.com
AUTH    ADC(user, webmasters scope) + 요청 헤더 x-goog-user-project: silmu-stitch
        ※ gcloud 로컬 설정은 변경하지 않았다 (헤더로만 quota project 지정)
DATA FRONTIER  2026-09-06
```

### 주간
| week | clicks | impressions |
|---|---:|---:|
| 2026-07-13 | 102 | 1,272 |
| **2026-07-20** | **24** | **139** |
| 2026-08-31 | 10 | 48 |

### 구간 비교
| 축 | PRE 06-15~07-19 | POST 07-20~09-06 |
|---|---:|---:|
| impressions | 5,988 | **617 (−90%)** |
| distinct queries | 266 | 46 |
| `/ko/compatibility/` | 2,230 | **31** |
| country `kor` | 2,820 | **95** |
| `ai compatibility test` | 51 | 51 (유지) |

### 판정 — 이 구분을 다음 세션에서 반드시 유지할 것
```
SEARCH_COLLAPSE                    = CONFIRMED
TIMING_CORRELATION_WITH_PRUNING    = STRONG
    46e7b69 (2026-07-14) thin result noindex + sitemap 제외 → sitemap 181 → 83
    5b68ba9 (2026-07-21) 얇은 랜딩 5종 noindex
CAUSALITY                          = UNPROVEN
```
보조 사실: 색인 사고 아님(URL Inspection 5 URL 전부 PASS·최근 크롤). Google 전역 사건 아님(같은 기간 fateaiverse **+66%**).
미해결: 프루닝 대상이 **아니었던** `/ko/compatibility/`가 −98.6%로 가장 크게 하락한 잔여분.

### 자동 실행 금지 (다음 세션 포함)
```
bulk noindex rollback · sitemap 181 복원 · AI modifier 복원 · Truth rollback
```

---

## 4. 제품 잠정 판정

| 제품 | 판정 |
|---|---|
| **compatibility** | **SEARCH WINNER** — 붕괴 이후에도 상대적 winner |
| **personality-type** | **DISTRIBUTION PROBLEM** — S3-G0 품질 61/100 근거 있음. **traffic loser로 취급 금지** |
| **age-calculator / Mental Age** | **FIX candidate** |
| 나머지 noindex 제품 8종 | **HOLD** — "검색 수요 0"은 성과가 아니라 정책의 결과(순환논증 주의) |

```
MERGE confirmed = 0        SUNSET = 0
Mental Age = age-calculator 의 UI alias   (별도 앱 아님)
Soul Type  = life-summary   의 UI alias   (별도 앱 아님)
```

---

## 5. 기존 S3-G0 evidence — 재실행 금지

Personality / Compatibility의 production 완주 감사를 처음부터 다시 하지 않는다.

**폐기된 오탐 3건 — 결함으로 재등장 금지:**
```
"Personality canvas 없음"        → 오탐. 오프스크린 canvas. 1080×1920 / 514,360 B PNG 실제 생성 verified
"4축 50% 고착"                   → 오탐. 4축 pole 비율 5:5라 균일 응답 시 수학적으로 정확히 50%.
                                   편향 응답 주입 시 51/49/90/10로 변함
"analytics caller 없음"          → 오탐. analytics-events.js가 selector 위임으로 자동 바인딩
```

미확인으로 남긴 1건(정직하게 보존): 축 주입 실험에서 응답 반전 시 표시값이 동일했다. sessionStorage 직접 조작이라는 비-사용자 경로여서 결론 내리지 않음 → **실제 퀴즈 경로로 재확인 필요.**

---

## 6. POST-TRUTH SEARCH

```
Truth production 배포   2026-09-08   (S2 c7537c5 · pre-S3 de2e52b)
GSC data frontier      2026-09-06
사용 가능 post-truth 일수 = 0

POST_TRUTH_SEARCH  = NO_DATA
SEARCH_REGRESSION  = TOO_EARLY
```
**Truth cleanup을 7월 검색 붕괴의 원인으로 연결하지 않는다.** 두 사건은 7주 떨어져 있다.

---

## 7. GA4 — measurement ID provenance

```
MEASUREMENT_ID  G-QDH2KJQT9Y
FIRST_SEEN      2026-01-18
COMMIT          b093739  "feat: add Google Analytics 4 tracking to all pages" (성대권)
SOURCE          js/consent-manager.js:253,262  (하드코딩 단일 출처, 런타임 주입)
이력상 측정 ID   G-QDH2KJQT9Y 단 1개 (714회 등장, 다른 G- ID 전무)
```

**도메인 전환:** `goodpicknow.com → smartaitest.com` (`5264fce`, 2026-01-20)
→ 태그 도입이 전환 **이전**이므로 **GA4 속성 이름이 goodpicknow 시절 이름일 가능성**이 있다.
→ 보강 근거: 같은 Google 로그인이 GSC에서 `https://goodpicknow.com/`를 **siteOwner**로 여전히 보유.

---

## 8. GA4 — production network evidence (실측)

| 상태 | 관측 |
|---|---|
| 동의 전 | gtag 스크립트 **0** · 네트워크 요청 **0** (게이팅 정상) |
| 동의 후 | `googletagmanager.com/gtag/js?id=G-QDH2KJQT9Y` **loaded** |
| 동의 후 | `analytics.google.com/g/collect` **POST 관측**, `tid=G-QDH2KJQT9Y` |

```
GA4_TAG_LIVE         = YES
GA4_DELIVERY         = WORKING     ← "dataLayer만 살고 collect 0" 케이스 아님. 양쪽 확인
MEASUREMENT_ID_LIVE  = YES
```

**measurement ID 유효성 판별 근거 (인증 불필요 read-only 테스트):**
| ID | gtag 설정 응답 | 자기 ID echo |
|---|---:|---:|
| G-QDH2KJQT9Y | 520,460 B | 2 |
| G-7XQ72JT0X3 (정상 대조군) | 519,654 B | 2 |
| G-QDH2KJQT9X (한 글자 오타) | 427,807 B | 1 |
| G-ZZZZZZZZZZ (가짜) | 427,807 B | 1 |

가짜 두 개는 **바이트까지 동일한 generic 응답** → SmartAItest ID만 서버측 속성 설정을 받는다.

---

## 9. PROPERTY STATE

```
NUMERIC_PROPERTY_ID  = UNKNOWN
PROPERTY_OWNER       = UNKNOWN
PROPERTY_STATE       = MEASUREMENT_ID_LIVE_BUT_PROPERTY_OWNER_UNKNOWN   (§7 분류 E)

기존 SmartAItest GA4 API query 이력 = NOT FOUND
    (전체 task/문서 검색 결과 properties/524141122 = silmu.kr 만 4회 등장)
서비스 계정 2종      = silmu.kr property 만 접근 가능
ADC / gcloud 토큰    = analytics 스코프 없음 (403 ACCESS_TOKEN_SCOPE_INSUFFICIENT)

HISTORICAL_DATA_EXISTENCE        = LIKELY        (2026-01-18부터 수집 중 → 약 8개월치 추정)
HISTORICAL_DATA_API_RECOVERABILITY = UNVERIFIED  ← "YES 확정"으로 과장하지 말 것
```

gtag 응답 내 9자리 숫자들은 **GTM 내부 플래그 ID**이며 GA4 numeric property id가 아님을 확인했다.

---

## 10. NEW GA4 LOCK

```
NEW_GA4_REQUIRED = NO

금지: 새 GA4 property 생성 · 새 measurement id 생성 · production id 교체
이유: 기존 약 8개월 수집 history를 먼저 회수해야 한다.
현재 상태: js/consent-manager.js 의 G-QDH2KJQT9Y 참조 2건 — 손대지 않았다 (js/ diff vs origin/main = 0)
```

---

## 11. NEXT EXACT TASK (새 세션에서만)

```
1. GA4 account/property owner discovery
2. numeric property id 확인
3. 기존 property access 확보 (뷰어 권한)
4. Data API 7d / 28d / 90d 실데이터
5. SmartAI product matrix actual funnel 채우기
6. S3-1 A/B/C 최종 결정
```

현 시점 잠정 권고(데이터로 뒤집힐 수 있음): **S3-1C(Shared-entry / Return Loop 공통화)**.
근거 — S3-G0에서 공유 링크 재진입 DEAD가 실측 확정, 검색 유입이 1/10이 된 상황에서 공유·재방문이 남은 성장 경로, 그리고 `result_id`/`share_entry`가 있어야 A와 B를 비교할 측정이 성립한다.

---

## 12. AI-FIRST RULE (다음 세션에도 적용)

Claude / Codex / browser / API로 가능한 작업을 **먼저 전부 수행**한다. 사용자에게 먼저 수동작업을 넘기지 않는다.
사람만 가능한 경우에만 최소 1동작 요청: `password · 2FA · passkey · Google re-auth · Claude Chrome extension reconnect`.

---

## 13. CURRENT HUMAN BLOCKER (이번 세션 실측)

```
Claude Chrome extension     DISCONNECTED  (list_connected_browsers = [])
CDP                         unavailable   (9222/9223/9229 전부 closed, --remote-debugging-port 미사용)
Chrome profile automation   policy blocked (우회 시도하지 않음)
GA4 Admin/Data API          analytics 스코프 없음
```

다음 세션에서 **브라우저 채널이 여전히 닫혀 있을 때만**:
```
USER_ACTION_REQUIRED = Reconnect Claude Chrome extension
```
→ 재연결되면 계정 탐색·속성 확인·권한 추가·Data API까지 **AI가 전부 수행**한다.
**사용자에게 GA4 속성을 직접 찾으라고 먼저 시키지 않는다.**

---

## 14. DO NOT START

```
S3-1A · S3-1B · S3-1C · shared-entry implementation · route merge
feature delete · noindex changes · SEO recovery · Truth rollback
GA4 replacement · new GA4 · deploy
```

---

## 15. 이번 세션이 지킨 것

```
CODE CHANGE 0 · ROUTE 0 · 301 0 · NOINDEX 0 · COPY 0 · GA4 0 · DEPLOY 0
commit 0 · push 0
FateAIverse repo/code/analytics/payment/SEO 수정 0 (읽기 전용 대조 1회만)
gcloud 로컬 설정 무변경
production measurement ID 무변경
```
