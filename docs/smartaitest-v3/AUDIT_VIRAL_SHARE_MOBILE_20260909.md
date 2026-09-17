# AUDIT — VIRAL SHARE ASSETS / TRUE MOBILE QA / SHARE RE-ENTRY

> 2026-09-09 · Phase B1+B2+B3 · **AUDIT ONLY — 코드 변경 0, 커밋 0, 배포 0**
> production SHA at audit time: `44f9c86` (origin/main) · local `ea72f62` (docs only, ahead 1)
> 이 문서는 checkpoint다. 기존 문서를 파괴적으로 재작성하지 않았다.

---

## 0. METHOD — 왜 이 숫자를 믿을 수 있는가

이전 세션은 Claude Chrome extension disconnect로 B1/B2가 미확정이었다.
extension의 `resize_window`는 성공을 반환하지만 **viewport가 실제로 바뀌지 않았다**
(`innerWidth`가 390 요청 후에도 1150 유지). 따라서 extension 경로를 버리고
**Playwright + 실제 Chromium device emulation**으로 전환했다.

```
engine          Playwright 1.x (python3.14), chromium headed (headless=False)
viewport        390x844 / 430x932 / 768x1024
device          device_scale_factor=3, is_mobile=true, has_touch=true
UA              iPhone OS 17_5 Safari/604.1
locale          ko-KR
target          https://smartaitest.com (production, 로컬 파일 아님)
```

**조작 방지 규칙 (준수함)**
- sessionStorage/localStorage 직접 주입 **0**. 4개 제품 전부 실제 입력·실제 라디오/버튼 클릭으로 완주.
- Cloudflare bot challenge 여부를 매 로드마다 본문에서 검사 → **전 로드 challenge 미발생**
  (title·h1·bodyLen 실측으로 실제 페이지 도달 확인). 과거 "헤드리스 = CF 아티팩트" 이슈 재발 없음.
- 측정 불가 항목은 UNKNOWN으로 남겼고 0/PASS로 바꾸지 않았다.
- consent banner는 **제거하지 않은 상태로 first-screen을 측정**했다(실제 첫 방문 상태).
  이미지 생성 트리거 시에만 클릭 가로채기 방지를 위해 DOM에서 제거했다. 동의 클릭은 하지 않았다.

산출물: `/private/tmp/.../scratchpad/audit/` (measure.json, shareimg.json, reentry.json,
shareurl.json, pt_real.json + 스크린샷·share PNG 원본)

---

## 1. PHASE B1 — SHARE ASSET VERDICT = **FAIL**

4개 flagship 전부에서 **실제 production canvas export를 가로채 PNG로 저장**했다
(`toDataURL`/`toBlob` 후킹). 추정 아님.

| product | 트리거 | 실측 치수 | 결과 identity 노출 | 판정 |
|---|---|---|---|---|
| compatibility | 📱 스토리용 9:16 | **1080x1920** ✓ | 지민/서연 · 95% · Lion & Cat | **FAIL** |
| compatibility | 🖼️ 피드용 1:1 | 1080x1080 | 동일 | FAIL(동일 사유) |
| life-summary | 이미지 저장 | **1080x1080** ✗ | 문릿 울프 + 5지표 | **PARTIAL** |
| personality-type | 결과 카드 공유 | **1080x1920** ✓ | 경영자 / ESTJ | **PASS(조건부)** |
| age-calculator | 스토리 (9:16) | **1080x1920** ✓ | 36 / 24 / 26 | **FAIL** |
| age-calculator | 정사각형 (1:1) | 1080x1080 | 동일 | FAIL(동일 사유) |

### D1 — 한국어 결과인데 카드가 영어다 (CRITICAL)
`/ko/` 결과에서 생성한 카드인데 텍스트가 전부 영어다.

- **age-calculator**: `My AI Age` · `Real Age` · `years old` · `Mental Age` · `Energy Age` ·
  `12y younger` · `Younger than my age!` — 카드 전체가 영어. 한국어 0.
- **compatibility**: `Our Compatibility` · `Animal Couple Type` · `Lion & Cat Couple` ·
  `Charismatic outside, cuddly inside!` · `Legendary Soulmates` ·
  `Communication/Values/Energy/Emotional/Growth` — 이름(지민/서연)만 한국어.
- **life-summary**: 카드 자체는 한국어 ✓. 다만 공유 **텍스트** 하나가
  `My AI Life Summary: "…"` 로 영어 prefix.

> `33dcf68 fix(age-calculator): take result copy language from the page, not localStorage`는
> **페이지 본문 카피**를 고쳤다. **이미지 생성기는 그 수정 범위 밖이었고 여전히 영어**다.
> 회귀가 아니라 미적용 구간이다.

### D2 — 카드에 박힌 URL이 영어 페이지로 301된다 (CRITICAL)
카드 하단 워터마크 URL을 실제로 curl 했다.

```
smartaitest.com/age-calculator   307 → /age-calculator/  301 → /en/age-calculator/
smartaitest.com/compatibility/                            301 → /en/compatibility/
smartaitest.com/life-summary/                             301 → /en/life-summary/
smartaitest.com/ko/age-calculator/                        200
```

한국 사용자가 공유한 카드를 본 한국인 수신자가 그 URL로 들어가면 **영어 페이지에 떨어진다.**
locale이 공유 경계에서 파괴된다.

### D3 — compatibility 9:16 카드에 잘림/겹침 (HIGH)
`🎬 Your Love Movie: Epic Romance` 줄이 흰 카드 **아래 경계 밖**에 렌더되어
분홍 배경 위 분홍 글자 + 하트 이모지에 가려 **판독 불가**. 육안 확인함.
`share_compatibility_0_1080x1920.png` y≈1570.

### D4 — life-summary 카드가 9:16이 아니다 (MEDIUM)
`1080x1080` 정사각형만 생성된다. Stories/Reels/Shorts 세로 슬롯이 없다.
나머지 3개 제품은 9:16을 갖고 있다.

### D5 — 여백 과다 / CTA 부재 (MEDIUM)
- personality-type: 상단 ~600px, 하단 ~500px 공백. 콘텐츠가 좌측 정렬 중앙 밴드에만 존재.
- 4개 카드 전부 **"너도 해봐" 류 CTA 문구가 없다.** 워터마크 URL이 유일한 진입 단서다.

### D6 — `vb_saveImage()` 무반응 (LOW, 미확정)
compatibility의 `📷 이미지로 저장`(onclick=`vb_saveImage()`)은 클릭해도 canvas export가
발생하지 않았다(포맷 피커를 여는 용도일 가능성). 실제 동작 경로는
`📱 스토리용 9:16` / `🖼️ 피드용 1:1`이다. **dead button 여부 UNKNOWN — 추가 확인 필요.**

### 첫눈에 공유할 가치가 있는가
- personality-type / life-summary: **YES** (identity가 크고 즉시 읽힘)
- compatibility: **조건부** — 95%와 동물 커플은 강하나 영어 + 잘린 줄이 신뢰를 깎는다
- age-calculator: **NO (한국어 사용자 기준)** — 카드 전체가 영어라 한국인에게 공유 부적합

---

## 2. PHASE B2 — MOBILE QA VERDICT = **MEASURED** (UNKNOWN 없음)

390/430/768 전부 실제 emulation으로 측정 성공. 조작 수치 없음.

### 2.1 life-summary (P0-B 대상) — **tap gate / layout 결함은 이미 해결됨**

무상호작용 상태(도착 직후, 아무것도 누르지 않음) 실측:

| 항목 | 390x844 | 430x932 | 768x1024 |
|---|---|---|---|
| tap gate 존재 | **0** | **0** | **0** |
| 도착 scrollY | **0** | **0** | **0** |
| identity(문릿 울프) 최초 가시 | **YES** | **YES** | **YES** |
| card top | **96px** | 96px | 96px |
| card 가시 비율 | **100%** | 100% | 100% |
| title/card overlap | **없음** | 없음 | 없음 |
| reveal 전/후 scrollY 변화 | **없음(뷰포트 이동 코드 없음)** | 없음 | 없음 |

`탭해서 확인하기 / TAP TO REVEAL` 문자열 **가시 인스턴스 0** — 전 뷰포트.
스크린샷 육안 확인: 카드에 🐺🌙 + "문릿 울프"가 첫 페인트에 그대로 보인다.

> **결론: `fc390423` 의 수정이 production에 정상 반영되어 있고, TOP_PRIORITY_2의
> tap-gate + layout 항목은 CLOSED다.** 5개 로케일 + `scripts/templates/life-summary-result.html`
> + `life-summary/result.html` 전부에 적용되어 있어 템플릿 드리프트 재발 위험도 없다.

**stale hint 판정 — 결함 아님**
`스크롤하여 더 보기 ↓`는 390에서 top=860, 즉 fold(844) **16px 아래**라 첫 화면에 안 보인다.
스크롤하면 정상 유동 요소로 위로 흘러나간다(scrollY 5988에서 top=-5127).
고정 오버레이가 아니므로 "이미 공개된 카드 아래서 계속 떠 있는" 과거 증상은 **재현되지 않는다.**

**남은 life-summary 이슈 = share CTA 도달성 (NEW)**
```
sticky bar(📤 결과 공유)  scrollY 0   → top=844, onScreen=false, class="kick-sticky-bar"
                          scrollY 300 → top=844, onScreen=false
                          scrollY 800 → top=768, onScreen=TRUE,  class="kick-sticky-bar visible"
```
의도된 scroll-triggered reveal이다(버그 아님). 결과적으로 **첫 화면에 공유 수단이 하나도 없다.**
가장 가까운 공유 버튼은 `이미지 저장` top=2248.

### 2.2 나머지 3개 제품 first screen

| product | identity | top | 가시율 | 첫 화면 노출 | 첫 화면 share CTA |
|---|---|---|---|---|---|
| personality-type | `ESTJ` | **144** | 100% | **YES** | 없음(최근접 1218) |
| age-calculator | `정신나이 24` | **482** | 100% | **YES** | **있음**(공유 762) |
| compatibility | `95%` | **1240** | **0%** | **NO** | 있음(공유 762) |
| life-summary | `문릿 울프` | **96** | 100% | **YES** | **없음** |

- **compatibility 결함(NEW, HIGH)**: 핵심 숫자 95%가 390/430/768 **세 뷰포트 모두에서 fold 아래**,
  가시율 0%. 첫 화면은 타이틀 + 이름카드 + 동물커플까지만 보인다.
  타이틀과 이름카드 사이 수직 공백도 과다(스크린샷 확인).
- consent banner가 첫 방문 시 하단 **177px**(390/430) / 118px(768)를 점유한다. 전 제품 공통.

### 2.3 오탐 정정 — personality-type 점수는 정상이다
측정 중 3개 응답 패턴(전부 최고동의 / 전부 최고비동의 / period-5 의사난수)이
**모두 ESTJ · 4축 전부 50%** 를 반환해 결함으로 의심했으나, **내 테스트 패턴의 아티팩트였다.**

각 축은 forward 5문항 + reverse 5문항 블록 구조(`EEEEEIIIII`)라 균일·주기5 응답은
정의상 정확히 상쇄된다. 비축퇴 응답으로 재검증:

```
coherent(forward=1, reverse=5)  → INFP  축 83/83/83/83
coherent(forward=5, reverse=1)  → ESTJ  축 83/83/83/83
true_random(seed=7)             → ISFP  축 57/50/62/57
```
**채점 로직 정상. 제품 결함 아님.** (내가 캡처한 share PNG의 `E 50% S 50%…` 칩도 같은 아티팩트다.)

---

## 3. PHASE B3 — SHARE RE-ENTRY (코드+실측 재확인)

### 3.1 `getShareUrl()`은 존재하지 않는다 — 실제 경로를 실측했다
저장소에 `getShareUrl` 심볼 **없음**. 각 제품이 공유 타깃에 넘기는 URL을
clipboard/window.open/navigator.share를 후킹해 그대로 캡처했다.

| product | 실제 공유되는 URL | locale | result context |
|---|---|---|---|
| compatibility | `https://smartaitest.com/ko/compatibility/result/` | 유지 | **없음** |
| life-summary (링크복사·kakao) | `https://smartaitest.com/ko/life-summary/result/` | 유지 | **없음** |
| life-summary (이미지 공유문구) | `https://smartaitest.com/life-summary/` | **파괴** | 없음 |
| age-calculator | `https://smartaitest.com/age-calculator/?r=36&m=24&e=26` | **파괴** | 파라미터는 있음 |
| personality-type | `https://smartaitest.com/ko/personality-type/t/estj/` | **유지** | **있음** |

부수 확인: compatibility의 `generateShareUrl()`은 `/ko/compatibility/`(랜딩)를 돌려주지만
실제 버튼은 이 값을 쓰지 않는다. age-calculator의 `generateShareUrl()`/`generateShareText()`는
**예외를 던진다**(`Cannot read properties of undefined (reading 'realAge')`) — 동작 경로는 별개.
`ViralLink.generateComparisonLink`는 4개 결과 페이지 어디에도 **로드되어 있지 않다**
(`NOT PRESENT`). `js/viral-link.js:98-117`의 `ref_type`/`ref_src`는 결과 페이지에서 미사용이고,
`parseReferralFromURL()`은 `ref_dob` 없으면 early-return null인데 같은 함수가 `ref_dob`를
의도적으로 안 넣으므로 **설령 연결해도 동작하지 않는 구조**다.

### 3.2 수신자 콜드 진입 실측 — **P0-A 확정**
새 브라우저 컨텍스트(스토리지 전무)로 위 URL들을 그대로 열었다.

| 공유된 URL | 수신자가 실제로 도착하는 곳 | 본 것 | context | locale |
|---|---|---|---|---|
| `/ko/compatibility/result/` | → `/ko/compatibility/` | 빈 퀴즈 폼 | **소실** | 유지 |
| `/ko/life-summary/result/` | → `/ko/life-summary/` | 빈 생년월일 폼 | **소실** | 유지 |
| `/life-summary/` | → `/en/life-summary/` | 영어 빈 폼 | 소실 | **소실** |
| `/age-calculator/?r=36&m=24&e=26` | → `/en/age-calculator/?r=36&m=24&e=26` | 영어 빈 위저드, **파라미터 무시** | 소실 | **소실** |
| `/ko/personality-type/t/estj/` | 그대로 200 | **경영자·ESTJ·설명·강점 + "나도 이 테스트 해보기 →"** | **유지** | 유지 |

> 결과 페이지는 수신자의 스토리지를 읽으므로 값이 없으면 **랜딩으로 클라이언트 리다이렉트**된다.
> 발신자의 "95% 사자와 고양이 커플"은 수신자에게 **아무 흔적도 남기지 않는다.**
> age-calculator의 `?r=&m=&e=`는 **전달은 되지만 페이지가 소비하지 않는 죽은 payload**다.

### 3.3 이미 존재하는 정답 — personality-type `/t/{code}/`
```
경로       /{lang}/personality-type/t/{code}/
커버리지   16 type × 5 locale = 80 페이지, 전부 실재 (ko/en/ja/zh/es 각 16개)
HTTP       200
canonical  self (https://smartaitest.com/ko/personality-type/t/estj/)
robots     noindex, follow
hreflang   ko/en/ja/zh/es/x-default 완비
sitemap    미등재 (0건)
teaser     유형명·코드·한줄설명·강점
CTA        "나도 이 테스트 해보기 →" → /ko/personality-type/
민감정보    URL에 없음 (유형 코드만)
```
**요구된 shared-entry primitive가 이미 1개 제품에 구현되어 production에서 동작 중이다.**
새로 발명할 필요 없이 이 패턴을 나머지 3개로 확장하는 것이 최소·최안전 경로다.

### 3.4 GA4 계측 현황
`js/analytics-events.js` 실측. emit 관용구:
```js
AnalyticsEvents.track('event_name', { param: value })   // js/analytics-events.js:27
// consent 게이트 + window.gaLoaded 게이트 + 미충족 시 queueEvent() 후 flush
```
현존 이벤트: `page_view · home_view · article_view · article_to_test_click · test_landing ·
test_start(+test_started) · question_answered · test_complete(+test_completed) · test_abandoned ·
result_view · share_click · share_success · share_clicked · share_completed · share_failed ·
deep_dive_impression · deep_dive_click · ad_clicked · exit_intent · recovery_modal_shown ·
recovery_continued · referral`

```
share_entry          ABSENT
shared_result_view   ABSENT
shared_to_test_start ABSENT
```
`test_type` custom dimension은 등록됨(2026-09-09 10:49 KST, EVENT scope, 소급 불가).

---

## 4. SHARED_ENTRY_DESIGN (설계안 — 미구현)

**원칙: 발명하지 말고 `/t/{code}/`를 일반화한다.**

```
경로 규약   /{lang}/{product}/s/{token}/
            personality-type은 기존 /t/{code}/ 유지 (URL 파괴 금지)
```

| product | token | 카디널리티 | teaser 문구 |
|---|---|---|---|
| personality-type | `{typecode}` (기존) | 16 | 경영자 (ESTJ) |
| compatibility | `{band}-{animalpair}` 예 `95-lion-cat` | 점수 밴드 20 × 동물쌍 N | "이 커플은 95% · 사자와 고양이 커플" |
| life-summary | `{soultype}` 예 `moonlit-wolf` | soul type 수 | "이 사람의 소울 타입은 문릿 울프" |
| age-calculator | `{delta-band}` 예 `mind-12-younger` | 밴드 ~15 | "정신 나이가 12살 젊게 나왔어요" |

**데이터 규약 (무엇이 인코딩/영속/만료되는가)**
- URL에 담는 것: **결과 라벨(저카디널리티 버킷)뿐.** 생년월일·이름·원점수·응답 배열 **금지**.
- 서버 영속화 **없음**. 정적 사이트 유지 — 토큰은 **사전 생성된 정적 페이지 주소**다.
- 따라서 **만료 개념 없음**(개인 데이터를 담지 않으므로 만료가 불필요). 발신자 스토리지는 불변.
- 이름(지민/서연)은 URL에 넣지 않는다 → teaser는 "이 커플은"처럼 익명 표현.
  (요구된 "OO님의 결과는" 형태는 이름을 URL에 실어야 하므로 **채택하지 않음** — 개인정보 원칙 우선.)
- 카디널리티가 유한하므로 전 조합을 빌드 타임에 정적 생성 가능(= /t/ 와 동일 방식).

**SEO 규약 (기존 자산 훼손 0)**
- 신규 페이지는 `robots: noindex, follow` + self-canonical + 전 로케일 hreflang — `/t/`와 동일.
- sitemap 미등재(현행 `/t/` 관행 유지). 기존 랜딩/결과 canonical **변경 없음**.
- 기존 `/{lang}/{product}/result/` 라우트·동작 **불변** → direct-entry UX 무변화.

**locale 규약**
- 공유 URL은 항상 발신자의 `document.documentElement.lang` prefix를 사용.
- 카드 워터마크 URL도 locale prefix 포함으로 교체 (D2 해소).

**GA4 규약**
```js
// 공유 진입 페이지 로드 시
AnalyticsEvents.track('share_entry',        { test_type, share_token, lang });
AnalyticsEvents.track('shared_result_view', { test_type, share_token, lang });
// teaser CTA 클릭 → 테스트 시작
AnalyticsEvents.track('shared_to_test_start', { test_type, share_token, lang });
```
- 기존 `test_start`/`result_view`와 **중복 발화 금지** (CTA 클릭은 shared_to_test_start만,
  이후 랜딩에서 기존 test_start가 자연 발화).
- `test_type`은 등록된 custom dimension 재사용. `share_token`·`lang`은 **미등록** →
  등록 여부는 사용자 결정 사항(등록 전 수집분은 소급 불가).

---

## 5. 상태 요약

```
AUDIT_COMPLETE               YES  (B1·B2·B3 전부 production 증거 확보)
SHARE_ASSET_VERDICT          FAIL (D1 영어카피 · D2 locale 301 · D3 잘림 · D4 9:16 부재
                                   · D5 여백/CTA · D6 UNKNOWN)
MOBILE_QA_VERDICT            MEASURED (390/430/768 실측, UNKNOWN 0)
                             life-summary tap-gate/layout PASS
                             compatibility identity above-fold FAIL
                             life-summary·personality-type 첫화면 share CTA 부재
SHARED_ENTRY_DESIGN          DEFINED (기존 /t/ 패턴 일반화, §4)
LIFE_SUMMARY_FIX_STATUS      ALREADY FIXED (fc390423) · PRODUCTION VERIFIED · 5 locale + template
COMPATIBILITY_EXPERIMENT_READY  NO  (audit 단계, 별도 branch·측정·rollback 조건 미수립)
GA4_MEASUREMENT_READY        NO  (3개 이벤트 전부 부재, 설계만 확정)
PRODUCTION_READY             NO  (이번 세션 코드 변경 0)
USER_ACTION_REQUIRED         P0-A 구현 범위 결정 (§6)
```

## 6. 구현 순서 (미착수)

```
P0-A  share re-entry context
      A1 카드/공유문구 locale 고정 + 워터마크 URL에 locale prefix   (저위험, 신규 라우트 0)
      A2 /{lang}/{product}/s/{token}/ 정적 생성 3개 제품             (신규 라우트 다수)
      A3 GA4 share_entry / shared_result_view / shared_to_test_start
P0-B  life-summary tap gate + layout        → CLOSED (fc390423에서 이미 해결·검증됨)
      잔여: 첫 화면 share CTA 부재 (신규 항목, P0-B'로 분리)
P0-C  (신규) compatibility 95% above-the-fold 승격
P1    KO compatibility birthdate fast path — 검색 실험, 별도 branch·측정·rollback 조건 필수
```

DO NOT (유지): bulk rollback · truth rollback · noindex/sitemap bulk restore ·
전체 언어 동시 변경 · 기존 quiz 제거 · 내부링크 증설을 해결책으로 오인 · AdSense 관련 작업

---

# ADDENDUM — P0-A IMPLEMENTED (2026-09-10)

> 사용자 승인으로 A1+A2+A3 전부 구현. PR **#8** (`fix/smartaitest-share-reentry-0910`, commit `863c749`).
> **머지 대기 중** — production 배포/검증은 머지 이후.

## 구현 내용

**A1 — locale 고정 (신규 라우트 0)**
- `js/age-image-generator.js` · `js/compatibility-image.js` · `js/share.js` · `js/image-generator.js` ·
  `js/age-share.js`에 로케일 카피 테이블 추가. 카드/공유문구가 `document.documentElement.lang`을 따른다.
- 결과 데이터(ANIMAL_COUPLES·relationshipType·movieGenre)는 이미 5개 로케일을 갖고 있었고
  카드만 `.en`을 하드코딩하고 있었다 → `compatL()`로 교체.
- 워터마크 URL에 locale prefix 삽입 → **D2 해소**(더 이상 `/en/`으로 301되지 않음).

**A2 — shared-entry 라우트**
- `scripts/build-shared-entry.js` 신규. `/{lang}/{product}/s/{token}/` **250 페이지**
  (life-summary 12×5, compatibility 33×5, age-calculator 5×5).
- 기존 `/{lang}/personality-type/t/{code}/` 80 페이지는 **URL 그대로 유지**, 계측만 추가.
- token = 결과 라벨만(soul type / animal couple / age band). 생년월일·이름·응답·점수 **미포함**.
  서버·DB 없음, 영속 저장 없음 → 만료 개념 자체가 불필요.
- noindex+follow · self-canonical · hreflang 6종 · sitemap 미등재 (기존 `/t/` 관행 동일).
- 잘못된 토큰 → `404.html` + `not_found_handling = "404-page"`로 로케일 랜딩 복귀.

> **`_redirects` splat은 쓸 수 없다 (로컬 실측).** `/:lang/:product/s/* → landing 302`를 넣으면
> 정적 자산보다 **먼저** 평가되어 실제 shared-entry 페이지를 전부 가려버리고,
> 이미 동작 중인 `/t/estj/`까지 삼켰다. 배포 전 wrangler dev에서 발견해 철회했다.

**A3 — GA4**
- `share_entry` · `shared_result_view` · `shared_to_test_start` (params: `test_type`, `share_token`, `lang`).
- CTA는 navigation을 250ms 지연시켜 beacon 취소를 막는다.

## 로컬 검증 (wrangler dev, 실제 Chromium device emulation)

```
sender    4 flagship 전부 shared-entry URL만 발신, 맥락 없는 /result/ 링크 0
          compatibility  /ko/compatibility/s/lion-cat/
          life-summary   /ko/life-summary/s/moonlit-wolf/
          age-calculator /ko/age-calculator/s/mind-much-younger/
          personality    /ko/personality-type/t/estj/        (기존 유지)
recipient 4종 전부 teaser + CTA 정상, lang=ko, robots=noindex,follow,
          self-canonical, hreflang 6, CTA 첫 화면 가시 = 390/430/768 전부 TRUE
fallback  /ko/life-summary/s/does-not-exist/ → /ko/life-summary/
GA4       /g/collect 실측: share_entry ×1, shared_result_view ×1,
          shared_to_test_start ×1 — 4개 제품 전부, 파라미터 정상
          (초기 관측된 "2회"는 analytics 큐 replay를 후킹한 계측 아티팩트였고
           실제 전송은 1회였다. 네트워크로 재확인함.)
cards     age-calculator 전면 한국어, 워터마크 /ko/
          compatibility  전면 한국어, 영화 줄이 카드 안으로 복귀(D3 해소)
          life-summary   1080x1920 생성 확인(D4 해소)
verify    npm run verify GREEN (기존 guard 전부 + 신규 check:shared-entry)
          S1: template/generated 45쌍 sync
```

## 추가로 발견해 함께 고친 결함

- **D3** compatibility story 카드 높이 1250인데 영화 줄을 cardY+1280에 그려 카드 밖으로 이탈 → 1330으로 교정.
- **D4** life-summary가 `#format-story`에 `.active`를 달고도 JS 초기값이 `'square'` → `'story'`로 일치.
- `currentSoulType`이 script-scoped `let`이라 share.js에서 보이지 않던 문제 → window에 게시.
- 템플릿에는 로케일별 스냅샷이 5벌씩 들어 있어 1회 치환으로는 1개 로케일만 고쳐진다.
  전 occurrence 치환 후 `build:i18n` 재생성으로 5개 로케일 일치 확인.

## 정정

`AUDIT` 본문 §2.3에 기록한 대로, personality-type "항상 ESTJ·50%"는 **제품 결함이 아니라 측정 아티팩트**였다.
비축퇴 응답 재검증 결과 INFP 83 / ESTJ 83 / ISFP 57·50·62·57로 정상 채점된다.

## 상태

```
LOCAL_VERIFIED     YES
PRODUCTION_READY   PR #8 머지 대기 (CI: Workers Builds pass)
남은 작업          머지 → 배포 → production E2E(390/430/768) + 4 flagship 회귀 재검증
```

## 후속 수정 (commit `70b66a4`) — 병렬 코드감사 에이전트 제보분

병렬로 돌린 read-only 코드감사 에이전트가 `js/compatibility-share.js:23`의
**non-locale fallback**(`return path || '/compatibility/'`)을 지적했다. 그 보고서의 다른 결론
대부분은 "assumed / file not read" 표기이거나 실측과 어긋났지만(특히 "personality-type은
`/t/{code}/`로 공유하지 않는다"는 **오류** — clipboard·LINE·Twitter·Facebook 전부
`/ko/personality-type/t/estj/` 발신을 실측함, 근거 `js/personality-type-result.js:90`),
이 fallback 지적은 **유효했고 내 A2 구현에도 그대로 승계되어 있었다.**

- 증상: 루트 `/compatibility/result.html`(lang="en")은 pathname에 locale 세그먼트가 없어
  `compatEntryPath()`가 `/compatibility/`를 반환 → 공유 URL이 `/compatibility/s/{key}/`가 된다.
  **그런 페이지는 생성되지 않으며**, 404 fallback 정규식도 locale prefix를 요구하므로 복구 불가.
- 조치: pathname 문자열 가공을 버리고 `document.documentElement.lang`에서 locale을 읽는다
  (age-share.js·share.js가 이미 쓰는 방식과 통일).
- 검증: 루트 결과 페이지에서 `generateShareUrl()` = `/en/compatibility/s/lion-cat/` (실존) 확인.
  4개 제품 sender E2E 재실행 전부 정상, `npm run verify` GREEN 유지.

> 교훈으로 남김: 서브에이전트 보고는 실측으로 교차검증한 뒤에만 채택한다.
> 이번엔 6개 주장 중 1개만 유효했고, 1개는 검증된 사실과 정반대였다.

---

# CLOSE-OUT — PRODUCTION VERIFIED (2026-09-10)

```
PR                 #8   merged=true  merged_at 2026-09-09T21:04:13Z
merge SHA          12ace2b  "Merge pull request #8 from …/fix/smartaitest-share-reentry-0910"
commits in main    863c749 · 70b66a4   (둘 다 ancestor 확인)
deploy             Cloudflare Workers Builds — build success · deploy success ·
                   Workers Builds: ai-life-summary success · report-build-status success
```

> 주의로 남김: 첫 확인 시 `gh api`가 `merge_commit_sha`를 반환해 머지된 것처럼 보였으나
> 이는 open PR에 존재하는 **speculative test-merge** 값이었다. 판정 기준은 `merged=true`와
> `origin/main` SHA, 그리고 production HTTP 응답이다. 실제 머지 전에는 신규 URL이 전부 404였다.

## 1. DEPLOY CONFIRMATION — PASS

```
/ko/life-summary/s/moonlit-wolf/          200
/ko/compatibility/s/lion-cat/             200
/ko/age-calculator/s/mind-much-younger/   200
/ko/personality-type/t/estj/              200   (기존, 회귀 없음)
```
served JS 본문에 수정 포함 확인: `ageCardUrl` · `ageShareBand` · `compatCardUrl` ·
`cardHeight = 1330` · `compatShareLang` · `resolvedKey` 전부 present.
`compatibility-share.js?v=6fb3b97d` (로컬 스탬프와 일치).

## 2. PRODUCTION E2E — PASS (390 / 430 / 768)

4 제품 × 3 뷰포트 = **12/12**. 각 조합에서 발신되는 URL은 **shared-entry 1개뿐**,
맥락 없는 `/result/` 링크 **0**, locale 전부 `ko` 유지.

| product | 발신 URL (3 뷰포트 동일) | 결과 identity |
|---|---|---|
| compatibility | `/ko/compatibility/s/lion-cat/` | 95% |
| life-summary | `/ko/life-summary/s/moonlit-wolf/` | 문릿 울프 |
| personality-type | `/ko/personality-type/t/estj/` | ESTJ |
| age-calculator | `/ko/age-calculator/s/mind-much-younger/` | 정신나이 24 |

수신자 측(콜드 컨텍스트) 4/4:
```
lang=ko · robots=noindex,follow · self-canonical · hreflang 6
h1 = 문릿 울프 / 사자와 고양이 커플 / 마음이 훨씬 젊은 편 / 경영자
CTA "나도 이 테스트 해보기 →" → 각 locale 테스트 랜딩 도달 확인
CTA 첫 화면 가시 = 390/430/768 전부 TRUE (12/12)
```

fallback (실브라우저):
```
/ko/life-summary/s/does-not-exist/ → /ko/life-summary/
/ja/compatibility/s/nope/          → /ja/compatibility/
/ko/personality-type/t/zzzz/       → /ko/personality-type/
```
HTTP 404 + 클라이언트 복귀 — URL이 실제로 없으므로 404 상태 자체는 올바르다.

## 3. 4 FLAGSHIP REGRESSION — PASS

완주 → 결과 렌더 → 공유 URL → 공유 이미지까지 4/4 정상. 실제 production canvas export:

| product | story | square | 카피 | 판정 |
|---|---|---|---|---|
| compatibility | **1080x1920** | 1080x1080 | 전면 한국어 | PASS |
| life-summary | **1080x1920** | — | 한국어 | PASS (D4 해소) |
| personality-type | **1080x1920** | — | 한국어 | PASS |
| age-calculator | **1080x1920** | 1080x1080 | 전면 한국어 | PASS (D1 해소) |

육안 확인: compatibility 카드의 `🎬 우리의 사랑 영화: 운명적 로맨스`가 **카드 내부로 복귀**(D3 해소),
워터마크 `smartaitest.com/ko/compatibility` (D2 해소 — 더 이상 `/en/`으로 301되지 않음).

기존 URL 계약: `/ko/` · 4개 제품 landing·result · `/en/ /ja/ /zh/ /es/` · `sitemap.xml` 전부 **200**.
`/blog.html` 307은 `ff15ef3`의 기존 리다이렉트로 이번 변경과 무관.

## 4. LIVE GA4 — PASS

실제 `/g/collect` 네트워크 기준, 4개 제품 전부 **중복 없이 각 1회**:

```
share_entry           x1
shared_result_view    x1
shared_to_test_start  x1   (CTA 클릭 시, navigation 250ms 지연으로 beacon 보존)
params  test_type / share_token / lang  전부 정상
        예) test_type=life-summary  share_token=moonlit-wolf  lang=ko
```
> 로컬 검증 중 관측된 "2회"는 analytics 큐 replay를 후킹한 **계측 아티팩트**였고,
> 네트워크 기준 실제 전송은 1회다. production에서도 1회로 재확인했다.

`test_type`은 기존 등록 custom dimension 재사용. `share_token`·`lang`은 **미등록** —
GA4 UI에서 분해해 보려면 custom dimension 등록 필요(등록 전 수집분은 소급 불가).

## 5. P0-B 재확인 — PASS

`fc39042`가 배포 SHA `12ace2b`의 ancestor임을 확인. served `/ko/life-summary/result/`에
tap-gate 문자열 0, `instant-reveal` 4.

무상호작용 실측(production):

| | 390x844 | 430x932 | 768x1024 |
|---|---|---|---|
| tap gate 가시 | **0** | **0** | **0** |
| 도착 scrollY | **0** | **0** | **0** |
| identity `.type-name` = 문릿 울프 | top 309 · **100%** | top 309 · **100%** | top 343 · **100%** |
| `#reveal-card` | top **96** · **100%** | top 96 · 100% | top 96 · 100% |
| portrait ↔ 이름 겹침 | **없음** | 없음 | 없음 |

`card ↔ name` 교차는 이름이 **카드 내부 자식**(`.type-name` ⊂ `#reveal-card`)이라 정상이다.
`#result-card-immediate`는 인라인 렌더크리티컬 `<style>` 블록이며 결함이 아니다
(초기 감사에서 이 id를 identity 셀렉터로 잡아 h=0으로 읽힌 것은 셀렉터 오선정이었다).

## 6. 판정

```
P0-A  SHARE RE-ENTRY        CLOSED — PRODUCTION VERIFIED GREEN
P0-B  LIFE-SUMMARY TAP GATE CLOSED — PRODUCTION VERIFIED GREEN
```

배포 자산: shared-entry `/s/` 250 페이지(life-summary 60 · compatibility 165 · age-calculator 25)
+ 기존 `/t/` 80 페이지 계측. sitemap 내 `/s/`·`/t/` 항목 **0**(색인 대상 아님, 의도대로).

## 미해결 (P0-A 범위 밖, 사용자 판단 대기)

- **D5** 카드 여백 과다 / 카드 내 "너도 해봐" CTA 카피 부재 — 미착수
- **D6** compatibility `vb_saveImage()` 단독 클릭 시 canvas export 미발생 — UNKNOWN 유지
  (동작 경로는 포맷 피커 `스토리용 9:16` / `피드용 1:1`이며 정상)
- **P0-C** compatibility 95%가 390/430/768 전부 fold 아래(가시율 0%)
- **P0-B'** life-summary 첫 화면에 공유 CTA 없음 — sticky bar는 scrollY≈800에서 노출(의도된 동작)
