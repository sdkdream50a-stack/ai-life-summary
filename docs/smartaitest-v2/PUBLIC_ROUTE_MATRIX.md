# PUBLIC ROUTE MATRIX — SMART S0

> 2026-09-08 · repo `644c3f8` · 라이브 HTTP 실측 + 파일시스템 대조 · **코드 변경 0**

---

## 0. 배포 구조 (CONFIRMED)

| 항목 | 값 | 증거 |
|---|---|---|
| 호스팅 | **Cloudflare Workers Static Assets** | `wrangler.toml` `name="ai-life-summary"`, `[assets] directory="./"` |
| 도메인 | `smartaitest.com` | `CNAME` |
| 프로덕션 브랜치 | `main` (origin = `github.com/sdkdream50a-stack/ai-life-summary`) | `git remote -v` |
| 프레임워크 | **없음 — 순수 정적 HTML** | 빌드 산출 없음, 스크립트는 생성기 |
| 빌드 | `npm run build:all` = i18n → legal → sitemap → adsense-boundary | `package.json` |
| CI/CD | **없음** (`.github/` 부재) — 배포 방식 UNKNOWN(수동 `wrangler deploy` 추정) | 파일시스템 |
| 리다이렉트 | `_redirects` (Workers 파싱) | 라이브 301 확인 |
| 헤더/CSP | `_headers` (주석은 "Netlify"라 되어 있으나 Workers가 해석) | 라이브 |
| DB / 서버 상태 | **없음** | 코드 전수 |
| cron / 스케줄 잡 | **없음** | 파일시스템 |
| 테스트 스위트 | `scripts/test-age-determinism.js` 1개뿐 | 파일시스템 |
| 시크릿 | `.silmu-deploy-secrets`는 **다른 프로젝트** 소유. 이 저장소에 시크릿 파일 없음 (값 미출력) | 파일시스템 |

### URL 정규화 — 중요
Workers Static Assets가 **확장자 없는 URL로 정규화**한다:
```
/about.html                          → 307 → /about
/blog.html                           → 307 → /blog
/blog/ja/compatibility-psychology.html → 307 → /blog/ja/compatibility-psychology
/ja/  (디렉토리)                      → 200 (리다이렉트 없음)
```
**sitemap은 이 규칙과 정합한다** — `.html` 0건, 76개 URL **전부 라이브 200 직행(리다이렉트 0)**. → 사이트맵-리다이렉트 문제 **없음**.

그러나 **페이지 안의 canonical은 정합하지 않는다**: 루트 영문 페이지들이 항상 307되는 `.html` URL을 canonical·hreflang(en/x-default)으로 선언한다 — `about.html:20`, `faq.html:20`, `contact.html:20`, `blog.html:3`, `privacy-policy.html:22`, `terms-of-service.html:20`. 그중 `faq`·`blog`는 `index, follow`이고, 나머지 4개는 `noindex, nofollow`인데 각 로케일 페이지가 hreflang으로 이들을 가리킨다.

단, 체인 하나 존재: `/terms.html` → **301** → `/terms-of-service.html` → **307** → `/terms-of-service`. (P3)

---

## 1. 규모

| 구분 | 수 |
|---|---|
| 배포 HTML 총계 | **289** |
| 그중 `noindex` | **167 (58%)** |
| sitemap.xml `<loc>` | 76 |
| sitemap-blog.xml `<loc>` | 49 |
| **색인 대상 고유 URL** | **76** (sitemap-blog.xml 49건은 sitemap.xml의 부분집합 — 합산 125는 중복 계수) |
| ko / en / ja / zh / es 파일 | 60 / 37 / 37 / 35 / 35 |
| blog | 58 |
| 루트 | 14 |

> 사이트의 **절반 이상이 검색에서 배제**되어 있다. 이는 과거 AdSense thin-content 대응으로 의도적으로 만들어진 상태이며, Japan-first 성장 전략과는 정면으로 상충한다.

---

## 2. 로케일 커버리지 매트릭스

| 테스트 / 페이지 | ko | en | ja | zh | es |
|---|---|---|---|---|---|
| personality-type | ✓ | ✓ | ✓ | ✓ | ✓ |
| compatibility | ✓ | ✓ | ✓ | ✓ | ✓ |
| age-calculator | ✓ | ✓ | ✓ | ✓ | ✓ |
| life-summary | ✓ | ✓ | ✓ | ✓ | ✓ |
| vibe-check | ✓ | ✓ | ✓ | ✓ | ✓ |
| kpop-match | ✓ | ✓ | ✓ | ✓ | ✓ |
| love-type / work-style / communication-style | ✓ | ✓ | ✓ | ✓ | ✓ |
| **friend-compatibility** | ✓ | ✓ | ✓ | **✗** | **✗** |
| **marriage-compatibility** | ✓ | ✓ | ✓ | **✗** | **✗** |
| about / contact / disclaimer / privacy / terms | ✓ | ✓ | ✓ | ✓ | ✓ |
| **mood-report** | ✓(13면) | ✗ | ✗ | ✗ | ✗ |
| **holiday-position** | ✓(7면) | ✗ | ✗ | ✗ | ✗ |
| **guide / methodology** | ✓ | ✗ | ✗ | ✗ | ✗ |
| **blog** | 45편(루트, `lang=ko`) | **0** | **6편** | **0** | **6편** |

---

## 3. 주요 라우트 실측표 (라이브 HTTP, 2026-09-08)

| ROUTE | STATUS | INDEXABLE | CANONICAL | OG:IMAGE | ADS | FATEAIVERSE | SHARE | ANALYTICS |
|---|---|---|---|---|---|---|---|---|
| `/` | 200 | index | 자기 | og-default | ✗ | ✗ | ✗ | consent-gated GA만 |
| `/ja/` | 200 | index | 자기 | og-default | ✗ | ✗ | ✗ | 동상 |
| `/ja/personality-type/` | 200 | index | 자기 | og-default | **✓ AdSense** | ✗ | ✗ | 없음 |
| `/ja/personality-type/result/` | (JS) | **noindex** | 자기 | og-default | ✗ | ✗ | X·FB (LINE 없음) | 없음 |
| `/ja/personality-type/t/{16}/` | 200 | **noindex** | 자기 | **`pt/{type}.jpg` ✓** | ✓ | ✗ | ✗ | **`analytics-events.js` ✓** |
| `/ja/compatibility/` | 200 | index | 자기 | og-default | **✓ AdSense** | **✓ CTA** | ✗ | 없음 |
| `/ja/compatibility/result/` | (JS) | **noindex** | 자기 | og-default | ✗ | **✓ CTA** | 9종 (LINE 없음, Kakao 1순위) | 없음 |
| `/ja/age-calculator/` | 200 | index | 자기 | og-default | **✓ AdSense** | ✗ | ✗ | 없음 |
| `/ja/life-summary/` | 200 | index | 자기 | og-default | ✗ | ✗ | ✗ | 없음 |
| `/ja/vibe-check/` | 200 | **noindex** | 자기 | og-default | ✗ | ✗ | 이미지저장·링크복사 | **✓ start/complete/share** |
| `/ja/kpop-match/` | 200 | **noindex** | 자기 | og-default | ✗ | ✗ | 이미지저장·링크복사 | **✓ start/complete/share** |
| `/ja/friend-compatibility/` | 200 | **noindex** | 자기 | og-default | ✓ | ✗ | ✗ | 없음 |
| `/ja/marriage-compatibility/` | 200 | **noindex** | 자기 | og-default | ✓ | ✗ | ✗ | 없음 |
| `/blog` | 200 | index | — | — | ✗ | ✗ | ✗ | 없음 |
| `/blog/{ko-post}` | 200 | index | 자기 | 포스트별 hero ✓ | **✓ AdSense** | 6편만 ✓ | ✗ | 없음 |
| `/blog/ja/{4편}` | 200 | index | 자기 | ✓ | ✓ | ✓ | ✗ | 없음 |
| `/ja/about/` `/ja/contact/` `/ja/privacy-policy/` `/ja/terms-of-service/` `/ja/disclaimer/` | 200 | index | 자기 | og-default | 일부 | ✗ | ✗ | 없음 |
| `/ads.txt` `/robots.txt` `/sitemap.xml` | 200 | — | — | — | — | — | — | — |
| `/vibe-check/` `/kpop-match/` (루트) | **301** → `/en/…` | — | — | — | — | — | — | — |
| `/ja/profile/` | **404** | — | — | — | — | — | — | — |
| 존재하지 않는 경로 | **404** (커스텀 404.html) | — | — | — | — | — | — | — |

**깨진 링크 재검증**: 과거 P0였던 홈의 `/vibe-check/`·`/kpop-match/` 404와 전 페이지 `/{lang}/profile/` 404는 **해소되었다**. 현재 JA 홈의 모든 링크가 200이다. 판정 = **SUPERSEDED**.

---

## 4. 로케일 무결성 결함 — **P0**

### 4.1 `<html lang>`이 런타임에 덮어써진다

모든 로케일 페이지의 head에 "Early Language Detection" 인라인 스크립트가 있다 (`ja/index.html:842-879`):

```js
var lang = 'en'; // default
if (saved) lang = saved;
else if (urlLang) lang = urlLang;
else if (langCodes.indexOf('ko') !== -1) lang = 'ko';   // ← 한국어가 어디에든 있으면 무조건 ko
else lang = 첫_지원언어;
document.documentElement.lang = lang;   // ← 페이지 경로를 전혀 보지 않음
```

**이 스크립트는 자신이 `/ja/` 아래에 있다는 사실을 확인하지 않는다.**

라이브 실측 (`/ja/`, 브라우저 `navigator.languages = ["ko-KR","ko","en-US","en"]`):
```
서버가 보낸 HTML:  <html lang="ja">
JS 실행 후:        document.documentElement.lang === "ko"
```

**파급**: 아래가 전부 `document.documentElement.lang`을 읽는다 —
- `js/personality-type.js:5`, `js/personality-type-result.js:5`
- `ja/compatibility/result/index.html` `currentLang`
- `js/i18n.js:2935, 3073`

→ **JA 페이지에서 결과 텍스트가 한국어(또는 영어)로 렌더된다.** 기본값이 `'en'`이므로, 지원하지 않는 언어의 브라우저(및 대부분의 크롤러 UA)는 **일본어 URL에서 영어 결과**를 본다.

### 4.2 한국어 전용 리다이렉트 배너

`js/consent-manager.js:730-772` — **287개 전 페이지에 로드**되며, `/ko/`가 아닌 모든 페이지에서 한국어 브라우저에게 최상단 고정 배너를 띄운다:

> 🇰🇷 한국어 페이지가 준비되어 있습니다 [한국어로 이동 →]

JA·EN·ZH·ES에는 **동등한 배너가 없다**. Japan-first 전략에서 **일본 페이지가 한국으로 유출시키는 유일한 장치**다. 라이브 스크린샷으로 확인됨.

### 4.3 기타 로케일 누수 (JA 표면)

| 위치 | 증상 | 증거 |
|---|---|---|
| `/ja/compatibility/result/` | **페이지 `<title>`이 영어**: "Compatibility Results - AI Compatibility Test \| AI Test Lab" | 라이브 |
| 동상 | 별자리를 **"Pisces Water"** 로 영어 표기 | 라이브 DOM `#person-a-zodiac` |
| `/ja/age-calculator/` | **JSON-LD FAQ 전체가 영어 원문** | `ja/age-calculator/index.html:953-957` |
| `/widget/` (JA 홈에서 링크됨) | **페이지 제목이 한국어**: "AI 소울 타입 위젯 - 블로그/SNS 프로필에 추가하기" | `widget/index.html` |
| `/ja/` 푸터 | "最終更新: 2026年1月" — **8개월 stale** | 라이브 |
