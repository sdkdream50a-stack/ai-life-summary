# S1 IMPLEMENTATION BACKLOG — 제안 → **실행 완료 (2026-09-08)**

> 2026-09-08 · S0 감사 산출 · 사용자가 범위 **B (Truth + Measure)** 를 승인해 실행됨
> 실행 결과 = 브랜치 `smart-s1-truth-measure`, 커밋 `208ce59..3dbdd3c`, PR #1
> 회귀 가드 = `scripts/check-s1-guards.js` (8종), `npm run verify` 체인에 편입
>
> **S1에서 닫은 것**: P0-1 로케일 권위 · P0-2 LINE · P0-3 배너 · P0-4 계측 ·
> P1-4 공유 문구 AI 주장 · P1-6 제휴 고지 → 미해결 유지 · P1-11/16 절대 무료 약속 ·
> P1-12 AdSense 운영 주장 · P1-13 구 브랜드 · P1-15 methodology 메타 ·
> P2-1 결과면 영어 title · 그리고 통합 QA에서 새로 발견한 결과면 로케일 폴백.
>
> **S1에서 닫지 않은 것 (S2)**: P1-1 공유 랜딩 · P1-2 엔진 분기 · P1-3 결과별 OG ·
> P1-5 레이더 랜덤 · P1-7 게이미피케이션 · P1-8 초대 링크 로케일 · P1-9 JA 블로그 ·
> P1-10 바이럴 허브 · P2-* 대부분.

---

## 0. 사용자 결정이 필요한 4가지

### ① 가장 큰 P0는 무엇으로 볼 것인가
후보 2개가 성격이 다르다.

| 후보 | 성격 | 고치면 얻는 것 |
|---|---|---|
| **P0-1 로케일 런타임 덮어쓰기** | 제품 무결성 | Japan-first가 성립할 토대. 지금은 JA URL이 방문자 브라우저 언어대로 렌더된다 |
| **P0-4 퍼널 계측 부재** | 의사결정 능력 | 이후 모든 판단의 근거. **지금 안 넣으면 S1 성과를 측정할 수 없다** |

권고: **P0-4를 먼저** (계측 없이 고치면 개선 여부를 영원히 모른다), 같은 라운드에 P0-1·P0-2·P0-3을 함께.

### ② 세 축 중 무엇에 S1을 걸 것인가

| 축 | 현 상태 | 12주 관점 기대 | 필요 공수 |
|---|---|---|---|
| **AdSense** | 준비 완료·미신청. 역사적 수익 **월 $0.3~6** | 트래픽 -90% 상태에서 유의미한 수익 기대 어려움 | **거의 0** (사용자 액션 1건) |
| **FateAIverse Referral** | 링크 실재·계측 0. 상품 단가 $9.99 | **전환 1건 = AdSense 2~30개월치** | 소 (계측 + CTA 확장) |
| **Viral** | NOT_READY | 유일한 트래픽 회복 경로 (코어 업데이트는 기술 수정으로 안 돌아옴) | 대 |

권고: **Referral을 즉시 계측(저비용·고배율) + Viral을 S1 본체**. AdSense는 신청만 해두고 방치(공수 0).

### ③ S1 범위 — 3안

| 안 | 내용 | 파일 규모 | 리스크 |
|---|---|---|---|
| **A. Truth-only** | P0-1·2·3·5 + P1-4·6·10 (거짓 주장·로케일 누수만) | ~40 | 낮음 |
| **B. Truth + Measure** (권고) | A + P0-4 계측 + FateAIverse 클릭 계측 | ~60 | 낮음~중 |
| **C. Truth + Measure + Viral Loop** | B + 공유 랜딩·결과별 OG·LINE·엔진 분기 수리 | ~120 | 중 |

### ④ Blast radius 인지
- 이 사이트는 **CI/테스트가 사실상 없다** (`scripts/test-age-determinism.js` 1개). 회귀 안전망이 약하다.
- `npm run build:i18n`이 **`{lang}/**` 생성 페이지를 템플릿에서 덮어쓴다.** 과거 FateAIverse CTA가 이 때문에 소실된 이력이 있다 (`smartaitest-fateaiverse-funnel-0819` 로그 GOTCHA). → **생성물과 `scripts/templates/` 를 반드시 같은 커밋에.**
- `npm run build:adsense-boundary`가 광고 로더를 재배치한다. 모든 변경 후 `check:adsense-boundary` 필수.
- 로케일 전파 누락이 **3라운드 연속 반복된 실패 모드**다 (0714·0831·0831). 한 곳만 고치지 않는다.

---

## 1. P0 라운드 (제안)

| # | 작업 | 검증 게이트 |
|---|---|---|
| P0-4a | `js/analytics-events.js`를 **홈·테스트 랜딩·결과·블로그**에 배선 | 라이브에서 4종 표면 각 1건 이상 로드 확인 |
| P0-4b | 주력 4테스트에 `test_start` / `test_step` / `test_complete` / `result_view` 발화 추가 (`[data-test-start]` 선택자가 어디에도 없는 문제 해결) | GA4 DebugView에서 4개 이벤트 실측 |
| P0-4c | **동의 무관 트래픽 지표** 확보 — Cloudflare Web Analytics(쿠키리스) 도입 검토 | 배너 미클릭 세션도 카운트되는지 실측 |
| P0-1 | lang 감지 스크립트가 **경로 로케일을 우선**하도록 (`/^\/(en|ko|ja|zh|es)\//` 매치 시 그 값 고정) | `/ja/`에서 ko-KR 브라우저로 `documentElement.lang === 'ja'` 확인 |
| P0-2 | JA(및 전 로케일) 결과면 공유 행에 **LINE 추가**, Kakao는 ko에서만 1순위 | 라이브 `/ja/*/result/` 5면에서 LINE 버튼 존재 |
| P0-3 | 한국어 배너를 **`/ko/`에서만** 뜨게 하거나 전 로케일 대칭으로 | `/ja/`에서 ko-KR 브라우저로 배너 0건 |
| P0-5 | **`CLAUDE.md` AdSense 절 개정** — "제거됨·종료·금지" → 현재 상태(64면 라이브, 경계 강제, CONDITIONAL GO 미신청) | 문서 |

## 2. P1 라운드 (제안)

| # | 작업 |
|---|---|
| P1-1 | 공유 URL이 결과를 담도록 — 최소한 `?t={결과코드}` 또는 결과별 정적 랜딩 |
| P1-2 | `?a=&b=` 레거시 분기 제거 (엔진 분기 + PII 리더 동시 해소) |
| P1-3 | 결과별 OG — 최소한 personality-type은 이미 있는 `pt/{type}.jpg`를 결과면 og로 |
| P1-4 | 공유 문구에서 "AI" 제거 (ja·ko·zh·es **전 로케일 + `js/i18n.js`**) |
| P1-5 | `js/radar-chart.js:112,131` 랜덤 제거 → 결정론 복원 |
| P1-6 | 제휴 섹션: 진짜 제휴 링크로 바꾸거나 **고지문과 함께 제거** |
| P1-7 | 게이미피케이션 키 불일치 수정, 또는 XP 계열 전면 철수 결정 |
| P1-8 | `viral-link.js` `baseUrl` 로케일 전파 |
| P1-9 | JA 블로그 증설 (현재 실효 4편) — 분산 발행, 버스트 금지 |
| P1-10 | バイラルハブ 섹션 제거 또는 실체화 |
| P1-11 | 절대 무료 약속 완화 — **`index.html:457` "free forever"·`faq.html:55,358` "no premium tiers"가 최우선**, 그 다음 로케일 25파일 |
| P1-12 | life-summary FAQ의 "AdSense로 운영" 문구 제거 (5로케일 × 2곳) — 그 페이지엔 광고가 없다 |
| P1-13 | `© 2025 AI Life Summary` → `© 2026 AI Test Lab` (배포 23파일) + `archive` 계열 `<title>` 접미사 |
| P1-14 | 루트 영문 canonical·hreflang을 확장자 없는 형태로 통일 (`about/faq/contact/blog/privacy-policy/terms-of-service`). `archive.html`·`generate.html`이 이미 옳은 형태이므로 그쪽에 맞춘다 |
| P1-15 | `ko/methodology` og/twitter description에서 "AI 기술" 주장 제거 (본문과 정반대) |

## 3. VERIFY_FIRST (구현 전 판단 필요)

- **vibe-check / kpop-match noindex 해제** — 계측·이미지·분량이 이미 최고 수준. 다만 **원어민 품질 검증이 3라운드 연속 미수행**이라 해제 전 ja 카피 검수 필요.
- **`/t/{type}/` 80면 (296자, noindex)** — personality-type을 flagship으로 올릴 때 이 면들을 **실질 콘텐츠로 채워 색인**하는 것이 SEO+뷰럴 동시 레버. S1 최대 기회이자 최대 공수.
- **XP/Level/Streak 존폐** — 서버가 없어 진짜 리텐션이 안 된다. 서버 상태를 도입할지, 걷어낼지.

## 4. 손대지 않을 것 (S1 범위 밖)

- URL 변경 (색인 자산 보존)
- `ko/mood-report`·`ko/holiday-position`·`ko/guide`·`ko/methodology`
- AdSense 경계 로직 (`enforce-adsense-boundary.js`) — 정상 작동 중
- silmu.kr 관련 일체
- 리다이렉트 신규 추가
- `sitemap-blog.xml` 삭제 (중복이지만 GSC에 이미 제출됐을 수 있어 S1 범위 밖)

## 5. 사용자만 할 수 있는 액션 (HUMAN_ACTION_REQUIRED = YES)

1. **GSC → 보안 및 수동 조치 → 수동 조치** 확인 (`GO-NOGO.md` 게이트 C-2, 8/31 이후 미확인)
2. **AdSense Sites 패널** 현재 상태 확인 + 신청 여부 결정 (계정 액션)
3. **GSC 현재 트래픽 재측정** — 마지막 실측이 2026-08-31이다. 회복 판정 기준 = 일 노출 50+
4. (S1 범위 결정 시) 배포 권한 승인
