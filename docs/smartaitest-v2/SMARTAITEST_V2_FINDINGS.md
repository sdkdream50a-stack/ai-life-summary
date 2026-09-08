# SMARTAITEST V2 — S0 FINDINGS (심각도순)

> 2026-09-08 · repo `644c3f8` · 전건 코드/라이브 증거 · **코드 변경 0**
> 심각도: **P0** 신뢰·기능·거짓주장·보안·수익경로 장애 / **P1** viral·referral·adsense 준비도 직접 영향 / **P2** UX·SEO·polish / **P3** nice-to-have

---

## P0

### P0-1 · `<html lang>`이 런타임에 덮어써져 JA 페이지가 다른 언어로 렌더된다
`ja/index.html:842-879` (전 로케일 동일 인라인 스크립트). 페이지 경로를 보지 않고 `navigator.languages`/localStorage로 `document.documentElement.lang`을 덮어쓴다. 기본값 `'en'`.
**라이브 증거**: `/ja/` 접속 시 서버는 `<html lang="ja">`를 보냈으나 JS 실행 후 `document.documentElement.lang === "ko"`.
**파급**: `js/personality-type.js:5`, `js/personality-type-result.js:5`, compatibility 결과의 `currentLang`, `js/i18n.js:2935/3073`이 모두 이 값을 읽는다 → **일본어 URL에서 결과 텍스트가 한국어/영어로 나온다.** 크롤러 UA(대개 en-US)도 마찬가지.
**왜 P0**: Japan-first 전략의 토대가 붕괴. 동시에 로케일 불일치 = 검색 품질 신호 악화.

### P0-2 · 일본 결과 화면에 LINE이 없고 Kakao가 1순위다
라이브 `/ja/compatibility/result/` 공유 버튼 실측: `Kakao, X, Facebook, Instagram, Threads, Telegram, Reddit, Pinterest, LinkedIn` — **LINE 없음**.
JA 전체에서 LINE 버튼 보유 파일 **1개**, Kakao 보유 **12개**. `shareToLine()`은 `js/share.js:282` 등 3곳에 구현돼 있으나 렌더되지 않는다.
동시에 JA 홈 FAQ는 "**LINE**、KakaoTalk に直接共有"를 약속한다 → **약속 위반**.

### P0-3 · 한국어 전용 리다이렉트 배너가 모든 비-ko 페이지에서 뜬다
`js/consent-manager.js:730-772`. 287개 전 페이지에 로드. 한국어 브라우저에게 `/ja/`에서도 최상단 고정 배너 "🇰🇷 한국어 페이지가 준비되어 있습니다 [한국어로 이동 →]"를 띄운다. **ja/en/zh/es에는 동등물이 없다.** 라이브 스크린샷 확인.
**왜 P0**: Japan-first 사이트가 일본 표면에서 한국으로 유출시키는 유일한 장치.

### P0-4 · 사업 퍼널이 전혀 계측되지 않는다
`js/analytics-events.js`는 **정확히 100개 페이지**에만 로드되고, 그 100개가 전부 **noindex 말단 페이지**다 (MBTI 타입면 80 + ko mood-report 13 + ko holiday-position 7). 홈 0 · 테스트 랜딩 0 · 결과면 0 · 블로그 0 (라이브 확인).
추가로 `ConsentManager.init()`(`js/consent-manager.js:136-160`)이 **동의 배너를 클릭하지 않은 방문자에게 GA/Clarity를 아예 로드하지 않는다.**
결과: `home_view`·`test_start`·`test_complete`·`result_view`·`share_click`·`deep_dive_click` — **전부 NOT_FIRED**. 완주 퍼널이 계측되는 테스트는 `vibe-check`·`kpop-match` 둘뿐이고 그 둘은 noindex다.
**왜 P0**: 뷰럴 성장 전략을 계측 없이 운영할 수 없고, 이 손실은 **소급 복구 불가능**하다.

### P0-5 · 프로젝트 CLAUDE.md가 사실과 다르다 (AdSense)
`CLAUDE.md`: "AdSense 코드 **제거됨** · 시도 **종료** · **재시도 금지**".
**실제**: 저장소 64면에 AdSense 로더, 라이브 `/ja/personality-type/`·`/ja/compatibility/`·`/ja/age-calculator/`·블로그에서 **실제 서빙 중**. `scripts/enforce-adsense-boundary.js`가 이를 강제·검증하고 `--check` 통과(`64 allowed / 225 blocked`).
**왜 P0**: 다음 세션이 이 문서를 정본으로 믿으면 잘못된 판단을 한다.

---

## P1

### P1-1 · 공유 링크가 결과를 보여주지 않는다 (뷰럴 루프 단절)
`js/compatibility-share.js:17-23` `generateShareUrl()` 라이브 반환값 = `https://smartaitest.com/ja/compatibility/` — **입력 폼**. life-summary·age-calculator·vibe-check·kpop-match도 파라미터 없는 결과 URL을 공유하므로 친구는 입력 화면으로 리다이렉트된다.
유일한 예외가 personality-type(`/{lang}/personality-type/t/{type}/`)인데, 그 랜딩은 **296자 `noindex` 스텁**이다.

### P1-2 · 같은 커플이 링크로 다시 보면 점수가 달라진다 (엔진 분기)
결과 페이지가 `?a=&b=` 파라미터를 우선 읽고, 그 경우 응답이 없으므로 **구 생일 해시 엔진**으로 폴백한다.
**브라우저 실측 (동일 두 사람)**: 응답 엔진 **68점** vs 생일 해시 엔진 **61점**. 5축도 전부 상이.

### P1-3 · 결과별 OG 이미지가 없다 — 모든 공유가 같은 그림으로 나간다
홈·테스트·결과 전 페이지 `og:image` = `https://smartaitest.com/assets/images/og-default.png`.
`/assets/images/pt/{16타입}.jpg`가 **존재하는데 `/t/{type}/` 페이지에서만 쓰인다**.

### P1-4 · 공유 문구가 사이트 밖으로 "AI" 허위 주장을 내보낸다
`ja/compatibility/result/index.html` Twitter 공유 문구: `'AI相性テストしてみない？🥰'` (ko/zh/es 동일 패턴). 실제 엔진은 8문항 리커트 고정가중.
(참고: `copyViralLink()` 쪽 문구에서는 이미 "AI"가 제거되어 부분 교정 상태 — 전파 누락.)

### P1-5 · life-summary 결과가 새로고침마다 바뀐다
`js/radar-chart.js:131` — `humor: Math.floor((traits.creativity || 70) * 0.9 + Math.random() * 10)` → **traits가 있어도 항상 랜덤이 더해진다.**
`js/radar-chart.js:112` `getViralCopy()` → 카피를 `Math.random()`으로 선택.
`ja/life-summary/result/index.html:1396-1403`이 이 둘을 실제로 호출한다. "같은 입력 = 같은 결과" 약속 위반.

### P1-6 · 제휴가 아닌 링크를 "제휴 링크"라고 고지한다
`js/monetization.js` — 6개 compatibility 결과면 전부에서 렌더. 링크는 `https://www.netflix.com/` / `https://www.disneyplus.com/` (제휴 ID·파라미터 **없음**)인데 고지문은 "アフィリエイトリンクが含まれています / 제휴 링크가 포함되어 있습니다".
수익 0 + 사실과 다른 공시.

### P1-7 · 게이미피케이션이 compatibility 결과에서 절대 발화하지 않는다
`ja/compatibility/result/index.html:1447-1449`가 `localStorage['compatibility-person1-birth']`를 읽는데 **이 키를 쓰는 코드가 저장소에 없다** → 항상 early return. XP·배지·스트릭·레벨업이 이 화면에서 한 번도 실행되지 않는다.
더 근본적으로 `js/user-data.js:483`은 "Firebase sync not implemented — using localStorage only" — **XP/레벨/스트릭 전체가 브라우저 로컬이며 서버 상태가 없다.** 실제 사용자 데이터가 아니다.

### P1-8 · 친구 초대 링크가 로케일을 잃는다
`js/viral-link.js` `baseUrl` 기본값 `https://smartaitest.com/compatibility/` → `_redirects`에 의해 **`/en/compatibility/`로 301**. 일본어 사용자의 초대 링크가 친구를 영어 페이지로 보낸다.
(라이브에서는 `userData.year`가 `undefined`라 `window.currentViralLink`가 결과 URL로 폴백 — 어느 쪽이든 친구는 결과를 못 본다.)

### P1-9 · Japan-first인데 콘텐츠가 88% 한국어다
블로그 실측: 루트 45편 전부 `<html lang="ko">`, `blog/ja/` 6편, `blog/es/` 6편, `blog/ko/`·`blog/en/`은 **빈 디렉토리**.
그중 JA의 **실효 색인 가능 글은 4편**뿐이다 (`blog/ja/compatibility-psychology.html`은 noindex, `blog/ja/compatible-couples-psychology.html`은 canonical이 남을 가리킴).

### P1-10 · "바이럴 허브"가 실시간을 약속하고 아무것도 없다
`ja/index.html` — `<h2>バイラルハブ</h2>` + "今すぐ参加 - リアルタイムで確認しよう！" 아래 `grid-cols-2 md:grid-cols-5` 컨테이너에 **카드 1개(위젯)만** 들어 있다. 실시간 데이터·텔레메트리 없음. 삭제된 community/ranking/daily/events/wrapped의 자리가 빈 채 문구만 남았다.
그리고 그 유일한 위젯 페이지(`/widget/`)는 **제목이 한국어**다: "AI 소울 타입 위젯 - 블로그/SNS 프로필에 추가하기".

### P1-11 · 절대적 무료 약속이 25개 배포 파일에 박혀 있다
`100%無料` / `完全無料` / `완전 무료` / `completely free` / `100% free` / `完全免费`.
대표: `ja/index.html` "すべてのテストは完全無料。隠れた料金はありません。" + FAQ "**100%無料**". 향후 프리미엄·유료 전환을 봉쇄한다.

### P1-12 · 5개 로케일 life-summary FAQ가 "AdSense 광고로 운영된다"고 말하는데 그 페이지엔 광고가 없다
`ja/life-summary/index.html:1076,1081` 외 ko/en/zh/es 동일: "本サービスはGoogle AdSenseの控えめな広告によって運営されています".
그러나 life-summary는 `enforce-adsense-boundary.js`의 **차단 대상**이다. **라이브 `/ja/life-summary/` adsbygoogle = 0건** (직접 확인). 사실과 다른 수익모델 고지가 5개 로케일 × 2곳에 있다.

### P1-13 · 구 브랜드 `© 2025 AI Life Summary`가 배포 23개 파일에 남아 있다
**contact 6면 전부** + life-summary 계열 + `blog.html`·`generate.html`·`archive.html`·일부 블로그 글.
연도(2025 vs 실제 2026)와 브랜드(구명 vs AI Test Lab) **둘 다 틀렸다.** 헤더는 "AI Test Lab", 푸터는 "AI Life Summary" → **한 사이트가 자기를 두 이름으로 부른다.** 그것도 신뢰가 가장 중요한 **연락처·저작권 표시** 면에서.
`archive.html:15`·`life-summary/archive.html:15`는 `<title>` 접미사까지 구 브랜드다.

### P1-14 · 루트 영문 페이지의 canonical·hreflang이 항상 307되는 URL을 가리킨다
| 파일 | robots | canonical |
|---|---|---|
| `faq.html:19,20` | **index, follow** | `https://smartaitest.com/faq.html` → 라이브 **307** |
| `blog.html:3` | **index, follow** | `https://smartaitest.com/blog.html` → 라이브 **307** |
| `about.html:19,20` | noindex, nofollow | `…/about.html` → 307 |
| `contact.html:19,20` | noindex, nofollow | `…/contact.html` → 307 |
| `privacy-policy.html:21,22` | noindex, nofollow | `…/privacy-policy.html` → 307 |
| `terms-of-service.html:19,20` | noindex, nofollow | `…/terms-of-service.html` → 307 |

두 겹의 문제: ① 색인 대상 2면이 **200을 내지 않는 URL을 canonical로 선언**한다. ② 나머지 4면은 `noindex,nofollow`인데 **각 로케일 페이지가 hreflang `en`·`x-default`로 이들을 지목**한다 → 다국어 클러스터가 noindex 페이지를 대표로 삼는다.
(대조: `archive.html`·`generate.html`은 확장자 없는 canonical을 쓴다 — 같은 사이트 안에서 규칙이 둘로 갈려 있다.)

### P1-15 · `ko/methodology`의 og:description이 본문과 정반대를 말한다
`ko/methodology/index.html:27,36` (og·twitter description): "**심리학 이론과 AI 기술이 만나는 곳.**"
같은 파일 `:382` 본문: "**딥러닝 기반의 자가 학습 AI가 아니며**, 개인정보를 수집하여 모델을 훈련시키지 않습니다."
검색 결과·SNS 카드에는 **본문의 부정이 보이지 않고 meta의 주장만 노출된다.**

### P1-16 · 가장 강한 무료 약속은 영어 홈에 있다
`index.html:457` — "No hidden fees, no premium tiers, no registration required. **All tests are free forever.**"
`faq.html:55,358` — "There are **no hidden fees, premium tiers, or subscription requirements.**"
(각 로케일 홈의 "완전 무료/完全無料"는 현재 상태 서술에 가까운 반면, 이 둘은 **미래를 명시적으로 봉쇄한다.**)

---

## P2

| # | 항목 | 증거 |
|---|---|---|
| P2-1 | JA compatibility 결과 **`<title>`이 영어** ("Compatibility Results - AI Compatibility Test") | 라이브 |
| P2-2 | JA compatibility 결과가 별자리를 **"Pisces Water"** 로 영어 표기 | 라이브 DOM `#person-a-zodiac` |
| P2-3 | `ja/age-calculator/index.html:953-957` **JSON-LD FAQ가 영어 원문** | 파일 |
| P2-4 | JA 홈 푸터 "**最終更新: 2026年1月**" — 8개월 stale. 법적 페이지 날짜 4종 불일치(Jan 1 / Jan 2026 / Jan 31 / May 9 2026) | 파일 전수 |
| P2-5 | `authors/` **빈 디렉토리** — 저자 신뢰 자산 미구축 | `ls authors/` |
| P2-6 | `index,follow`인데 canonical이 남을 가리키는 면 4개: `blog/compatible-couples-psychology`, `blog/healthy-relationship-signs`, `blog/ja/compatible-couples-psychology`, `blog/es/compatible-couples-psychology` | 파일 |
| P2-7 | vibe-check 동점 시 **동전 던지기**로 타입 변경 — 같은 응답이 다른 결과 | `ja/vibe-check/index.html:386` |
| P2-8 | JA 홈 flagship 카드(性格タイプ診断)의 아이콘이 우상단에 작게 렌더되고 카드 중앙이 **빈 영역** | 라이브 스크린샷 2회 |
| P2-9 | 사이트맵 미등재 글 8편 (루트 4 + ja 2 + es 2). 그중 4건은 의도적 canonical dedup, 나머지는 확인 필요 | sitemap 대조 |
| P2-10 | `/terms.html` → **301** → `/terms-of-service.html` → **307** → `/terms-of-service` (리다이렉트 체인) | 라이브 |
| P2-11 | 배포되지만 참조 0인 JS **13개 ≈ 249KB** + `i18n.js.backup` **315KB**. 라이브 200 확인 (`/js/daily-questions.js` 54,070B 등) | 라이브 |
| P2-12 | `_headers` 주석이 "Netlify"인데 실제 호스팅은 Cloudflare Workers | `_headers:1` |
| P2-13 | **색인 가능한 사이트맵 고아 3건** — `/friend-compatibility/`·`/marriage-compatibility/`·`/widget/` 루트: robots 메타 **없음**(=색인 허용), 라이브 **200**, 두 사이트맵 모두 **부재** | 라이브 + sitemap 대조 |
| P2-14 | `sitemap-blog.xml`(49)은 `sitemap.xml`(76)의 **완전 부분집합** — 차집합 0. 별도 파일로서의 가치가 없고 합산 계수 시 중복을 유발한다 | `comm` 대조 |
| P2-15 | `js/i18n.js.backup`(315KB)이 **라이브 200으로 서빙**되며, 그 안에 교정 전 문구 "AI 알고리즘이 밝혀주는", "AI 분석"이 그대로 남아 있다 | `js/i18n.js.backup:514,559` · 라이브 `/js/i18n.js.backup` = 200 |

---

## P3

- `js/i18n.js` 80KB(gzip) — 홈의 가시 텍스트는 이미 HTML에 구워져 있는데도 로드된다.
- 게이미피케이션 JS 7종(≈26KB)이 게이미피케이션 UI가 없는 **홈**에도 로드된다.
- `ko` 전용 자산(mood-report 13면, holiday-position 7면, guide 2면, methodology)이 타 로케일에 없다.
- `zh`/`es`에 friend-compatibility·marriage-compatibility 부재 (로케일 비대칭).
- `wrangler.toml` 프로젝트명이 여전히 `ai-life-summary` (구 브랜드).

---

---

## 측정 방법 정정 (2026-09-08, S1 중 발견) — **중요**

> **RED → GREEN 실측 증거**: `S1_FAQPAGE_RED_GREEN_EVIDENCE.md`
> 현재 HEAD 의 같은 가드를 `--root=` 로 fix 직전 커밋 트리에도 겨눠 **8 → 0**, parse errors **0 → 0**,
> 정상 localized 블록 **30 → 30**(손실 없음)을 출력으로 남겼다. 변형 테스트 3종으로 가드가 load-bearing 임도 증명했다.

### 무엇이 틀렸나

S1 진행 중 "비영어 로케일의 FAQPage 구조화 데이터가 영어"라는 결함을 발견하고 그 규모를
**"24면 / 약 100문항"** 으로 보고했다. **이 추정치는 틀렸다.**

| | 값 |
|---|---|
| OLD (grep 추정) | 24 surfaces / ~100 questions |
| **NEW (JSON-LD 실파싱)** | **8 mismatched FAQPage blocks / 8 files** |

### 왜 달랐나

최초 스캔이 HTML에서 `"name":` 필드를 **정규식으로 전부 세었기 때문**이다. 그 필드는
FAQPage 의 `Question.name` 뿐 아니라 같은 페이지의 다른 스키마에도 존재한다 —
`WebSite`, `SoftwareApplication`, `Organization`, `HowTo`(각 step 이 `name` 을 가진다),
`BreadcrumbList`. 그래서 FAQPage 와 무관한 이름들이 "영어 FAQ 문항"으로 집계됐다.

정정된 방법은 `<script type="application/ld+json">` 을 **실제 `JSON.parse` 한 뒤
`@type === "FAQPage"` 인 객체만** 검사하고, `@graph` 내부까지 재귀한다.
(로케일 홈 5면은 FAQPage 가 `@graph` 안에 중첩돼 있어, 최상위 `@type` 만 보면 놓친다 —
가드 구현 중 실제로 이 버그를 만들었고 25 vs 30 불일치로 발견해 정정했다.)

### 확정 사실

**불일치 8건** — 전부 가시 FAQ 는 해당 로케일로 정확히 현지화돼 있는데 FAQPage JSON-LD 만 영어:

| 파일 | 페이지 로케일 | 가시 FAQ | FAQPage JSON-LD | 불일치 |
|---|---|---|---|---|
| `{ko,ja,zh,es}/age-calculator/index.html` | ko·ja·zh·es | 각 5문항, 로케일 정확 | 영어 5문항 × 1블록 | YES |
| `{ko,ja,zh,es}/life-summary/index.html` | ko·ja·zh·es | 각 5문항, 로케일 정확 | 영어 5문항 × 1블록 | YES |

**정상이라 보존한 것 30블록** — `{ko,ja,zh,es}/compatibility`, `{ko,ja,zh,es}/personality-type`(각 2),
`{ko,ja,zh,es}/index.html`(@graph 중첩), `{ko,ja}/friend-·marriage-compatibility`,
`ko/about`, 그리고 **EN 9블록 전부**.

### 교훈 (다음 감사에 적용)

**구조화 데이터는 정규식이 아니라 파서로 센다.** 이 저장소의 감사에서 grep 휴리스틱이
규모를 12배 과대추정한 사례다. 스키마 타입 판정이 필요한 모든 항목(JSON-LD, 메타 구조)은
실제 파싱으로 검증하고, 가드도 같은 방식으로 작성한다 —
`scripts/check-s1-guards.js` guard #8 이 그 구현이다.

### 조치 (S1-7, 커밋 `3dbdd3c`)

사용자 결정: **기계번역 대신 잘못된 스키마만 제거.** 가시 FAQ·title·description·
canonical·hreflang·본문은 불변(순수 삭제 496줄 / 추가 0줄). 원어민 검수된 로케일 FAQ 가
준비되면 복원 가능하다. 가드는 "비영어 페이지의 FAQPage 는 그 페이지 언어와 일치해야 하고,
FAQPage 부재는 PASS" 로 이 상태를 고정한다.

## 반증된 것 (병렬 감사 주장 중 라이브에서 기각)

| 주장 | 출처 | 실측 | 판정 |
|---|---|---|---|
| "`scripts/templates/*.html`이 접근 제어 없이 공개 URL로 resolve된다" | claims-audit | 라이브 `/scripts/templates/index.html` = **404**. `.assetsignore`가 `scripts/` 제외 | **기각** |
| "`terms.html`은 리다이렉트 없는 고아다" | claims-audit | 라이브 `/terms.html` = **301** → `/terms-of-service.html` (`_redirects` 규칙) | **기각** |
| "`ads-manager.js`가 dead인 것은 CLAUDE.md의 AdSense 제거 기록과 정합한다" | analytics-audit | `ads-manager.js`가 dead인 건 맞으나, AdSense **자체는 라이브 64면에서 실행 중**이다. CLAUDE.md 쪽이 틀렸다 | **부분 기각** |
| "사이트맵에 리다이렉트 URL이 가득하다(전제)" | 감사 지시 전제 | 76/76 **200 직행** | **기각 — 전제 자체가 사실이 아님** |

---

## 과거 판정의 현재 유효성 (STILL_TRUE / STALE / SUPERSEDED)

| 과거 주장 | 출처 | 현재 판정 |
|---|---|---|
| "age-calculator = `Math.random()` 4곳, 새로고침마다 결과 변동" | `.omc/plans/adsense-approval-plan.md` | **SUPERSEDED** — 현재 0건, 결정론적 |
| "홈 첫 클릭이 404 (`/vibe-check/`·`/kpop-match/`)" | `.omc/plans/adsense-final-push.md` | **SUPERSEDED** — 라이브 301 정상 |
| "전 테스트 페이지 `/{lang}/profile/` 404" | 동상 | **SUPERSEDED** — 링크 제거됨(`/ja/profile/`는 404지만 아무도 링크 안 함) |
| "가짜 데이터 페이지 6종 잔존" | 동상 | **SUPERSEDED** — 디렉토리 전부 삭제 확인 |
| "vibe-check 274자·kpop-match 298자 = 스텁" | 동상 | **STALE** — 현재 각각 25,211자·35,729자 |
| "life-summary = 생일 해시 % 12 고정풀 바넘" | `.omc/plans/path-b-kickoff.md` | **STILL_TRUE** |
| "AdSense 코드 제거됨 · 재시도 금지" | `CLAUDE.md` | **STALE — 사실과 반대** |
| "거절 사유 = low value content (2회)" | `CLAUDE.md`·메모리 | **STILL_TRUE** (원문 없음, sub-cause UNKNOWN) |
| "AdSense 재신청 = CONDITIONAL GO, 사용자 액션 2건" | `GO-NOGO.md` (2026-08-31) | **STILL_TRUE** — 액션 2(contact@ MX)는 종결(`644c3f8`), **액션 1(GSC 수동조치 확인)은 미확인** |
| "7/20 코어 업데이트로 노출 -90%, 대응=관망(C)" | `TRAFFIC-DROP-DIAGNOSIS-2026-08-19.md` | **STILL_TRUE** — 8/19 이후 재측정 기록 없음 |
