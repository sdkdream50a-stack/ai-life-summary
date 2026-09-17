# CHECKPOINT — TELEMETRY REPAIR / PRODUCTION VERIFIED

> 2026-09-09 · PR #5 merge + production deploy + live verification 완료
> **S3 IMPLEMENTATION 0 · SEO 0 · NOINDEX 0 · ROUTE 0 · MEASUREMENT ID 변경 0**
> 이 문서는 checkpoint다. 기존 문서를 파괴적으로 재작성하지 않았다.

---

## 1. PRODUCTION SHA 이동

```
previous production   8312aaaa1f1a42dbcf3b5a08b5be7ce9fb4e9665
new production        8b7231dff269c19fb7df804cb58eac6ffbd3eca9
PR                    #5
merge SHA             8b7231dff269c19fb7df804cb58eac6ffbd3eca9   (merge commit)
merged at             2026-09-09T02:25:04Z
branch                fix/smartaitest-ga4-consent-ordering-0909 @ 7427427
```

merge 방식은 repo canonical(`Merge pull request #N from …`)을 따랐다.
force push · reset --hard · history rewrite = 0.

---

## 2. DEPLOY METHOD — 이전 UNKNOWN 항목 해소

```
DEPLOY_METHOD    Cloudflare Workers Builds (자동, main merge 트리거)
DEPLOY_RUN       check-runs on 8b7231d
                 build                          success
                 deploy                         success
                 Workers Builds: ai-life-summary success
                 report-build-status            success
DEPLOY_STATUS    SUCCESS
PRODUCTION_SHA   8b7231d  (= merge SHA, 기대값 일치)
```

> **v2 문서의 미해결 항목이 이번에 실측으로 해소됐다.**
> `docs/smartaitest-v2`는 "main merge 시 자동 프로덕션 배포 여부 = UNKNOWN, 사용자 확인 필요"로 남겨 두었으나,
> 이번 merge에서 **자동 배포가 실제로 트리거되어 성공**했다. 수동 `wrangler deploy`는 실행하지 않았다(중복 배포 금지).
> `.github/workflows/`는 여전히 부재하며, CI는 GitHub Actions가 아니라 Cloudflare 쪽에 있다.

---

## 3. PRODUCTION HTTP / ASSET 검증

로컬 파일이 아니라 실제 HTTP 응답으로 확인했다.

| locale | HTTP | consent-manager | analytics-events |
|---|---|---|---|
| `/ko/` | 200 | `?v=8af1ea9f` | `?v=eda9af38` |
| `/ja/` | 200 | `?v=8af1ea9f` | `?v=eda9af38` |
| `/en/` | 200 | `?v=8af1ea9f` | `?v=eda9af38` |

배포 전 production은 `consent-manager.js?v=b8a8bbf4` / `analytics-events.js?v=bd7b4f55`였다.

URL 해시뿐 아니라 **실제 전송된 JS 본문**에 수정이 들어 있는지 확인했다:

```
dispatchConsentUpdated 정의            present
gaScript.onload 내부 dispatch          present
gaScript.onerror fallback              present
analytics-events window.gaLoaded gate  present
flushQueue()                           present
served measurement id                  G-QDH2KJQT9Y   (변경 없음)
```

---

## 4. ROOT CAUSE (production 확정)

배포 전 GA4 property `520476586`에서 canonical on-load 이벤트가 **모든 window에서 0**이었다.

```
home_view · result_view · test_complete · article_view   = 0
share_click · deep_dive_impression · consent_granted     = 정상
```

원인은 **두 개**였고, 둘 다 같은 pre-config 구간으로 이벤트를 흘려보내고 있었다.

**(1) fresh consent** — `applyConsent()`가 GA4 스크립트를 async로 append한 직후,
다음 줄에서 `consentUpdated`를 **동기 dispatch**했다. 큐에 있던 이벤트가
`gtag('config', 'G-QDH2KJQT9Y')` 실행 전에 dataLayer로 replay되고,
GA4는 property가 설정되지 않은 상태로 도착한 이벤트를 버린다.
`consent_granted`가 186인데 이들이 0이었던 이유가 이것이다 —
`consent_granted`는 `onload` **안에서** config 이후에 발생한다.

**(2) returning visitor** — 저장된 consent가 있으면 이벤트가 **큐에 들어가지도 않았다.**
`track()`이 `typeof gtag !== 'undefined'`로 게이팅했는데, `gtag`는
`consent-manager.js` 첫 줄의 Consent Mode shim이라 GA4보다 훨씬 먼저 truthy다.
→ dispatch 순서만 고쳤다면 재방문 경로는 그대로 깨져 있었을 것이다.

---

## 5. LIVE PRODUCTION 검증 — 실제 브라우저

로컬 guard가 아니라 production 사이트에서 직접 확인했다.

### A. FRESH CONSENT = PASS
```
consent 전     gaLoaded=false · dataLayer 전송 0 · GA collect 0
               queue = ["page_view","home_view"]   ← 유실 아님, 보류됨
Accept 후 순서 consent ×3 → event:consent_accepted → js
               → config:G-QDH2KJQT9Y   (index 5)
               → consent_granted → page_view
               → event:home_view       (index 8)   ← config 이후
home_view = 1 · pending 잔여 0
```

### B. RETURNING CONSENT = PASS  (두 번째 root cause)
```
저장된 consent 유지 → 새 page load
순서   consent ×3 → js → config:G-QDH2KJQT9Y (index 4)
       → consent_granted → page_view → event:home_view (index 7)
home_view = 1 · pre-config 전송 0 · pending 잔여 0
```

### C. REJECT = PASS
```
gaLoaded=false · googletagmanager script tag 0 · clarityLoaded=false
canonical 전송 0 · dataLayer event 0 · /g/collect 0
queue ["page_view","home_view"] 보류만 되고 유출 0
localStorage 저장됨(analytics:false) · reload 후에도 동일하게 0
```

> 검증 과정 주의: 최초 reject 관측에서 `localStorage`가 `null`로 보였으나,
> 이는 **테스트 시퀀스가 겹친 아티팩트**였고 clean re-test에서 정상 저장을 확인했다.
> reject 핸들러의 `saveConsent()`는 이번 변경이 건드리지 않았다(diff hunk = 217/247/268 뿐).
> **제품 결함 아님.**

### D. 실제 QUIZ 완주 (compatibility, 사용자 경로)
sessionStorage 직접 조작 없이 실제 라디오 클릭 16문항 + 제출 버튼으로 완주했다.

```
landing  /ko/compatibility/          실제 마우스 클릭 → test_start = 1
result   /ko/compatibility/result/   실제 네비게이션 도달
         config(5) → consent_granted → page_view
         → test_completed(legacy) → result_view(9) → test_complete(10)
result_view = 1 · test_complete = 1 · duplicate 0 · pending 0
test_type 파라미터 = "compatibility"  (result_view · test_complete 양쪽)
```

### E. ARTICLE
```
/blog/erikson-psychosocial-stages           article_view = 1 (fresh consent 경로)
/blog/ja/zodiac-vs-ai-compatibility.html    article_view = 1
```

---

## 6. GA4 REALTIME 도착 증명

권한 목록이 아니라 실제 도착으로 판정했다. property `520476586` Realtime(최근 30분):

```
home_view              3      ← 배포 전 모든 window에서 0
result_view            3      ← 배포 전 0
test_complete          3      ← 배포 전 0
article_view           3      ← 배포 전 0
share_click            1      ← 회귀 없음
deep_dive_impression   1      ← 회귀 없음
test_start             1
page_view 20 · consent_granted 10
```

```
GA4_REALTIME      PASS
DATA_API_STATUS   DATA_API_PENDING
```
> Data API의 `today` 범위에는 canonical 이벤트가 아직 보이지 않는다. **GA4 처리 지연이며 실패가 아니다.**
> network 전송 + Realtime 도착을 production proof로 사용했다. 0을 failure로 단정하지 않았다.

> `/g/collect` 응답이 **503**으로 관측됐으나, 같은 이벤트가 Realtime에 정상 도착했다.
> 즉 전송 실패가 아니라 상태코드 관측 아티팩트다. 배달은 GA4 수신으로 확정했다.

---

## 7. 회귀 점검

```
share_click            정상 (test_type=compatibility)   REGRESSION 0
deep_dive_impression   정상                              REGRESSION 0
consent 정책            변경 0 (동의 없이 analytics 로드 0, 거부 후 전송 0)
banner 동작             변경 0
measurement ID          G-QDH2KJQT9Y 변경 0
SEO / noindex / route   변경 0
Truth rollback          0
locale                  ko·ja·en 200, 자산 동일 버전
FateAIverse             repo·property·production 변경 0 (deep-dive 링크는 클릭하지 않고 impression만 확인)
```

`npm run verify` = GREEN (adsense-boundary · asset-version · s1-guards · s2-home · pre-s3-hardening · telemetry-consent).

---

## 8. REGRESSION GUARD

`scripts/check-telemetry-consent.js` (8 guards, `npm run verify`에 연결).
두 실제 파일을 시뮬레이션 브라우저에서 실행해 consent 경로를 구동한다 — 문자열 매칭이 아니다.

| mutation | 결과 |
|---|---|
| `consentUpdated`를 config 앞으로 이동 | RED |
| config 이후 replay 제거 | RED |
| pre-config 전송 게이트 제거 | RED |
| `track()`의 consent 게이트 제거 | RED |
| `once()` dedupe 파괴 | RED |

> **정직한 기록:** `flushQueue()` 내부의 consent 재확인만 제거하는 mutation은 RED가 되지 않는다.
> `flushQueue()`가 다시 `track()`을 호출하고 `track()`이 consent를 재확인하기 때문이다.
> 해당 검사는 중복 방어이며, **실제 강제 지점은 `track()`**이고 그 mutation은 RED다.

---

## 9. TEST_TYPE CUSTOM DIMENSION

```
property        520476586
dimension       properties/520476586/customDimensions/15743710323
display         Test type
parameter       test_type
scope           EVENT
REGISTERED_AT   2026-09-09 10:49 KST
등록 전 개수     0  (중복 생성 없음, 현재 총 1개)
전송 확인        result_view / test_complete payload에 test_type="compatibility" 실측
```

```
HISTORICAL_RETROACTIVE = NO
```
> **소급 안 된다.** 등록 시각 이전 데이터는 이 dimension으로 복원되지 않는다.
> 과거 product split은 계속 `pagePath` 기반이며, `test_type`은 **이후 수집분부터** 유효하다.
> 이번에 추가한 dimension은 `test_type` 하나뿐이다(locale·share_method·result_id·campaign 미생성).

---

## 10. 남은 GA4 한계

```
canonical funnel 계측 시작   2026-09-08 (a4a04bd) — 실제 배달은 2026-09-09부터
28d / 90d canonical 이력      존재하지 않음. UNKNOWN으로 다뤄야 하며 0으로 추정 금지
product split (과거)          pagePath 기반만 유효
test_type 기반 split          2026-09-09 10:49 KST 이후 수집분부터
```

배포 전 실측 baseline(참고, pagePath 기반):

| product | 90d landing→result | 판정 |
|---|---|---|
| compatibility | 191 → 155 (81%) | SEARCH/CONVERSION WINNER |
| age-calculator | 111 → 1 (0.9%) | FIX — result 라우트는 존재하고 `window.location.href`로 이동하므로 아키텍처 아님 |
| personality-type | 41 → 12 (29%) | DISTRIBUTION |
| life-summary | 35 → 7 (20%) | HOLD |
| 나머지 7종 | `/result/` 라우트 자체가 없음 | **UNKNOWN** (0 아님) |

`RETURN`: 90d 신규 170 vs 재방문 12(세션 30).

---

## 11. GSC — 변동 없음

```
GSC_FRONTIER         2026-09-06   (전 세션과 동일, 진행 없음)
Truth production     2026-09-08
사용 가능 post-truth  0일
POST_TRUTH_SEARCH    NO_DATA
SEARCH_COLLAPSE      CONFIRMED
CAUSALITY            UNPROVEN     ← 이 구분 유지
```

자동 실행 금지(유지): bulk noindex rollback · sitemap 181 복원 · AI modifier 복원 · Truth rollback.

---

## 12. 관례 불일치 / 미조치 보고

- `docs/smartaitest-v2`는 git tracked 10개, `docs/smartaitest-v3`는 **전부 untracked**다.
  이번에도 v3 정책을 그대로 따라 **commit하지 않았다**(`git add -A` 미사용). 추적 여부는 사용자 판단.
- `build:all`이 `build:sitemap`을 `build:asset-version`보다 **먼저** 실행한다.
  그래서 verify를 두 번 돌리면 캐시버스터 mtime 때문에 모든 `lastmod`가 당일로 밀린다.
  `1036135`가 lastmod를 실제 최종 변경일로 교정한 직후이므로 **의도적으로 되돌렸다**(커밋에 미포함).
  기존 순서 결함이며 이번 범위 밖 — 미조치.

---

## 13. DO NOT START (유지)

```
S3-1A · S3-1B · S3-1C · shared-entry implementation · result/share redesign
route merge · feature removal · SEO recovery · noindex rollback · Truth rollback
새 GA4 property · measurement id 교체
```

---

## 14. NEXT

```
NEXT_RECOMMENDED_STEP = OBSERVATION WINDOW / POST-FIX ACTUALS
```

이제 처음으로 `result_view` · `test_complete`가 실제로 수집된다.
S3-1 A/B/C 비교는 이 데이터가 쌓인 뒤에야 성립한다. 관측 창을 먼저 확보한 후 재판정할 것.
