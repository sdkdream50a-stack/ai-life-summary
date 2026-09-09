# S3-P0 — PRODUCT PORTFOLIO ACTUALS

> 2026-09-09 · **CODE CHANGE 0 / ROUTE CHANGE 0 / 301 0 / NOINDEX 0 / COPY 0 / DEPLOY 0**
> production/main `8312aaaa1f1a42dbcf3b5a08b5be7ce9fb4e9665`
> `S3_G0_RESULT_SHARE_VIRAL_AUDIT.md`는 **재실행하지 않고 재사용**. 폐기된 오탐 3건 복원 없음.

---

## 0. 이 문서가 뒤집는 것

이번 세션의 목적은 GA4로 winner/loser를 재분류하는 것이었다.
**GA4는 열지 못했고, 대신 GSC에서 훨씬 중대한 사실이 나왔다.**

> **2026-07-20 주에 SmartAItest 검색 노출이 −90% 붕괴했고, 그 뒤로 회복되지 않았다.**
> 지금까지 모든 판단의 근거였던 “90일 클릭 638건 · Compatibility 88.7%”는
> **대부분 붕괴 이전 기간의 잔상**이다.

---

## 1. 붕괴의 실측 (GSC, CONFIDENCE = HIGH)

```
SOURCE  GSC searchAnalytics/query · sc-domain:smartaitest.com
AUTH    ADC(user, webmasters scope) + x-goog-user-project 헤더  ※ gcloud 설정 무변경
DATA FRONTIER  2026-09-06   ← 오늘(09-09) 기준 GSC 최신 확정일
```

### 주간 추이
| week | clicks | impressions | CTR | pos |
|---|---:|---:|---:|---:|
| 2026-06-22 | 125 | 1,320 | 9.5% | 10.7 |
| 2026-07-06 | 99 | 1,211 | 8.2% | 11.6 |
| **2026-07-13** | **102** | **1,272** | 8.0% | 14.1 |
| **2026-07-20** | **24** | **139** | 17.3% | 8.8 | ← **−89% 노출** |
| 2026-08-03 | 25 | 127 | 19.7% | 8.6 |
| 2026-08-24 | 6 | 45 | 13.3% | 22.3 |
| 2026-08-31 | 10 | 48 | 20.8% | 8.6 |

CTR이 **오르고** 순위가 **좋아진** 채로 노출만 사라졌다 = 광범위 롱테일을 잃고 소수 고의도 질의만 남은 형태.

### 어디를 잃었나 (PRE 06-15~07-19 vs POST 07-20~09-06)
| 축 | PRE | POST | 변화 |
|---|---:|---:|---:|
| 전체 impressions | 5,988 | 617 | **−90%** |
| distinct queries | 266 | 46 | −83% |
| distinct pages | 89 | 25 | −72% |
| `/ko/compatibility/` | 2,230 | 31 | **−98.6%** |
| `/ja/compatibility/` | 695 | 164 | −76% |
| `/en/compatibility/` | 958 | 303 | −68% |
| country `kor` | 2,820 | 95 | **−96.6%** |
| country `jpn` | 982 | 171 | −82.6% |
| `궁합 테스트` | 482 | 5 | −99% |
| `연인 궁합 테스트` | 268 | 0 | −100% |
| `ai compatibility test` | 51 | 51 | **0% (유지)** |

한국어 head term이 통째로 증발했고, 영어 exact-match 질의만 살아남았다.

---

## 2. 원인 — 색인 사고가 아니라 **의도된 프루닝의 부작용**

### 2-1. 색인 문제가 아니다 (URL Inspection API 실측)
`/ko/compatibility/` `/ja/compatibility/` `/en/compatibility/` `/ko/` `/ko/personality-type/`
→ 전부 `verdict=PASS · coverageState=제출되고 색인이 생성되었습니다 · robotsTxtState=ALLOWED · INDEXING_ALLOWED · pageFetchState=SUCCESSFUL`, 최근 크롤 2026-09-06.

### 2-2. Google 전역 사건도 아니다 (대조군)
같은 계정·같은 기간 impressions/주 변화:
```
smartaitest   −90%
fateaiverse   +66%      ← 같은 소유자, 같은 시기, 반대 방향
silmu.kr      −26% (표본 극소)
```
→ **사이트 특이적**.

### 2-3. 시점이 일치하는 사이트 변경이 실재한다
| 날짜 | 커밋 | 내용 | sitemap `<loc>` |
|---|---|---|---:|
| 2026-07-11 | `9c131c9` | AdSense Phase B 아티클 | **181** |
| **2026-07-14** | **`46e7b69`** | **thin result 페이지 noindex + 사이트맵 제외** | **83 (−54%)** |
| 2026-07-17 | `5d119f8` / `47fa5a3` | sitemap lastmod·로케일 재생성 | 77 → 104 |
| **2026-07-21** | **`5b68ba9`** | **얇은 툴 랜딩 5종 noindex + 사이트맵 제외** | **83** |
| 오늘 | `1036135` | — | **76** |

**사이트맵이 181 → 83으로 반토막 난 다음 주에 GSC 노출이 −90%가 됐다.** 재처리 지연을 감안하면 인과 시점이 정확히 맞는다.

### 2-4. 현재 색인 정책 (production 실측)
| slug | ko | ja | en |
|---|---|---|---|
| personality-type | index | index | index |
| compatibility | index | index | index |
| age-calculator | index | index | index |
| life-summary · vibe-check · kpop-match · love-type · work-style · communication-style · friend-compatibility · marriage-compatibility | **noindex** | **noindex** | **noindex** |

**11개 중 8개가 noindex.** 사이트맵에도 personality-type/compatibility/age-calculator만 존재(각 35 entry, 총 76).

> ⚠️ **측정 오류 정정:** 최초 점검에서 “모든 랜딩이 noindex”로 나왔으나 이는 제 셸 검사 버그였다(`grep -c ... || echo 0`이 0매치에서 `0\n0`을 만들어 전부 참으로 평가). production 서빙 HTML로 재확인한 위 표가 정본이다. compatibility·personality는 **정상 색인 대상**이다.

### 2-5. 그러나 프루닝만으로는 다 설명되지 않는다
noindex 처리된 8개는 원래 트래픽이 0에 가깝다(love-type 90d 0 clicks/48 impr).
**그런데 프루닝 대상이 아니었던 `/ko/compatibility/`가 −98.6%로 가장 크게 무너졌다.**
→ 의도된 손실 + **설명되지 않는 잔여 손실**이 함께 있다. 후자가 진짜 조사 대상이다.
가설(미검증): 사이트맵 URL 54% 제거로 인한 크롤/신뢰 신호 축소, 또는 사이트 레벨 품질 평가 변화.

---

## 3. POST-TRUTH SEARCH (§11) — 판정

```
POST_TRUTH_START = 2026-09-08  (S2 c7537c5 · pre-S3 de2e52b 배포일)
GSC DATA FRONTIER = 2026-09-06
사용 가능한 post-truth 일수 = 0

SEARCH_REGRESSION (Truth cleanup 기인) = TOO_EARLY
```

**Truth cleanup을 되돌릴 근거는 전혀 없다.** 데이터가 아예 존재하지 않는다.
그리고 §1에서 “Truth 정정이 SEO를 해쳤을 수 있다”고 걱정했던 붕괴는 **7주 전에 이미 일어난 별개 사건**이다. 두 사건을 혼동하면 잘못된 롤백을 하게 된다.

---

## 4. GA4 (§4–§7) — 접근 실패, 사람 작업 1건

AI로 시도한 경로와 결과:
| 경로 | 결과 |
|---|---|
| ADC 토큰 | scope = `cloud-platform`, `webmasters` → **analytics 스코프 없음** (403 ACCESS_TOKEN_SCOPE_INSUFFICIENT) |
| gcloud user 토큰 | scope 8종 전부 확인, **analytics 없음** → 403 |
| 서비스 계정 2종 | `ga4-start-reader@silmu-stitch`는 `properties/524141122 (silmu.kr)`만. SmartAItest 속성 없음 |
| Claude Chrome 확장 | `list_connected_browsers` = **빈 배열** (미연결) |
| 실행 중 Chrome CDP 연결 | 포트 9222/9223/9229 **전부 닫힘**, `--remote-debugging-port` 미사용 |
| Chrome 프로필 복사 후 자동화 | **권한 정책이 차단** — 우회 시도하지 않음 |

→ GA4 property 해석(§4)과 SA 권한 부여(§5)를 **AI가 완료할 수 있는 경로가 없다.**
§6 기준 `GOOGLE_REAUTH_REQUIRED`.

따라서 **GA4 의존 지표 전부 UNKNOWN (0 아님)**:
`USERS · SESSIONS · LANDING_VIEWS · TEST_START · START_RATE · TEST_COMPLETE · COMPLETION_RATE · RESULT_VIEW · SHARE_CLICK · SHARE_SUCCESS · SHARE_RATE · NEXT_TEST_RATE · RETURN_7D · RETURN_28D · DEEP_DIVE_IMPRESSION · DEEP_DIVE_CLICK · DEEP_DIVE_CTR`

(이벤트 자체는 S3-G0에서 production 발화가 실측된 것이 8종이다. 계측이 아니라 **권한**의 문제다.)

---

## 5. PRODUCT MATRIX — 현재 확정 가능한 값만

DEMAND는 **붕괴 이후 창(2026-07-20~09-06, 49일)** 기준으로 다시 계산한다. 90일 값은 붕괴 전 잔상이므로 의사결정에 쓰지 않는다.

| PRODUCT | INDEXABLE | POST-COLLAPSE impr | clicks | GA4 축 | 판정 |
|---|---|---:|---:|---|---|
| **compatibility** | ✅ | 498 (ko31+ja164+en303) | 100 | UNKNOWN | **SCALE** (여전히 유일한 유입원) |
| **personality-type** | ✅ | 16 | 0 | UNKNOWN | **INVEST** (제품 61/100, 유입 0) |
| **age-calculator** | ✅ | 3 | 0 | UNKNOWN | **FIX** (index 대상인데 노출 3) |
| life-summary | ❌ noindex | 0 | 0 | UNKNOWN | **HOLD** (검색 판정 불가 — 의도적 배제) |
| vibe-check | ❌ noindex | 0 | 0 | UNKNOWN | **HOLD** |
| kpop-match | ❌ noindex | 0 | 0 | UNKNOWN | **HOLD** |
| love-type | ❌ noindex | 0 | 0 | UNKNOWN | **HOLD** |
| work-style | ❌ noindex | 0 | 0 | UNKNOWN | **HOLD** |
| communication-style | ❌ noindex | 0 | 0 | UNKNOWN | **HOLD** |
| friend-compatibility | ❌ noindex | 0 | 0 | UNKNOWN | **HOLD** |
| marriage-compatibility | ❌ noindex | 0 | 0 | UNKNOWN | **HOLD** |

> **중요:** noindex 8종의 “검색 수요 0”은 **성과가 아니라 정책의 결과**다. 이 숫자로 SUNSET/MERGE를 판정하는 것은 순환논증이다. §18 sample guard와 무관하게 **판정 불가**로 둔다.

```
SUNSET = 0건   MERGE 확정 = 0건 (기존 4건 후보는 근거 부족으로 보류)
```

---

## 6. 진단

```
PERSONALITY_DIAGNOSIS   = DISTRIBUTION_PROBLEM (확정)  + INSUFFICIENT_DATA (그 외 축)
  근거: index 허용 상태인데 붕괴 후 49일 impressions 16 / clicks 0.
        제품 품질은 S3-G0에서 61/100로 Compatibility(55)보다 높다.
        activation/completion/share/retention은 GA4 없이는 판정 불가.

COMPATIBILITY_DIAGNOSIS = SEARCH_WINNER = YES (단, 붕괴 후 규모는 이전의 1/10)
                          PRODUCT_WINNER = UNKNOWN (GA4 필요)
  근거: 붕괴 후에도 사이트 클릭의 사실상 전부를 담당.
        그러나 ko 시장은 −98.6%로 실질 소멸, 현재는 en/ja가 지탱.
```

---

## 7. 남은 측정 공백

| 공백 | 성격 | 해소 방법 |
|---|---|---|
| GA4 전 축 | **권한** | 사람 작업 1건 (아래) |
| `share_success` copy 외 채널 | 계측 | S3-1B |
| `share_entry` / `result_id` | 계측 | S3-1A |
| 붕괴의 잔여 원인(프루닝으로 설명 안 되는 부분) | 조사 | 별도 SEO lane |
| post-Truth 검색 영향 | 시간 | 09-09 이후 주간 추적 |


---

## 4-B. GA4 PROPERTY FORENSICS (2026-09-09 후속) — §4 판정 정정

이전 §4의 `GA4_ACCESS = BLOCKED`는 **원인을 잘못 지목했다.** 정정한다.

```
정정 전: GA4_ACCESS = BLOCKED            (권한 문제로 단정)
정정 후: GA4_PROPERTY_STATE = E          MEASUREMENT_ID_LIVE_BUT_PROPERTY_OWNER_UNKNOWN
```

### 확정된 사실

| 항목 | 결과 | 근거 |
|---|---|---|
| 측정 ID 실재성 | **LIVE** | `gtag/js?id=G-QDH2KJQT9Y` = 520,460 B, 자기 ID 2회 echo. 알려진 정상 ID(FateAIverse G-7XQ72JT0X3, 519,654 B/2회)와 동일 서명. 오타 ID·가짜 ID는 **둘 다 동일한 427,807 B generic** 응답 → 서버측 속성 설정이 존재한다는 뜻 |
| production 태그 | **YES** | 동의 후 `googletagmanager.com/gtag/js?id=G-QDH2KJQT9Y` 로드 |
| production 수집 | **YES** | `analytics.google.com/g/collect` **POST**, `tid=G-QDH2KJQT9Y` |
| GA4_DELIVERY | **WORKING** | dataLayer(11 entries) + network 양쪽 확인 — §3의 "dataLayer만 살아있고 collect 0" 케이스 아님 |
| 동의 게이팅 | 정상 | 동의 전 gtag 스크립트 0 · 네트워크 0 |

### provenance
```
FIRST_COMMIT  b093739  2026-01-18  성대권  "feat: add Google Analytics 4 tracking to all pages"
CONFIG_SOURCE js/consent-manager.js:253,262  (하드코딩 단일 출처, 런타임 주입)
이력상 측정 ID  G-QDH2KJQT9Y 단 1개 (714회, 다른 G- ID 전무)
NUMERIC_PROPERTY_ID  저장소·문서·과거 task 어디에도 기록 없음
```

**핵심 정황:** 태그 도입(2026-01-18)은 **도메인 이전(`5264fce`, 2026-01-20, goodpicknow.com → smartaitest.com) 이전**이다.
→ GA4 속성이 **옛 브랜드 이름으로 생성**됐을 가능성이 높다. 사용자가 GA4 UI에서 "SmartAItest"를 찾으면 보이지 않는 것이 자연스럽다.
→ 보강 근거: 같은 Google 로그인이 GSC에서 `https://goodpicknow.com/`를 **siteOwner**로 여전히 보유.

### AI가 시도해 막힌 경로 (§4 실행 불가 사유)
| 경로 | 결과 |
|---|---|
| GA4 Admin/Data API | ADC·gcloud 토큰 모두 `analytics` 스코프 없음 → 403 |
| 서비스 계정 2종 | `properties/524141122 (silmu.kr)`만 접근 가능 |
| Claude Chrome 확장 | `list_connected_browsers` = 빈 배열 |
| 실행 중 Chrome CDP | 9222/9223/9229 전부 closed |
| Chrome 프로필 자동화 | 권한 정책 차단 — 우회하지 않음 |

### 결론
```
HISTORICAL_DATA_RECOVERABLE = YES (가능성 높음)
  측정 ID가 살아 있고 2026-01-18부터 수집 중 → 약 8개월치 데이터가 축적돼 있을 것

NEW_GA4_REQUIRED = NO
  새 속성을 만들면 그 8개월을 버리게 된다. §10대로 production 측정 ID를 교체하지 않았다.
```
