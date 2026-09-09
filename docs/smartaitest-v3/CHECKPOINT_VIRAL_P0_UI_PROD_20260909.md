# CHECKPOINT — VIRAL P0 UI / PRODUCTION VERIFIED

> 2026-09-09 · PR #7 merge + Cloudflare Workers 배포 후 실측 봉인
> **SEO 0 · NOINDEX 0 · SITEMAP 0 · S3 0 · SHARE ASSET 0 · SCORING 0 · ANALYTICS CODE 0**
> 이 문서는 checkpoint다. 기존 문서를 파괴적으로 재작성하지 않았다.

---

## 1. CANONICAL PRODUCTION (실제 명령·HTTP로 확인, 추정 아님)

```
previous production   a4a5ec3a253e8c243be2caa68fc0548a3f704220
new production        44f9c86c2aa18f4d72a055e4ce3fbc78c3a1c4d3   ← origin/main = MERGE_SHA_7

PR                    #7  fix(results): make viral result surfaces immediately readable
branch                fix/smartaitest-viral-p0-ui-0909 @ d7f449c
merge                 merge commit (repo canonical). force push 0 / rebase 0 / history rewrite 0
로컬 브랜치            main @ 44f9c86
worktree              tracked 수정 0
untracked             docs/smartaitest-v3/CHECKPOINT_TELEMETRY_REPAIR_PROD_20260909.md (이전 세션 잔여, 손대지 않음)
```

커밋 3개 (a4a5ec3 → 44f9c86):

```
fc39042  fix(life-summary): show the result on arrival instead of behind a tap gate
33dcf68  fix(age-calculator): take result copy language from the page, not localStorage
d7f449c  test(results): guard the viral result surfaces against the shipped defects
```

변경 파일 20개 — result surface HTML(root 2 + 로케일 10) · `scripts/templates/*-result.html` 2 ·
`css/reveal-animations.css` · `js/age-calculator.js` · `age-calculator/compare.html`(자산 해시만) ·
`scripts/check-viral-result-surfaces.js`(신규) · `scripts/stamp-asset-version.js` · `package.json`.

`sitemap*.xml` · `robots.txt` · `_headers` · `_redirects` · `ads.txt` · share 생성기 **미변경**.
`noindex`/`canonical`/`hreflang`/`og:`/`twitter:` 변경 라인 **0**.

---

## 2. DEPLOY

```
DEPLOY_RUN       Workers Builds: ai-life-summary  (930c8ad0-8bf2-4a95-9ed5-43178472108e)
                 + GH Actions jobs: build / deploy / report-build-status
DEPLOY_STATUS    4/4 completed / success
PRODUCTION_SHA   44f9c86   ( = MERGE_SHA_7 )
수동 중복 배포     없음 (main merge가 자동 트리거)
```

배포 후 payload 실측 (cache-bypass, `Cache-Control: no-cache`):

| 자산 | 확인 |
|---|---|
| `/ko/life-summary/result/` | `floating-bar-safe-space`✓ `result-card-immediate`✓ `loading-stage` 제거✓ |
| `/ko/age-calculator/result/` | `floating-bar-safe-space`✓ `resolveResultLang`✓ `age-calculator.js?v=47939b3b`✓ |
| `/ja/age-calculator/result/`, `/en/life-summary/result/` | 동일 마커 반영✓ |
| `/ja/`, `/en/` | HTTP 200, 변경 대상 아님(마커 0) |
| `/js/age-calculator.js?v=47939b3b` | 200, `resolveResultLang` 포함 |
| `/css/reveal-animations.css` | 200, `.instant-reveal` 3건, `-10vh` 0건 |

---

## 3. PRODUCTION MEASUREMENTS — smartaitest.com 실제 사용자 플로우

Playwright true viewport, ko-KR, 랜딩에서 생년월일 입력 → 질문 위저드 클릭 → result route.

### LIFE_SUMMARY_RESULT = **FIXED**

result route 진입 1.6초 시점, 아무 조작 없이:

| viewport | identity | fake loading | "?" gate | stale hint | scrollY | card top | card visible | title overlap | dup visual overlap |
|---|---|---|---|---|---|---|---|---|---|
| 390x844 | 문릿 울프 ✓ | 0 | 0 | 0 | 0 | 96px | 100% | 0 | 0 |
| 430x932 | 문릿 울프 ✓ | 0 | 0 | 0 | 0 | 96px | 100% | 0 | 0 |
| 1280x900 | 문릿 울프 ✓ | 0 | 0 | 0 | 0 | 96px | 100% | 0 | 0 |

배포 전 프로덕션(a4a5ec3) 대비: 4초 합성 로딩 → 제거, 필수 탭 게이트 → 제거,
탭 후 강제 스크롤 253–307 → 0, 카드 top −137~−160px(클리핑) → +96px, 카드 노출 51–56% → 100%.

### AGE_KO_LOCALE = **FIXED**

| viewport | html lang | 영어 본문 누출 | body padding-bottom |
|---|---|---|---|
| 390x844 | ko | **0** (배포 전 6필드) | 112px |
| 430x932 | ko | **0** | 112px |

근본 원인은 `localStorage` 기반 언어 추론이었다. `/{lang}/` 페이지는 정적 로컬라이즈라 그 키를 쓰지 않아,
검색·공유 링크로 직접 진입한 방문자는 한국어 라벨 아래 영어 본문을 받았다.
`resolveResultLang()`이 문서 자신의 `<html lang>`을 정본으로 삼는다.

`ja`/`zh`/`es`는 여전히 영어다 — `js/age-calculator.js`에 ja/zh/es 설명 데이터가 아예 없는
**별개의 미번역 문제**이며, 이번 변경 전후 출력이 동일함을 baseline worktree로 확인했다. 이번 릴리스 범위 밖.

### FLOATING_SHARE_OVERLAP = **NON_BLOCKING_FIXED_UI** / CONTENT_OCCLUSION = **0**

PR 게이트와 동일 contract: 고정 바가 순간적으로 콘텐츠 위에 뜨는 것은 결함으로 세지 않고,
**모든 스크롤 위치에서 가려지는 행**만 결함으로 집계.

| viewport | 검사 블록 | 그중 인터랙티브 | 영구 가림 블록 | 영구 가림 인터랙티브 | padding-bottom |
|---|---|---|---|---|---|
| 390x844 | 96 | 24 | **0** | **0** | 112px |
| 430x932 | 96 | 24 | **0** | **0** | 112px |

문서 실제 끝(`atBottom=true`) 정지 상태:

```
390x844  마지막 본문 "모든 테스트는 오락 목적으로만 제공됩니다." y664–684   바 밴드 y751–824   가림 []
430x932  마지막 본문 동일                                    y752–772   바 밴드 y839–912   가림 []
```

배포 전에는 같은 문장이 바 밴드 안(390: y776–796)에 갇혀 더 스크롤할 수 없었다.
확보량 112px vs 바 점유 밴드 93px(높이 73 + 하단 오프셋 20).

```
TEXT_OBSCURED                          = NO
CONTENT_UNREADABLE                     = NO
BOTTOM_CONTENT_UNREACHABLE             = NO
INTERACTIVE_ELEMENT_PERMANENTLY_HIDDEN = 0
```

---

## 4. REGRESSION

### 텔레메트리 (GA4 네트워크 캡처, consent 수락, 실제 life-summary 플로우)

```
measurement ID   G-QDH2KJQT9Y   (저장소 설정값과 동일 — 변경 0)
test_start       1
test_complete    1
result_view      1
duplicate        0
```

`analytics-events.js` · `consent-manager.js`는 이번 릴리스 diff에 **없음** → telemetry repair 회귀 0.
같은 캡처에서 `page_view` 4 / `consent_granted` 2 (페이지 로드 2회 기준 각 2회)가 관측됐다.
분석 코드가 이번에 바뀌지 않았으므로 이는 **기존 동작**이며, 이번 릴리스의 회귀가 아니다. 별도 확인 대상으로 남긴다.

### 인접 제품

```
/ko/compatibility/    HTTP 200
/ko/personality-type/ HTTP 200
/personality-type/    HTTP 200
/ko/ /ja/ /en/        HTTP 200

ko/compatibility/index.html      a4a5ec3 → 44f9c86  byte-identical
personality-type/index.html      a4a5ec3 → 44f9c86  byte-identical
→ SEO metadata change 0 · share behavior change 0
```

### SHARE_ASSET_CHANGE = **0**

프로덕션 life-summary result에서 기존 공유 이미지 생성기를 실제 호출:

```
share preview (자동 생성)      data:image/png  1080 x 1080
generateFullResultImage()     1080 x 1080   (디스크 저장 PNG 서명·치수 검증)
generateTeaserImage()         1080 x 1080
```

age result의 공유 배선(`#share-btn`, `#share-btn-mobile`, `shareToKakao/Twitter/Line/...`)은
a4a5ec3 대비 변경 라인 0.

---

## 5. 회귀 방지 가드

`scripts/check-viral-result-surfaces.js` — 7 guards / 12 result surface, `npm run verify`에 연결.
3개는 행위 검증(페이지의 reveal 스크립트와 로케일 resolver를 recording DOM에서 실제 실행).

mutation 판별력 (수정 트리에 각각 적용):

```
L1  탭 게이트로 identity 지연            RED
L2  reveal에서 window.scrollBy 복원      RED
L3  stale "tap the card" hint 복원       RED
A1  currentLang을 localStorage에서 읽음   RED
A1b resolveResultLang가 <html lang> 무시  RED
A2  floating-bar safe space 제거          RED
```

전체 스위트는 결함 빌드 `a4a5ec3`에도 RED, 이 릴리스에서는 mutation 전후 모두 GREEN.

캐시 도달성도 가드에 포함: `/js/*`·`/css/*`는 7일 캐시 + 버전 쿼리 없음.
`age-calculator.js`는 stamping 대상에 추가(구 캐시 사본이면 `resolveResultLang` 미정의로 결과가 아예 안 뜸),
CSS는 stamping 대상이 아니라 렌더 필수 2줄을 `#result-card-immediate`로 페이지에 함께 실었다.

---

## 6. 남은 것 (이번 릴리스에서 시작하지 않음)

```
SHARED_ENTRY_PRIMITIVE        ABSENT      ← 다음 권장 릴리스
share card redesign           NOT STARTED (Life Summary PNG 1건만 검증됨)
Compatibility fast path       NOT STARTED
SEO recovery / noindex        NOT STARTED
S3                            HOLD
age ja/zh/es 설명 데이터        ABSENT (별개 미번역 문제, 이번 릴리스 무관)
소울타입 이모지 중복             카드 이모지 + 캐릭터 초상화가 동일 이모지.
                              겹침은 0으로 해소했으나 중복 자체는 남음 → card system 패스 소관
```

### 다음 세션 첫 동작 — re-anchor

```
git status --short --branch
git rev-parse HEAD
git rev-parse origin/main      # 기대값 44f9c86 (또는 그 이후)
npm run verify
```
