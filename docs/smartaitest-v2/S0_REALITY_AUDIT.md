# SMART S0 — FULL-SITE REALITY AUDIT (FINAL)

> 2026-09-08 · `/Users/seong/project/smartaitest` · HEAD `644c3f8` (main, clean, = origin/main)
> **CODE CHANGE = 0 · DEPLOY = 0 · DB WRITE = 0 · SECRET CHANGE = 0**
> 동반 문서: `TEST_ENGINE_TRUTH_MATRIX.md` · `PUBLIC_ROUTE_MATRIX.md` · `VIRAL_SHARE_AUDIT.md` · `MONETIZATION_READINESS.md` · `SMARTAITEST_V2_FINDINGS.md` · `S1_IMPLEMENTATION_BACKLOG.md`

---

## REPO

| 항목 | 값 |
|---|---|
| 경로 / HEAD | `/Users/seong/project/smartaitest` · `644c3f8` · main · **worktree clean** |
| origin | `github.com/sdkdream50a-stack/ai-life-summary` (구 브랜드명 잔존) |
| 타입 | **순수 정적 HTML** — 프레임워크·번들러·서버 없음 |
| 배포 | **Cloudflare Workers Static Assets** (`wrangler.toml` `[assets] directory="./"`) |
| CI/CD | **없음** (`.github/` 부재) — 배포는 수동 `wrangler deploy` |
| DB / 서버 상태 / cron | **없음** |
| 테스트 | `scripts/test-age-determinism.js` 1개 |
| 시크릿 | 이 저장소에 없음 (값 미출력) |

## DEPLOYMENT

Workers가 **확장자 없는 URL로 정규화**한다 (`/about.html` → 307 → `/about`). **sitemap이 이 규칙과 정합**하므로 사이트맵-리다이렉트 문제는 **없다**. 리다이렉트 체인 1건(`/terms.html` 301→307)만 존재.

## PUBLIC ROUTES

| | |
|---|---|
| 배포 HTML | **289** |
| 그중 `noindex` | **167 (58%)** |
| 색인 대상 (sitemap **고유** URL) | **76** — `sitemap-blog.xml`의 49건은 `sitemap.xml`의 완전 부분집합(교집합 49, 차집합 0). 두 파일 합산 125는 **중복 계수**다 |
| 로케일 | ko 60 · en 37 · ja 37 · zh 35 · es 35 |
| 블로그 | 57편 (ko 45 · ja 6 · es 6) — `blog/ko/`·`blog/en/`은 **빈 디렉토리** |
| 404 | 정상 (커스텀 404.html) |
| 과거 P0 깨진 링크 | **전부 해소** — JA 홈 전 링크 200 |

## TEST ENGINE TRUTH

**AI_USED = NO · LLM_USED = NO · ML/NLP_USED = NO — 전 테스트.** LLM 호출도, 모델 추론도, 서버 엔드포인트도 저장소에 존재하지 않는다. 전부 클라이언트 사이드 산술이다.

| 테스트 | 엔진 | 판정 |
|---|---|---|
| personality-type | 40문항 리커트 → MBTI 4축 | **CONFIRMED — 유일한 완전 자산** |
| compatibility | 8문항×2인 리커트 (생일은 장식) | CONFIRMED / 공유 경로에서 엔진 분기 |
| age-calculator | 7문항 고정 오프셋 | CONFIRMED (과거 랜덤 결함 해소됨) |
| vibe-check / kpop-match | 5문항 축가중 + 이미지저장 + **완주 이벤트 계측** | CONFIRMED — 그러나 **noindex** |
| love-type / work-style / communication-style | 15문항 리커트 | CONFIRMED — 공유 자산 0 |
| **life-summary / soul** | **생일 해시 % 12 고정풀** | **PARTIAL — 바넘 + 레이더가 랜덤 오염** |
| friend / marriage-compatibility | 테스트 없음, 설명 랜딩 | STATIC |
| mood-report / holiday-position (ko) | 정적 변형 페이지 | STATIC |
| **daily question** | 코드 54KB 존재, **참조 HTML 0** | **UNREACHABLE / DEAD** |

## CLAIM vs REALITY

| CLAIM | SURFACE | ACTUAL | MATCH |
|---|---|---|---|
| "自己回答式40問、16タイプ" | JA 홈 | 40문항 리커트 실재 | **YES** |
| "誕生日ハッシュの人生要約" | JA 홈 FAQ | 해시 % 12 실재 | **YES — 정직** |
| "回答別固定オフセットの年齢比較" | JA 홈 FAQ | 고정 오프셋 실재 | **YES — 정직** |
| "2人の回答差を固定加重する相性テスト" | JA 홈 FAQ | 응답 엔진 실재 | **YES** |
| "いずれも科学的評価ではありません" | JA 홈 FAQ | 정확 | **YES** |
| **"LINE、KakaoTalk に直接共有"** | JA 홈 FAQ | JA 결과면에 **LINE 부재** | **NO (P0)** |
| **"すべてのテスト結果は…9:16 / 1:1"** | JA 홈 FAQ | love/work/communication-style은 이미지 없음 | **PARTIAL** |
| **"AI性格タイプ診断"** | 페이지 `<title>` | 본문은 "Jung 1921 기반, MBTI®와 무관"이라 명시 | **NO — 자기모순** |
| **"AI相性テストしてみない？"** | Twitter 공유문구 | 리커트 고정가중 | **NO (P1)** |
| **"アフィリエイトリンクが含まれています"** | compatibility 결과 | 제휴 ID 없는 맨 URL | **NO (P1)** |
| **"リアルタイムで確認しよう！"** (バイラルハブ) | JA 홈 | 실시간 데이터 0, 카드 1개 | **NO (P1)** |
| **"All tests are free forever"** | `index.html:457` (EN 홈) | 현재는 사실. **"forever"는 되돌릴 수 없는 약속** | TRUE-BUT-BINDING (최강) |
| **"no premium tiers, or subscription requirements"** | `faq.html:55,358` | 프리미엄·구독 자체를 부정 | TRUE-BUT-BINDING |
| **"100%無料 / 隠れた料金はありません"** | JA 홈 · 25개 파일 | 현재는 사실. **미래를 봉쇄** | TRUE-BUT-BINDING |
| **"Google AdSenseの控えめな広告によって運営されています"** | life-summary FAQ, **5개 로케일** | life-summary는 광고 경계의 **차단 대상**. 라이브 `/ja/life-summary/` adsbygoogle **0건** | **NO (P1)** |
| **"심리학 이론과 AI 기술이 만나는 곳"** | `ko/methodology/index.html:27,36` og/twitter description | 같은 페이지 본문 `:382`이 "딥러닝 기반 자가학습 AI가 아니다"라고 **부정** | **NO — 자기모순** |
| "データは端末で処理。個人情報をサーバーに保存しません" | JA 홈 | 사실 (서버 없음) | **YES** |

> **핵심**: 정직성 캠페인은 **본문·FAQ 층에서는 성공했다.** 남은 허위 주장은 전부 **`<title>`·공유 문구·고지문 같은 "밖으로 나가는 층"**에 있다.

## HOME REALITY (JA 골든 표면)

| 섹션 | LIVE FEATURE? | DATA SOURCE | 판정 |
|---|---|---|---|
| Hero "気軽に始めよう" | 정적 카피 | — | STATIC (정상) |
| 테스트 그리드 6종 | 실제 링크, 전부 200 | — | **LIVE** |
| 커플 상성 배너 | 실제 링크 | — | LIVE |
| **バイラルハブ** "リアルタイムで確認しよう" | **아니오** — 5칸 그리드에 카드 1개(위젯) | **없음** | **STATIC / 허위 약속** |
| 위젯 카드 (🦊 Flame Fox) | 정적 데모 애니메이션 | 없음 | STATIC |
| 使い方 4단계 / なぜ 6항목 | 정적 | — | STATIC |
| FAQ 6문항 | 정적 | — | STATIC (내용은 정직) |
| **"142人が参加中" 류 카운터** | **저장소·라이브 어디에도 없음** (`人が参加中` 0건) | — | **NOT PRESENT** |
| **XP / Lv / 랭킹 / 카운트다운 / 시즌 이벤트** | 홈에 **표시 안 됨**. JS 7종은 로드되나 UI 없음 | — | **NOT PRESENT (JS만 잔존)** |
| 광고 | **홈에는 없음** (라이브 0건) | — | 없음 |
| "最終更新: 2026年1月" | 정적 | — | **STALE 8개월** |

> 지시문이 의심한 fake counter/ranking/countdown/Valentine은 **현재 홈에 존재하지 않는다.** 과거 정리에서 제거되었다. 다만 **"バイラルハブ + リアルタイム" 문구가 그 자리에 남아** 실체 없는 약속을 하고 있다.

## VIRAL / SHARE

`Preview == Saved Image == OG == Shared Landing` — **4개 주력 중 3개 FAIL, 1개 PARTIAL.**
- 공유 링크가 **입력 폼**으로 착지 (compatibility·life-summary·age·vibe·kpop)
- 결과별 **OG 이미지 없음** (전부 `og-default.png`)
- **LINE 부재**, Kakao 1순위
- 친구 **비교 화면 미구현**
- 유일한 결과 랜딩(`/t/{type}/`)은 **296자 noindex 스텁**

## RETENTION

| 기능 | UI | 상태저장 | 저장소 | 서버 | 실사용자 데이터 | 계측 | 리턴 루프 |
|---|---|---|---|---|---|---|---|
| Daily Question | **없음** | — | — | — | — | — | **UNREACHABLE** |
| XP / Level | 토스트·팝업만 | localStorage | 브라우저 | **없음** (`js/user-data.js:483` Firebase 미구현) | **NO** | 없음 | 없음 |
| Streak | 동상 | localStorage | 브라우저 | 없음 | NO | 없음 | 없음 |
| Badges | 동상 | localStorage | 브라우저 | 없음 | NO | 없음 | 없음 |
| Ranking / Trending / HOT | **없음** (페이지 삭제됨) | — | — | — | — | — | — |
| 재방문 이유 | **없음** | | | | | | |

→ compatibility 결과에서는 **키 불일치로 아예 발화하지 않는다** (P1-7). **RETENTION = NOT_IMPLEMENTED.**

## ADSENSE

- **라이브 실행 중**: 64면 (테스트 랜딩 15 + 블로그 49). `/ja/personality-type/` 등에서 로더 1건 서빙 확인.
- **광고 슬롯 `<ins>` = 0개.** Auto ads 설정 여부는 계정 대시보드에서만 확인 가능 → **UNKNOWN**.
- 경계 강제(`enforce-adsense-boundary.js`) **정상 작동**, 위반 0.
- CMP: Consent Mode v2, EU/UK denied 기본, GPC/DNT 존중 — **양호**.
- `ADSENSE_REJECTION_REASON = "low value content" (2회, 문서 기록)`, **sub-cause UNKNOWN**, 원문 이메일 삭제됨.
- 2026-08-31 자체 판정 = **CONDITIONAL GO**. 잔여 사용자 액션 2건 중 1건(contact@ 수신)은 `644c3f8`로 종결, **1건(GSC 수동조치 확인)은 여전히 미확인**. 이후 신청 기록 없음.
- **`CLAUDE.md`가 "제거됨·시도 종료·재시도 금지"로 남아 있어 사실과 반대다 (P0-5).**

## FATEAIVERSE REFERRAL

- **실재한다**: 16개 파일 (ja/ko compatibility 랜딩+결과 4 + ja 블로그 6 + ko 블로그 6)
- UTM 정합 (`utm_source=smartaitest&utm_medium=cross&utm_campaign=gunghap-funnel`), `rel="noopener sponsored nofollow"`, 로케일 정합(ja→ja)
- 타깃 생존: `fateaiverse.com/ja/compatibility` → 302 → `/ja/compatibility/new` ✓
- **없는 곳**: 홈 · personality-type 결과 · life-summary 결과 · age 결과 · vibe/kpop · **en/zh/es 전체**
- **`FATEAIVERSE_CLICK_TRACKING = NONE`** — SmartAItest 측 계측 0. 어트리뷰션은 전적으로 FateAIverse의 UTM 수집에 의존.

## ANALYTICS

GA4 `G-QDH2…` + Clarity `v3dw…`, 둘 다 **동의 후에만** 로드.
**동의 배너를 클릭하지 않은 방문자는 전혀 측정되지 않는다.** 동의 무관 트래픽 지표 없음(Cloudflare Web Analytics 미사용).
`js/analytics-events.js`는 **noindex 말단 100면에만** 로드 — 홈·테스트·결과·블로그 0.
실제 발화 이벤트: `vibe_check_*`, `kpop_match_*`, `share_save_image`, `share_copy_link`, `share_invite_friend`, `related_test_click`, `derivative_cta_click`, `referral_landing`.
요청받은 표준 이벤트 17개 중 **주력 표면에서 발화하는 것 0개.**
분석 호출 PII = **없음 (PASS)**.

## TRAFFIC — UNKNOWN이 아니다 (기록 발견)

harness에 GSC Search Analytics API 실측 기록이 있다.

| 지표 | 값 | 출처·시점 |
|---|---|---|
| 7/19 이전 일 노출 / 클릭 | 110–253 / 7–25 | `TRAFFIC-DROP-DIAGNOSIS-2026-08-19.md` |
| **7/20 절벽** | 253 → 56, 이후 일 노출 **5–42 (−90%)** | 동상 |
| 원인 | **7월 코어 업데이트 + AI Overviews** (배포·색인·CTR 가설은 전부 기각) | 동상 |
| `/ko/compatibility/` 30d 대 30d | 노출 2,130 → 29 / 클릭 157 → 3 | 동상 |
| **`/ja/compatibility/` 30d 대 30d** | **노출 631 → 111** | 동상 |
| `/en/compatibility/` | 841 → 246 | 동상 |
| `/es/compatibility/` | 225 → 9 | 동상 |
| **최근 28일 (≈8/03–8/31)** | **클릭 57 · 노출 321 · 26일** | `GO-NOGO.md` 게이트 C-3 |
| 블로그 색인률 | **44/49 = 89%** | 동상 |
| **AdSense 수익 (역사적)** | **월 $0.3 ~ $6** | `smartaitest-fateaiverse-funnel-0819/task.md:44` |
| 사용자 결정 (8/19) | **C. 관망 + 주간 모니터링** (회복 기준 = 일 노출 50+) | 진단서 §6 |

**8/19 이후 재측정 기록 없음** → 현재(9/8) 값은 **UNKNOWN**. 주간 체크 스크립트 `tools/weekly-gsc-check.sh`가 harness에 있으나 실행 산출물이 없다.

> **Japan-first 근거 데이터**: 코어 업데이트에서 한국어 궁합 쿼리 패밀리는 **-98.6%로 전멸**했고, 일본어는 **-82%로 상대적 생존**했다. 한국 기반이 무너진 상태이므로 Japan-first 피벗은 데이터와 정합한다.

## REVENUE

```
ADSENSE_REVENUE (현재)              = UNKNOWN (역사적 월 $0.3~6, 슬롯 0개)
FATEAIVERSE_REFERRAL_REVENUE        = UNKNOWN (SmartAItest 측 계측 0)
AFFILIATE_REVENUE                   = 0 (제휴 ID 없는 맨 링크)
PREMIUM                             = 없음 (그리고 25면이 "영구 무료"를 약속)
```

## SEO

sitemap 125 URL, 형태 정합, 고아 글 0, 블로그 본문 중앙값 4,148자(3,000자 미만 1편) — **콘텐츠 기술 위생은 양호**.
문제는 **구조**:
- 사이트의 58%가 noindex, JA 실효 색인 블로그 4편
- `index,follow`인데 canonical이 남을 가리키는 면 4개
- **루트 영문 페이지의 canonical·hreflang이 항상 307되는 `.html` URL을 가리킨다** — `faq.html:20`·`blog.html`은 `index,follow`인데 canonical이 `…/faq.html`(라이브 **307**). about/contact/privacy/terms는 canonical이 `.html`이면서 동시에 `noindex,nofollow`인데, `/ko/about/` 등이 hreflang으로 **그 noindex 페이지를 en·x-default로 지목**한다 → 다국어 클러스터 파손
- **구조화 데이터 언어 불일치 8건** (S1 중 JSON-LD 실파싱으로 확정 — 최초 grep 추정 "24면/100문항"은
  FAQPage 밖 스키마의 `name` 까지 센 오류였다. `SMARTAITEST_V2_FINDINGS.md` §측정 방법 정정 참조).
  S1-7에서 제거 완료.
- **색인 가능한 사이트맵 고아 3건**: `/friend-compatibility/`·`/marriage-compatibility/`·`/widget/` — robots 메타 없음(=색인 허용), 라이브 200, 두 사이트맵 모두 부재

## TRUST

| 항목 | 상태 |
|---|---|
| About / FAQ / Disclaimer / Privacy / Terms | 5개 로케일 완비 |
| Methodology | ko만 |
| Contact | **`contact@smartaitest.com` 단일화 (116곳 일치)** · Cloudflare Email Routing 개통 확인 |
| 저자 표기 | "AI Test Lab 편집팀" — 가상 전문가 **없음** ✓ |
| 날조 후기 | **제거됨** ✓ (커밋 `6dda835`) |
| 영양제 효능 광고 | **제거됨** ✓ |
| `authors/` | **빈 디렉토리** |
| 과학 면책 | 홈 FAQ·테스트 본문에 존재 ✓ |
| **운영주체** | **완전 공개 — 사이트 최강 신뢰 신호** · 주식회사 영제솔라(Yeongje Solar Co., Ltd.) · 대표 김석진 · 사업자등록번호 550-87-01067 · 경북 영천시 천문로 188-5 (`about.html:46,50,475`, `en/about/index.html:452`, `ja/about/index.html:178`, JSON-LD 포함). **라이브 `/about` 확인** |
| 날짜 정합 | **FAIL** — "2026年1月"(8개월 stale) + 법적 페이지 4종 불일치(Jan 1 / Jan 31 / Mar / May 9 2026) |
| **구 브랜드 잔존** | **FAIL** — `© 2025 AI Life Summary` 가 **배포 23개 파일** 푸터에 남아 있다 (contact 6면 전부 + life-summary 계열 + blog.html·generate.html·archive.html). 연도(2025)·브랜드(구명) 둘 다 틀렸고, 헤더는 "AI Test Lab"이라 **한 사이트가 자기를 두 이름으로 부른다** |
| terms 중복 | `terms.html` → **301** → `terms-of-service.html` (라이브 확인). 내용은 상이하나 리다이렉트로 격리됨 |
| `scripts/templates/**` 유출 | **없음** — `.assetsignore`가 `scripts/` 제외. 라이브 `/scripts/templates/index.html` = **404** 확인 |

## JAPAN UX

| 항목 | 판정 |
|---|---|
| 어색한 일본어 | 감사 범위에서 미검출 (원어민 검증은 **3라운드 연속 미수행** — `GO-NOGO.md` Caveat 2) |
| **한국어 누수** | **FAIL** — 리다이렉트 배너, 위젯 페이지 제목, Kakao 1순위 |
| **영어 누수** | **FAIL** — compatibility 결과 title, 별자리 "Pisces Water", age JSON-LD FAQ |
| CTA 위계 | 홈은 명확. **결과면에 다음 행동이 약함** |
| 폰트 / 줄바꿈 / 오버플로 | **PASS** — 375·390·430px 전부 문서 수평 오버플로 0 |
| 터치 타깃 | 미측정 → UNKNOWN |
| **LINE 노출** | **FAIL — 부재** |
| **Kakao 누수** | **FAIL — JA 결과 1순위** |
| stale 시즌성 | Valentine 등 시즌 UI **홈에 없음** ✓ |
| 시각 결함 | flagship 카드 아이콘 렌더 이상 (P2-8) |
| 모바일 실기기 뷰포트 | 브라우저 창 최소폭 제약으로 **375/390/430 실촬영 실패** → iframe 계측으로 대체. 실기기 QA = **UNKNOWN** |

## PERFORMANCE

| 지표 | 실측 (curl, gzip) |
|---|---|
| JA 홈 임계 경로 총 바이트 | **≈168 KB** (HTML 19KB + CSS 7종 32.6KB + JS 10종 116KB) |
| 최대 단일 자원 | `js/i18n.js` **80 KB** |
| TTFB | `/ja/` **0.16s** · `/ja/personality-type/` 0.24s · `/blog/…` 0.47s |
| 총 전송 | `/ja/` 87KB (비압축 본문) |
| 판정 | **ADEQUATE** — 정적 사이트로서 양호 |

> 주의: 이전 세션의 헤드리스 Lighthouse 54/44는 **Cloudflare 봇 챌린지 측정 아티팩트**로 이미 반증되었다. 재인용 금지.

관측된 낭비: 참조 0인 JS 13개 ≈249KB + `i18n.js.backup` 315KB가 라이브 200으로 서빙됨(임계 경로는 아님). 홈에 게이미피케이션 JS 7종 ≈26KB가 UI 없이 로드됨.

## PRIVACY / SECURITY

| 항목 | 판정 |
|---|---|
| 공유 URL의 PII | **현재 생성 코드 없음 (PASS)** — `js/viral-link.js:99-106`이 명시적으로 제거 |
| 레거시 리스크 | `?a=YYYYMMDD&b=…&na=…&nb=…` **읽는 코드는 생존** → 과거 유포 링크는 여전히 두 사람의 생일·이름 노출 (**P1**) |
| 결과 URL의 세션/내부 ID | 없음 |
| 분석 PII | **없음 (PASS)** |
| 두 사람 정보 저장 | localStorage `compatibility-data`만. **서버 전송 0** |
| CSP / 보안 헤더 | `_headers`에 CSP·HSTS·nosniff·frame-options·referrer-policy 완비 |
| 결제 정보 | 없음 |

---

# VERDICT

```
VIRAL_READY                  = NOT_READY
FATEAIVERSE_REFERRAL_READY   = PARTIAL
ADSENSE_READY                = PARTIAL (계정 상태 UNKNOWN, 신청 미실행)
```

## TOP 3 FLAGSHIP

| # | 테스트 | WHY | 완주 마찰 | 공유력 | SEO 잠재력 | FateAIverse 적합 | 수익 적합 |
|---|---|---|---|---|---|---|---|
| **1** | **personality-type** | 사이트에서 **유일하게 완전한 자산**. 40문항 진짜 채점, 정체성 라벨("INTP 論理学者"), 4축 시각화, 16타입 랜딩 + 타입별 OG 이미지가 **이미 존재**. AI 주장을 뺄 필요조차 없이 본문이 이미 정직 | **높음(40문항)** — 최대 약점 | **최고** (자기표현형) | **최고** — `/t/{16}/`×5로케일 = 80면이 준비돼 있음(현재 296자 noindex) | WEAK | **AdSense 최적** |
| **2** | **compatibility** | 유일한 2인 테스트 = 구조적 뷰럴. FateAIverse CTA가 **이미 붙어 있고** UTM도 정합 | 중간(8문항×2) | 중 (커플 점수는 개인 표현 아님) | 중 — 코어 업데이트 직격 이력 | **STRONG** | **Referral 최적** |
| **3** | **vibe-check / kpop-match** | **완주·공유 이벤트가 실제로 계측되는 유일한 테스트**. 5문항(최저 마찰) + 이미지 저장 내장 + 본문 25k·35k자 | **최저** | 높음 | 잠재 최고, **현재 noindex로 봉인** | NONE(억지 금지) | 트래픽 유입용 |

## PROMOTE / KEEP / DE-EMPHASIZE / REMOVE / VERIFY_FIRST

| 대상 | 판정 | 이유 |
|---|---|---|
| **personality-type** | **PROMOTE** | 유일한 완전 자산 + 이미 있는 80개 타입 랜딩 |
| **vibe-check / kpop-match** | **PROMOTE (단 VERIFY_FIRST)** | 계측·이미지·분량 완비. **noindex 해제 전 원어민 품질 검증 필수** |
| **compatibility** | **KEEP + 수리** | 엔진 분기(P1-2)·LINE·공유 랜딩 |
| life-summary / soul | **VERIFY_FIRST** | 12버킷 바넘 + 레이더 랜덤(P1-5). 존치하려면 정직 고지 유지 + 랜덤 제거 |
| age-calculator | KEEP | 엔진 정상, 정직 |
| love / work / communication-style | **DE-EMPHASIZE** | 엔진은 정상이나 결과 랜딩·이미지·공유 자산 0 |
| friend / marriage-compatibility | **DE-EMPHASIZE** | 테스트 없는 랜딩, noindex, 홈 미링크, zh/es 부재 |
| mood-report / holiday-position (ko) | KEEP (동결) | ko 전용, 안정, 손대지 않음 |
| **バイラルハブ 섹션** | **REMOVE 또는 실체화** | "リアルタイム" 허위 약속 + 카드 1개 |
| **위젯** | **VERIFY_FIRST** | JA 홈에서 링크되는데 페이지 제목이 한국어 |
| XP / Level / Streak / Badges | **VERIFY_FIRST** | 서버 없음·compatibility에서 미발화. 진짜 리텐션 기능으로 만들지, 걷어낼지 결정 필요 |
| Daily Question | **REMOVE (코드)** | 도달 불가 54KB |
| 참조 0 JS 13종 + i18n.js.backup | **REMOVE** | 564KB dead weight, 라이브 서빙 중 |
| 블로그 | **KEEP + JA 증설** | 기술 위생 양호. ja 실효 4편이 병목 |
| AdSense | **KEEP (경계 유지)** | 경계 설계는 정확. 계정 상태만 확인 필요 |
| FateAIverse CTA | **PROMOTE** | 확장 대상 (life-summary·en/zh/es·홈) |
| 제휴(넷플릭스/디즈니) 섹션 | **REMOVE 또는 진짜 제휴화** | 현재 허위 고지 + 수익 0 |

---

# NEXT_EXACT_TASK

**S1 — Truth / Trust / Canonical** (사용자 승인 후 착수).

착수 전 사용자에게 보고할 4가지 = 이 문서 상단 + `S1_IMPLEMENTATION_BACKLOG.md` §0.
