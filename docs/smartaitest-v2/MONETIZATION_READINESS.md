# MONETIZATION READINESS — SMART S0

> 2026-09-08 · repo `644c3f8` · 라이브 검증 · **코드 변경 0**
> 세 축을 **하나의 종합점수로 뭉개지 않는다.**

---

# 0. 3-WAY VERDICT

| 축 | 판정 | 한 줄 근거 |
|---|---|---|
| **A. VIRAL_READY** | **NOT_READY** | 공유하면 친구가 결과를 못 본다 + JA 결과 화면에 LINE이 없다 |
| **B. FATEAIVERSE_REFERRAL_READY** | **PARTIAL** | ja/ko의 compatibility·블로그 16면에 UTM CTA 실재. 그러나 **클릭 계측 0**, en/zh/es·홈·타 결과면 **0** |
| **C. ADSENSE_READY** | **PARTIAL / 상태 UNKNOWN** | 로더는 라이브 64면에서 실제로 실행 중. 그러나 **광고 슬롯 0개**, 계정 승인 상태 UNKNOWN |

---

# 1. ADSENSE REALITY — CLAUDE.md가 STALE이다

## 1.1 정정 필요 — 최우선

프로젝트 `CLAUDE.md`는 이렇게 적혀 있다:
> "**2026-05-17**: AdSense 시도 **종료**. AdSense 코드 **제거됨**. **재시도 금지**."

**이것은 현재 저장소·라이브와 일치하지 않는다.**

| 확인 | 결과 |
|---|---|
| 저장소에 AdSense 로더가 있는 HTML | **64개** |
| 라이브에서 `adsbygoogle.js?client=…` 서빙 확인 | `/ja/personality-type/`, `/ja/compatibility/`, `/ja/age-calculator/`, `/blog/barnum-effect-psychology`, `/blog/ja/couple-compatibility-science` — **전부 1건씩 실제 서빙** |
| 경계 강제 스크립트 | `scripts/enforce-adsense-boundary.js` 존재, `--check` **통과** (`64 allowed, 225 blocked`) |
| ads.txt | 라이브 200, `google.com, pub-62417…, DIRECT` |
| robots.txt | `Mediapartners-Google` / `AdsBot-Google` 명시 허용 |

→ **`CLAUDE.md` §"AdSense 상태 — 시도 종료"는 반드시 개정되어야 한다.** 2026-06~08 사이에 AdSense 작업이 재개되었고 (커밋 `8d3f18b` "Enforce default-deny AdSense boundary" 등), 문서만 5월 상태로 남아 있다. 메모리의 "⏸ 일시정지(2026-06-15)"가 실제 상태에 더 가깝다.

## 1.2 AdSense가 허용된 표면 (default-deny 경계)

`scripts/enforce-adsense-boundary.js`의 규칙:
- 허용 = **sitemap에 등재 + noindex 아님 + meta refresh 없음** 인 것 중
  - `/{lang}/{compatibility|age-calculator|personality-type}/` (5개 로케일 = 15면)
  - `/blog/{article}` (49면)
- 그 외 전부 **차단**: 결과 페이지, 법적 페이지, 위젯, 리다이렉터, noindex 페이지, 소스 템플릿
- `js/monetization.js`에 AdSense 토큰이 없음을 런타임 검증

이 경계 설계 자체는 **정확하고 보수적이며 잘 작동한다.** 감사 중 위반 0건.

## 1.3 그러나 — 광고 슬롯이 0개다

```
저장소 전체 <ins class="adsbygoogle"> 개수 = 0
```

로더만 있고 광고 단위가 없다. 수익이 발생하려면 **AdSense 대시보드에서 Auto ads가 켜져 있어야** 한다. 그 설정 상태는 저장소에서 확인 불가.

→ `ADSENSE_REVENUE_PATH = UNKNOWN — 계정 대시보드 확인 필요`

## 1.4 ADSENSE_REJECTION_REASON

**`ADSENSE_REJECTION_REASON = "low value content" (2회 동일) — 문서 기록 기반, 원문 이메일 삭제됨. sub-cause는 UNKNOWN.**

근거: `CLAUDE.md`("가치가 별로 없는 콘텐츠"), `.omc/plans/adsense-go-forward.md`, 사용자 메모리. **원문 스크린샷/이메일은 저장소·harness에 없다.** 어떤 sub-cause(thin / 도구 본질 / scaled / 저트래픽)인지 구글이 알려주지 않았으므로 **추측 금지**. 현재 상태 확인은 AdSense Sites 패널에서만 가능 = 사용자 액션.

## 1.5 동의(CMP) 구현

| 항목 | 상태 | 증거 |
|---|---|---|
| Consent Mode v2 | **구현됨** | `js/consent-manager.js:6-30` |
| 기본값 | **글로벌 granted / EU·EEA·UK·CH denied** | `:14-30` |
| GPC / DNT 존중 | **구현됨** (`navigator.globalPrivacyControl` 포함) | `:isDNTEnabled()` |
| 게이트 대상 | AdSense + GA + Clarity 전부 | `:3` |
| 배너 | 5개 언어, 설정/전체거부/전체동의 | 라이브 확인 |

CMP 품질은 **양호**. 다만 §3에서 보듯 이것이 계측을 무력화한다.

## 1.6 ADSENSE_READINESS (준비상태만, 승인 예측 아님)

| 항목 | 판정 | 근거 |
|---|---|---|
| CONTENT_DEPTH | **PASS** | 블로그 57편, 본문 중앙값 4,148자, 3,000자 미만 1편 |
| ORIGINALITY | PARTIAL | 원본 글이나 45편이 ko 단일언어 |
| NAVIGATION | **PASS** | 과거 404 전부 해소, 고아 글 0 |
| TRUST / ABOUT | **PASS** | about·faq·disclaimer·methodology 실재 + **실사업자 정보 완전 공개**(주식회사 영제솔라·대표 김석진·사업자등록번호 550-87-01067·주소, JSON-LD 포함, 라이브 확인). 잔여 흠 = `authors/` 빈 디렉토리 |
| PRIVACY / TERMS | **PASS** | 5개 로케일 완비 |
| CONTACT | **PASS** | `contact@smartaitest.com` 단일화(116곳 일치), Email Routing 개통(커밋 `644c3f8`) |
| ADS_TXT | **PASS** | 라이브 200 |
| TECHNICAL_HEALTH | **PASS** | TTFB 0.16–0.24s, 404 정상, CSP·보안헤더 완비 |
| LOCALE_COHERENCE | **FAIL** | §Route Matrix §4 — 런타임 lang 덮어쓰기, 영어 title/FAQ, 한국어 배너·위젯 |
| BLOG_QUALITY | PASS | 인용 검증 이력 있음(25/25 실존) |
| THIN_PAGE_RISK | PARTIAL | thin 표면은 대부분 noindex로 격리. 단 `/t/{type}/` 296자 80면이 noindex로 숨겨진 상태 |
| DUPLICATION | PARTIAL | `index,follow`인데 canonical이 남을 가리키는 면 4개 + 루트 영문 canonical/hreflang이 307 `.html` URL 지목 (§Findings) |
| STALENESS | **FAIL** | JA 홈 "最終更新: 2026年1月"(8개월), 법적 페이지 날짜 4종 불일치, **`© 2025 AI Life Summary` 구 브랜드가 배포 23파일에 잔존** |
| USER_VALUE | PARTIAL | personality-type은 진짜. life-summary는 12버킷 바넘 |

---

# 2. FATEAIVERSE REFERRAL

## 2.1 실재 연결 전수 (16개 파일)

| SOURCE_SURFACE | LOCALE | 파일 수 | TARGET | UTM | rel | 클릭 계측 |
|---|---|---|---|---|---|---|
| compatibility 랜딩 | ja, ko | 2 | `fateaiverse.com/{ja,ko}/compatibility` | `utm_source=smartaitest&utm_medium=cross&utm_campaign=gunghap-funnel` | `noopener sponsored nofollow` | **없음** |
| compatibility **결과** | ja, ko | 2 | 동상 | 동상 | 동상 | **없음** |
| 블로그(궁합 주제) | ko 6편 | 6 | 동상 | 동상 | 동상 | **없음** |
| 블로그(궁합 주제) | ja 6편 | 6 | 동상 | 동상 | 동상 | **없음** |

**타깃 생존 확인 (라이브)**: `fateaiverse.com/ja/compatibility` → **302** → `/ja/compatibility/new` ✓ / `/ko/compatibility` → 302 → `/ko/compatibility/new` ✓

## 2.2 없는 곳

| 표면 | FateAIverse CTA |
|---|---|
| 홈 (전 로케일) | **✗** |
| personality-type 결과 (최고 완주율 자산) | **✗** |
| life-summary 결과 | **✗** |
| age-calculator 결과 | **✗** |
| vibe-check / kpop-match | **✗** |
| **en / zh / es 전체** | **✗** |

## 2.3 어트리뷰션

```
FATEAIVERSE_CLICK_TRACKING (SmartAItest 측) = NONE
```
CTA에 `onclick` / `gtag` / `addEventListener` 어느 것도 없다. 어트리뷰션은 **전적으로 FateAIverse 쪽이 `utm_source=smartaitest`를 읽는지**에 달려 있다. SmartAItest에서는 **몇 명이 눌렀는지 영원히 알 수 없다.**

→ `FATEAIVERSE_REFERRAL_READY = PARTIAL` (링크는 실재·정상·로케일 정합, 계측이 0)

## 2.4 REFERRAL FIT MATRIX

| 테스트 | FIT | 이유 |
|---|---|---|
| **compatibility** | **STRONG** | FateAIverse 관계/궁합과 직결. 이미 CTA 있음 |
| **life-summary / soul** | **STRONG** | "Fate Signature" 로 자연 연결. **CTA 없음 = 최대 미개척 기회** |
| marriage-compatibility / friend-compatibility | MEDIUM | 주제 정합. 단 현재 랜딩만 존재 |
| love-type | MEDIUM | 관계 주제 |
| personality-type | **WEAK** | 자기이해 도구. 운명 서사와 결이 다름 |
| age-calculator | WEAK | — |
| work-style / communication-style | WEAK | 직무/커뮤니케이션 |
| **vibe-check / kpop-match** | **NONE** | 억지 연결 금지 (지시 준수) |
| daily | — | 미구현 |

---

# 3. ANALYTICS — 사업을 측정하지 않는다 (**P0**)

## 3.1 스택

| 항목 | 값 | 증거 |
|---|---|---|
| GA4 | `G-QDH2…` | `js/consent-manager.js:253` |
| Microsoft Clarity | `v3dw…` | `js/consent-manager.js:280` |
| GTM | 없음 | — |
| Cloudflare Web Analytics | **없음** | — |
| 서버 사이드 카운트 | **없음** | 정적 사이트 |

## 3.2 치명적 결함 ①: 동의 배너를 무시하면 아무것도 측정되지 않는다

`ConsentManager.init()` (`js/consent-manager.js:136-160`):
- 저장된 동의 있음 → `applyConsent()` → GA/Clarity 로드
- GPC/DNT 켜짐 → 거부 저장 → 로드 안 함
- **그 외(= 신규 방문자 전원) → `showBanner()`만 호출. `loadAnalytics()`는 호출되지 않는다.**

→ **배너를 클릭하지 않고 떠난 방문자는 GA에 전혀 잡히지 않는다.** 동의 무관 트래픽 지표가 하나도 없으므로, **현재 GA 숫자를 트래픽 분모로 쓸 수 없다.**

## 3.3 치명적 결함 ②: `analytics-events.js`가 죽은 표면에만 붙어 있다

`js/analytics-events.js`는 **정확히 100개 페이지**에 로드된다. 그 100개의 정체:

| 페이지 | 수 | robots |
|---|---|---|
| `/{5 locales}/personality-type/t/{16 types}/` | 80 | **noindex** |
| `/ko/mood-report/**` | 13 | noindex |
| `/ko/holiday-position/**` | 7 | noindex |

**홈 0 · 테스트 랜딩 0 · 결과 페이지 0 · 블로그 0.** 라이브 확인: `/ja/`, `/ja/compatibility/`, `/blog/barnum-effect-psychology`, `/ko/` 전부 0건.

즉 `page_view` / `test_completed` / `share_clicked`가 **막다른 noindex 페이지에서만 발화한다.**

## 3.4 실제 이벤트 어휘 (전수)

| 이벤트 | 파일 수 | 상태 |
|---|---|---|
| `share_save_image` | 50 | WIRED (vibe/kpop/pt-type 면) |
| `share_copy_link` | 50 | WIRED |
| `share_invite_friend` | 30 | WIRED |
| `related_test_click` | 20 | WIRED |
| `derivative_cta_click` | 12 | WIRED |
| `vibe_check_start` / `_complete` | 10 / 10 | **WIRED — 유일한 완주 퍼널** |
| `kpop_match_start` / `_complete` | 10 / 10 | **WIRED — 유일한 완주 퍼널** |
| `referral_landing` | 10 | WIRED |
| `affiliate_impression` / `affiliate_click` | 1 / 1 | 정의됨 |
| `consent_granted` / `_accepted` / `_rejected` | 1 each | WIRED |

## 3.5 요청받은 표준 이벤트 대조

| 이벤트 | 판정 |
|---|---|
| `home_view` | **NOT_FOUND** |
| `test_impression` | **NOT_FOUND** |
| `test_start` | DEFINED (1파일) / 주력 테스트에 **NOT_FIRED** — 선택자 `[data-test-start]`가 어떤 테스트 페이지에도 없음 |
| `test_step` | **NOT_FOUND** |
| `test_complete` | 24파일이나 전부 **XP 보상 문자열**(`js/level-xp.js:23`), gtag 이벤트 아님 |
| `result_view` | **NOT_FOUND** |
| `share_preview` | **NOT_FOUND** |
| `share_click` / `share_success` | `share_clicked`/`share_completed`로 정의(`analytics-events.js:191,202`) — 그러나 §3.3로 인해 **주력 표면에서 NOT_FIRED** |
| `compare_start` / `compare_complete` | **NOT_FOUND** (비교 기능 자체가 없음) |
| `deep_dive_impression` / `deep_dive_click` | **NOT_FOUND** — FateAIverse CTA 계측 0 |
| `daily_start` / `daily_complete` | **NOT_FOUND** (daily 기능 UNREACHABLE) |
| `article_view` / `article_to_test_click` | **NOT_FOUND** |

## 3.6 PII

분석 호출에 생일·이름·이메일·자유응답이 실리는 코드 **발견되지 않음**. `js/viral-link.js:99-106`은 공유 링크에서 PII를 명시적으로 제거한다. → **PRIVACY(analytics) = PASS**

---

# 4. 실제 트래픽 / 수익

저장소에 analytics·revenue 데이터 파일이 **존재하지 않는다.** 따라서:

```
TRAFFIC                        = UNKNOWN
JA_TRAFFIC                     = UNKNOWN
ORGANIC_TRAFFIC                = UNKNOWN
TEST_COMPLETION_RATE           = UNKNOWN
SHARE_RATE                     = UNKNOWN
ADSENSE_REVENUE                = UNKNOWN
FATEAIVERSE_REFERRAL_REVENUE   = UNKNOWN
```

**0이 아니라 UNKNOWN이다.** 그리고 §3에 따르면 이 값들은 **과거로 소급해 복구할 수 없다** — 계측이 애초에 없었다.

# 5. 기타 수익 경로

`js/monetization.js`가 compatibility 결과에 넷플릭스/디즈니+ 영화 추천 섹션을 렌더한다 (ko 루트·ja·zh 확인).

- 링크: `https://www.netflix.com/`, `https://www.disneyplus.com/` — **제휴 ID·트래킹 파라미터 없는 맨 홈페이지 URL**
- 표기: `rel="noopener sponsored"` + 고지문 "**\* アフィリエイトリンクが含まれています / 제휴 링크가 포함되어 있습니다**"

→ **제휴 링크가 아닌 것을 제휴 링크라고 고지하고 있다.** 수익 0, 그리고 사실과 다른 공시. 등급 = **P1 (신뢰)**.
