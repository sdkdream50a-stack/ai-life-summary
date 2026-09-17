# P1 — KO COMPATIBILITY BIRTHDATE FAST PATH · SEARCH EXPERIMENT CONTRACT

> 2026-09-10 · branch `exp/ko-compat-birthdate-fastpath-0910`
> 배포 전 고정 문서. 판정 규칙을 **결과를 보기 전에** 여기 박아둔다.

---

## 0. GROUND TRUTH (P1-0)

```
origin/main / production SHA   12ace2b   (PR #8 merge, Workers Builds success)
GSC property                   sc-domain:smartaitest.com   (siteOwner)
GSC frontier                   2026-09-06   (오늘 2026-09-10 기준 4일 지연)
```

### /ko/compatibility/ 배포 전 구조
```
title        궁합 테스트 - 커플 궁합 계산기 | AI Test Lab
H1           궁합 테스트
hero sub     질문으로 보는 재미 궁합
robots       index, follow      canonical self      sitemap 등재 O
robots.txt   차단 없음
```
**생년월일 입력은 이미 존재했으나 first-class가 아니었다.** `year-a/month-a/day-a`,
`year-b/month-b/day-b`가 16문항 퀴즈 **아래**, 접힌 `<details>`
("🔮 재미로 별자리·동물 궁합도 볼래요?") 안에 있었고, 설명문이
"점수에는 반영되지 않고 결과의 재미 태그에만 사용됩니다"라고 명시하고 있었다.
즉 "생년월일 궁합" 검색자가 도착하면 16문항 퀴즈를 먼저 만나고,
생년월일은 접힌 채로 "점수와 무관"하다고 안내받는 상태였다.

### GSC BASELINE — 이것이 이번 실험의 핵심 제약이다

page-filtered, frontier 기준:

| page | 7d(08-31~09-06) | 28d(08-10~09-06) |
|---|---|---|
| **KO `/ko/compatibility/`** | **impr 0 · clicks 0** | **impr 3 · clicks 1 · CTR 33.3% · pos 24.0** |
| JA `/ja/compatibility/` (control) | impr 8 · clicks 1 · pos 16.8 | impr 71 · clicks 16 · CTR 22.5% · pos 10.3 |
| EN `/en/compatibility/` (control) | impr 26 · clicks 8 · pos 1.7 | impr 126 · clicks 22 · CTR 17.5% · pos 4.8 |

locale 전체 (28d): `/ko/` impr 31 · clicks 5 · pos 19.2 ／ `/ja/` 73 · 16 · 11.1 ／ `/en/` 142 · 22 · 13.6
KO 상위 페이지: `/ko/` 26, `/ko/compatibility/` 3, `/ko/about/` 1, `/ko/age-calculator/` 1

**궁합 query cluster (28d, 사이트 전체, query contains "궁합"):**
```
얼굴 궁합 테스트   /ko/compatibility/   impressions 1   clicks 0   pos 37.0
cluster total: impressions 1 · clicks 0 · rows 1
```
요청된 클러스터(궁합 / 궁합 테스트 / 궁합 계산기 / 생년월일 궁합 / 커플 궁합 / 연애 궁합) 중
**실제 노출이 기록된 쿼리는 0개**다. 위 1건이 클러스터 전체다.

> **정직한 판정: KO 검색 노출은 바닥(floor)이다.** 기술적 차단은 없다
> (index,follow · self-canonical · sitemap 등재 · robots.txt 무차단).
> 노출 자체가 없어서 순위를 잃은 게 아니라 **애초에 서지 못하고 있는 상태**다.

---

## 1. GA4 DIMENSIONS (P1-1)

```
test_type      REGISTERED   (2026-09-09 10:49 KST, dimension 15743710323, EVENT scope)
lang           NOT REGISTERED  — 직전 체크포인트 기록 기준("test_type 하나뿐")
share_token    NOT REGISTERED  — 동일
```
> API 재확인 실패: 로컬 ADC 스코프가 `cloud-platform` + `webmasters`뿐이라
> `analyticsadmin.googleapis.com`이 `ACCESS_TOKEN_SCOPE_INSUFFICIENT`를 반환한다.
> 등록에는 대화형 재인증이 필요하므로 **사용자 액션 1건**으로 남긴다.
> **등록은 non-retroactive다** — 등록 시각 이전 수집분은 해당 dimension으로 분해되지 않는다.
> 사용자 지시대로 이것이 P1 구현을 막지는 않는다. **P1 primary metric은 GSC다.**

### 이번에 추가한 이벤트 (4개, 그 이상 늘리지 않음)
```
compat_fast_impression   fast path가 실제 화면에 들어왔을 때 1회 (IntersectionObserver 0.4)
compat_fast_start        fast 입력 필드 첫 입력 1회
compat_fast_complete     fast 제출 성공 시
compat_deep_start        16문항 첫 응답 또는 deep 링크 클릭 1회
params: test_type=compatibility · lang=ko · variant=fast_path|deep_path
```

---

## 2. 구현 요약 (P1-2 / P1-3)

**KO만.** `scripts/templates/compatibility.html`의 **`ko` 스냅샷 블록만** 수정했다
(템플릿은 locale별 byte-for-byte 스냅샷 5벌 구조). en/ja/zh/es 스냅샷 미변경.

```
title    생년월일 궁합 테스트 - 커플 궁합 계산기 | AI Test Lab
H1       생년월일 궁합 테스트
hero     생년월일로 바로 보거나, 16문항으로 자세히
desc     생년월일만 넣으면 바로 보는 무료 궁합 테스트 … 원하면 16문항으로 … 재미로 보는 참고용입니다.
og/tw    생년월일로 보는 궁합 테스트
```
키워드 반복 없음. 과장/운세 주장 없음. "재미로 보는 참고용" framing 유지.

**FAST PATH** — hero 바로 아래, 16문항 폼 **위**에 신규 `<section id="fast-path">`.
생년월일 2쌍(+선택 이름) → `#fast-submit` → 즉시 결과.

**중복 엔진 만들지 않았다.** 결과 라우트는 이미
```js
const results = hasAnswerData(inputData)
    ? calculateCompatibilityFromAnswers(inputData)
    : calculateCompatibility(inputData.personA, inputData.personB);
```
로 분기하고 있었고, `calculateCompatibility(personA, personB)`가 **이미 생년월일 엔진**이다.
fast path는 동일한 `compatibility-data` 계약에 `{personA, personB, entry:'fast'}`를 쓰고
같은 결과 페이지로 보낸다. `answerBreakdown`이 없으면 "응답 분석" 섹션은 기존 가드로 숨는다.

**DEEP PATH 무손상.** 16문항 폼·제출 핸들러·채점 로직·기존 `<details>` 전부 그대로다.
폼 위에 "더 자세히: 16문항 정밀 궁합" 안내 문구만 추가했다.

### 공유 토큰 커버리지 결함 동반 수정 (P0-A 버그)
fast path 테스트 중 발견: `getAnimalCouple()`이 `ANIMAL_COUPLES`에 없는 조합에
`key: null`을 주어 shared-entry 토큰이 생기지 않았다. **136개 가능 조합 중 33개만 정의**되어
있어 **103개(대다수)가 토큰 없이 랜딩으로 degrade**한다. 실제 생년월일은 임의의 조합을
만들므로 fast path에서 이 경로가 주로 걸린다.
→ `DEFAULT_COUPLE`에 `unique-duo` 토큰을 부여하고 5개 로케일 페이지를 생성했다(250→255).

> **공개된 예외**: 이 수정은 `js/compatibility.js` · `scripts/build-shared-entry.js`로
> **전 로케일에 적용된다.** JA/EN에서도 미정의 조합의 공유 URL이 랜딩 대신
> `/{lang}/compatibility/s/unique-duo/`가 된다. 색인 대상 표면이 아니고
> (noindex·sitemap 미등재) 각 로케일의 **페이지 콘텐츠·title·H1·SEO 표면은 불변**이므로
> 검색 실험의 control 유효성은 유지된다. 의도적으로 공개 기록한다.

---

## 3. 로컬 검증 (P1-4)

```
fold        390 / 430 / 768 전부 fast-path 섹션 top 327/327/361 → 첫 화면 내
            제출 버튼도 3개 뷰포트 전부 첫 화면 내 (752/752/626)
H1          생년월일 궁합 테스트   (3개 뷰포트 동일)
FAST        생년월일 입력 → /ko/compatibility/result/ 도달 · score 91% ·
            zodiac/animal 산출 · 응답분석 섹션 숨김 · coupleKey=unique-duo ·
            공유 URL /ko/compatibility/s/unique-duo/ · 공유 이미지 1080x1920 + 1080x1080
            이름 미입력 시 '나'/'상대' (엔진 기본값 Person A/B 영어 노출 차단)
DEEP        16문항 완주 → score 95% · 응답분석 섹션 표시 ·
            공유 URL /ko/compatibility/s/lion-cat/   (회귀 없음)
GA4         compat_fast_impression / compat_fast_start / compat_fast_complete
            / compat_deep_start 전부 정상 발화, params 정확
CONTROL     en·ja·zh·es/compatibility/index.html **byte-identical (git diff 없음)**
            EN/JA title 불변, 'fast-path' 문자열 0건
REGRESSION  personality-type / age-calculator / life-summary 완주 + 공유 URL 정상
            shared-entry 라우트 200 (unique-duo 신규 포함, ja 포함)
GATES       npm run verify GREEN — S1(45 template/generated pairs in sync) ·
            S2 · pre-S3 · telemetry-consent · age-calculator · viral-results ·
            shared-entry 전부 통과
```

---

## 4. EXPERIMENT CONTRACT (P1-5) — 배포 전 고정

```
PRIMARY     KO /ko/compatibility/ 궁합 cluster impressions (GSC, page-filtered)
SECONDARY   clicks · CTR · average position ·
            compat_fast_start / compat_fast_complete / compat_deep_start (GA4)
CONTROL     JA /ja/compatibility/ · EN /en/compatibility/
WINDOW      최소 28일. 7일차는 방향 확인용이며 승패 판정 금지.
            GSC 4일 지연을 감안해 배포일 D 기준 D+32에 28일 창이 채워진다.
ISOLATION   이 창 동안 다른 SEO 실험을 섞지 않는다.
```

### PRIMARY의 검정력 한계 — 반드시 먼저 읽을 것
28일 baseline이 **impressions 3 / clicks 1**, 궁합 cluster는 **impressions 1**이다.
이 수치에서는:
- **개선도 악화도 28일 안에 통계적으로 판정할 수 없다.** 3→0도, 3→9도 노이즈 범위다.
- 따라서 **퍼센트 기반 rollback threshold는 정의 불가능하다.** 임의 퍼센트를 만들지 않는다.
- 하방 리스크는 사실상 없다(바닥). 상방은 있으나 **28일 내 확인은 기대하지 않는다.**

이 실험은 "순위를 올린다"가 아니라 **"검색의도에 답하는 페이지로 만들어 두고,
색인이 붙을 때 받을 수 있는 상태를 만든다"**로 이해해야 한다.
검색 순위가 곧 오를 것이라고 가정하지 않는다.

### ROLLBACK RULE — 데이터 기반, 절대값 기준

퍼센트가 아니라 절대 조건으로 둔다(baseline n≈1~3이므로).

```
R1  KO /ko/compatibility/ 가 D+28까지 impressions 0 이고
    동시에 control(JA·EN) 중 하나 이상이 baseline 대비 유지·상승
    → rollback 후보 아님. "무효과"로 판정하고 유지 또는 별도 재설계.
    (baseline이 3이므로 0은 악화의 증거가 되지 못한다)

R2  KO /ko/ 전체(page prefix /ko/)가 D+28에 impressions ≤ 10 으로 떨어지고
    (baseline 31), 같은 창에서 JA·EN 전체가 ±30% 이내로 안정적이면
    → KO 고유 회귀 신호. rollback 실행.
    (페이지 단위가 아니라 locale 단위로 보는 이유: 페이지 n이 너무 작아
     페이지 지표로는 어떤 신호도 분리되지 않기 때문)

R3  /ko/compatibility/ 가 GSC Coverage에서 색인 제외로 전환되거나
    (noindex/canonical/soft-404 등) 크롤 오류가 새로 발생
    → 원인 불문 즉시 rollback.

R4  GA4에서 compat_deep_start 가 배포 전 대비 유의하게 감소하고
    compat_fast_complete 로 대체되지 않는 경우
    → fast path가 deep path를 잠식만 하고 총량을 못 늘린 것.
      rollback이 아니라 UX 재배치 후보.
```
rollback 실행 방법: 이 브랜치의 커밋을 revert 하면 KO 스냅샷이 배포 전 상태로 복귀한다
(추가 페이지 `s/unique-duo/`는 남겨도 무해하며, 남기는 것을 권장한다 — P0-A 결함 수정분).

### 관측 계획
```
D+7   방향 확인만. impressions/clicks/position 기록. 판정 금지.
D+28  PRIMARY·SECONDARY·CONTROL 동시 기록 후 R1~R4 대조.
```

---

## 5. 이번 PR에 넣지 않은 것 (지시대로)
```
P0-C  compatibility 95% above-the-fold 승격        미착수
P0-B' life-summary 첫 화면 share CTA                미착수
D5    카드 여백/CTA 카피                            미착수
D6    vb_saveImage() 단독 무반응                     UNKNOWN 유지
```
그 외: sitemap/noindex bulk 변경 0 · 전 로케일 변경 0 · 대량 콘텐츠 추가 0 ·
16문항 quiz 제거 0 · 신규 경쟁 랜딩 페이지 생성 0.

## 6. 알려진 한계 (이번 범위 밖)
- 공유 카드의 **별자리명이 영어**로 렌더된다(`Taurus & Scorpio`). `ZODIAC_SIGNS`에
  로케일 이름이 없고, 추가하려면 공유 코드가 전 로케일 카드에 영향을 준다.
  fast path가 항상 생년월일을 넘기므로 이 경로에서 더 자주 노출된다. **미수정, 기록만.**

---

# SEALED — PRODUCTION VERIFIED (2026-09-10)

```
PR                  #9   merged=true   merged_at 2026-09-09T21:56:11Z
PRODUCTION SHA      dc34158  "Merge pull request #9 from …/exp/ko-compat-birthdate-fastpath-0910"
feature commit      0e226f1  (ancestor 확인)
deploy              Cloudflare Workers Builds — build success · deploy success · report-build-status success
EXPERIMENT_START_AT 2026-09-09T21:56:11Z (UTC) = 2026-09-10 06:56 KST
```

> 검증 중 주의: 머지 직후 첫 확인에서 production이 **구 KO 페이지**를 서빙했다.
> cache-bust 요청에서도 동일했고 `/s/unique-duo/`가 404였으며,
> `Workers Builds` check-run이 `conclusion=null`(진행 중)이었다.
> **배포 전파 지연이었고 실패가 아니다.** 폴링으로 재확인해 라이브 전환을 포착했다.

## 1. DEPLOY — PASS
`/ko/compatibility/` 신규 콘텐츠 서빙 확인, `/ko/compatibility/s/unique-duo/` 200.

## 2·3. FAST PATH PRODUCTION E2E — PASS (390 / 430 / 768)
```
fold        fast-path 섹션 top 327 / 327 / 361 → 3개 뷰포트 전부 첫 화면
            제출 버튼도 전부 첫 화면 (752 / 752 / 626)
H1          생년월일 궁합 테스트   (3개 뷰포트 동일)
입력→결과    /ko/compatibility/result/ 도달 · score 91% · zodiac/animal 산출
            응답분석 섹션 숨김(fast path 정상) · coupleKey=unique-duo
공유         /ko/compatibility/s/unique-duo/
shared-entry 수신자: h1 유니크한 듀오 · lang=ko · CTA 첫 화면 가시 3/3 ·
            CTA → /ko/compatibility/ 도달
정밀 CTA     "16문항 정밀 궁합 테스트" 링크 존재, deep 섹션으로 연결
```

## 4. DEEP PATH 회귀 — PASS
16문항 완주 → score 95% · **응답 분석 섹션 표시** · 공유 `/ko/compatibility/s/lion-cat/`.
퀴즈·제출·채점 회귀 없음.

## 5. KO title/meta/H1/body — PASS (배포 확인)
```
title       생년월일 궁합 테스트 - 커플 궁합 계산기 | AI Test Lab
og:title    생년월일로 보는 궁합 테스트
H1          생년월일 궁합 테스트
desc        생년월일만 넣으면 바로 보는 무료 궁합 테스트. 문항 없이 즉시 결과를 …
robots      index, follow          canonical  self          (indexability 이상 없음)
fast-path 1 · 16문항 quiz 1 · deep heading 2
```

## 6. CONTROL — PASS
`en / ja / zh / es` production: `fast-path` 0건, 한국어 H1 0건, title 전부 배포 전과 동일.

## 7. REGRESSION — PASS
personality-type · age-calculator · life-summary 완주 + 공유 URL 정상.
shared-entry 라우트 및 기존 URL 계약 전부 200
(`/ko/`, `/ko/compatibility/`, `/ko/compatibility/result/`, `/en/`, `/ja/`, `sitemap.xml`).

## 8. GA4 LIVE — 3/4 PASS → 결함 발견 및 수정 (PR #10)
production `/g/collect` 실측:
```
compat_fast_start      도착
compat_fast_complete   도착
compat_deep_start      도착
compat_fast_impression 미도착  ← 결함
```
원인: 4개 중 유일하게 **consent 배너 응답 전**에 발화한다.
그 시점의 `AnalyticsEvents.track()`은 pre-consent 큐에 넣는데, **그 큐 사본이 전송까지
살아남지 못했다**(accept 실행에서 page_view·consent_granted는 도착, impression은 미도착).
impression은 fast-path 퍼널의 **분모**라 방치할 수 없다.

조치: `track()`이 `window.gaLoaded`를 기다린 뒤 전송하도록 변경(KO 스냅샷 한정).
consent 게이트는 그대로다 — **accept 시 impression 정확히 1회, reject 시 전송 0건** 실측.
→ **PR #10** (measurement only · SEO/카피/레이아웃/UX 무변경 → freeze 위반 아님).

## 9. unique-duo shared-entry (P0-A) — PASS
```
ko 200 lang=ko 유니크한 듀오 │ ja 200 lang=ja ユニークなデュオ │ en 200 lang=en Unique Duo
zh 200 lang=zh 独特二人组   │ es 200 lang=es Dúo Único
전부 robots=noindex, follow
```

## 10. GSC BASELINE 봉인 (frontier 2026-09-06, 재확인)
```
KO /ko/compatibility/   28d  impr 3   clicks 1  CTR 33.3%  pos 24.0
JA /ja/compatibility/   28d  impr 71  clicks 16 CTR 22.5%  pos 10.3   (control)
EN /en/compatibility/   28d  impr 126 clicks 22 CTR 17.5%  pos 4.8    (control)
궁합 cluster (site-wide, 28d)   rows 1 · impressions 1 · clicks 0
```
이 수치를 **배포 전 baseline으로 확정 봉인**한다. 재계산하지 않는다.

## 일정
```
EXPERIMENT_START_AT  2026-09-09T21:56:11Z  (2026-09-10 06:56 KST)
DAY7_CHECK_AT        2026-09-17  — early observation 전용, 승패 판정 금지
                     (GSC 4일 지연 → 실제 조회 가능 데이터는 ~09-13까지)
DAY28_DECISION_AT    2026-10-08  — GSC 지연 감안 시 28일 창이 채워지는 시점은 2026-10-11
PRIMARY              KO /ko/compatibility/ 궁합 cluster impressions
ROLLBACK             R1~R4 (§4). baseline n≈1~3이므로 퍼센트 임계값은 정의하지 않는다.
```

## FREEZE
```
FREEZE_ACTIVE  YES — 2026-09-10 ~ 2026-10-08
대상            /ko/compatibility/ 의 SEO · 본문 · 핵심 UX
예외            명백한 기능 버그만 (PR #10이 그 첫 사례: 계측 전용, 표면 무변경)
금지            P0-C · P0-B' · D5 · D6 및 그 외 SEO 실험 혼입
```

---

# MEASUREMENT FIX SEALED — PR #10 PRODUCTION VERIFIED (2026-09-10)

```
PR                  #10  merged=true  merged_at 2026-09-09T22:08:19Z
merge SHA           de71bf8   fix commit c24bacd (ancestor 확인)
deploy              Workers Builds success
LIVE CONFIRMED AT   2026-09-09T22:09:08Z  (= 2026-09-10 07:09 KST)
                    판정 근거: 서빙되는 KO 페이지에 gaLoaded 게이트 등장
```

## 두 개의 시간축 — 혼동 금지

```
SEO_EXPERIMENT_START_AT    2026-09-09T21:56:11Z  = 2026-09-10 06:56 KST   (PR #9 배포)
                           → GSC 검색 실험은 이 시각부터. DAY7/DAY28 일정은 이 축을 따른다.

GA4_FUNNEL_VALID_START_AT  2026-09-09T22:09:08Z  = 2026-09-10 07:09 KST   (PR #10 라이브)
                           → compat_fast_impression(분모)이 이 시각부터 완전하다.
                             그 이전 GA4 fast-path funnel 데이터는 분모 결손이므로
                             **판정에 사용하지 않는다.**
```
두 축의 간격은 약 13분이다. GSC 일정은 기존 계약 그대로 유지하고,
GA4 퍼널 분석만 `GA4_FUNNEL_VALID_START_AT` 이후 데이터로 제한한다.

## production /g/collect 실측

**CONSENT ACCEPT** — 4개 이벤트 전부 도착, 각 1회, 중복 0
```
compat_fast_impression  x1   variant=fast_path  lang=ko
compat_fast_start       x1   variant=fast_path  lang=ko
compat_fast_complete    x1   variant=fast_path  lang=ko
compat_deep_start       x1   variant=deep_path  lang=ko   (별도 세션에서 확인)
동반: page_view · consent_granted · test_start (기존 이벤트, 회귀 없음)
fast 결과: score 91% · share /ko/compatibility/s/unique-duo/
```

**CONSENT REJECT** — 전송 **0건**
```
{}   ← pre-consent impression 포함, 어떤 GA4 이벤트도 전송되지 않음
     (거부 후 생년월일 입력·제출까지 수행한 뒤에도 0)
```
동의 게이트는 여전히 authoritative하다. gaLoaded 대기는 전송 시점만 늦출 뿐
동의 없는 전송을 만들지 않는다.

## Fast Path 기능 회귀 — 없음 (390 / 430 / 768)
```
[390] top 327 · 제출버튼 첫화면 · H1 생년월일 궁합 테스트 · 16문항 quiz 유지
[430] top 327 · 제출버튼 첫화면 · 동일
[768] top 361 · 제출버튼 첫화면 · 동일
```

## CONTROL 재확인 — 변경 없음
```
en / ja / zh / es :  fast-path 0 · gaLoaded 게이트 0 · 한국어 H1 0 ·
                     compat_* 이벤트 0 · title 배포 전과 동일
```
PR #10은 KO 스냅샷에만 적용됐음을 production에서 재확인했다.

## KO indexability (freeze guard)
```
robots     index, follow      canonical  self (https://smartaitest.com/ko/compatibility/)
title      생년월일 궁합 테스트 - 커플 궁합 계산기 | AI Test Lab
```
색인 이상 없음. R3 rollback 조건 미해당.

## 일정 (변경 없음)
```
DAY7_CHECK_AT      2026-09-17   early observation only, 승패 판정 금지
DAY28_DECISION_AT  2026-10-08   (GSC 4일 지연 → 28일 창 실제 충족 2026-10-11)
PRIMARY            KO /ko/compatibility/ 궁합 cluster impressions (GSC)
GA4 퍼널            GA4_FUNNEL_VALID_START_AT 이후 데이터만 사용
```

## FREEZE
```
FREEZE_ACTIVE  YES — /ko/compatibility/ SEO · 본문 · 핵심 UX, 2026-10-08까지
예외            명백한 기능 버그만. PR #10이 그 사례였고 계측 전용이었다.
금지            lang/share_token dimension 등록 · P0-C · P0-B' · D5 · D6 ·
               zodiac localization · 그 외 SEO/UX 변경
```
