# SMART S2 — JA HOME AUDIT · FLAGSHIP REALITY · IA PROPOSAL

> 2026-09-08 · `/Users/seong/project/smartaitest` · **CODE CHANGE = 0 · DEPLOY = 0**
> 선행: `S0_REALITY_AUDIT.md` · `S1_IMPLEMENTATION_BACKLOG.md` · `S1_FAQPAGE_RED_GREEN_EVIDENCE.md`

---

## 1. RE-ANCHOR

| 항목 | 값 |
|---|---|
| cwd | `/Users/seong/project/smartaitest` · worktree **clean** |
| 로컬 브랜치 | `smart-s1-1-js-cache-invalidation` @ `efc7d90` |
| `origin/main` | **`511f32a`** = "Merge PR #2: SMART S1.1 — JS cache invalidation hotfix" |
| 관계 | `efc7d90`은 `origin/main`의 **조상** (병합 완료). 로컬 브랜치는 머지 커밋 1개만큼 뒤 |
| 프로덕션 대조 | 라이브 `/ja/` HTML vs 로컬 `ja/index.html` **diff = 0** (CF 챌린지 스크립트 1줄 제외) → **프로덕션 = `efc7d90` 콘텐츠 확정** |
| S1.1 해시 확인 | 라이브에서 `consent-manager.js?v=b8a8bbf4` · `analytics-events.js?v=bd7b4f55` · `i18n.js?v=b24f0661` 서빙 확인 |
| **S1.1 미적용 잔여** | 홈이 로드하는 게이미피케이션 JS 7종(`badges/level-xp/streak/user-data/auth/gamification-ui/referral`)은 **해시 없이** `../js/…` 로 로드 — S1.1 범위 밖 (해당 파일들이 변경되지 않았으므로 stale 위험은 없음) |
| S1 로케일 권위 | 라이브 `/ja/` → `documentElement.lang = "ja"` **PASS** |

**S2 착수 브랜치 권고**: `git checkout main && git pull` 후 `smart-s2-japan-home`. (현 브랜치에서 계속하면 S1.1 머지 커밋이 빠진 베이스가 된다.)

---

## 2. DATA / TRUTH FIRST — 측정 "구조"만 확인

배포 직후라 **신규 conversion 데이터는 아직 없다. UNKNOWN을 0으로 쓰지 않는다.**
아래는 값이 아니라 **배선 구조**의 실측이다 (`js/analytics-events.js` 소스 대조).

### 2.1 canonical 퍼널 실측 (`bindCanonicalFunnel`)

| 이벤트 | 발화 조건 | JA 홈 | personality-type | compatibility | age / life-summary | **vibe-check** | **kpop-match** |
|---|---|---|---|---|---|---|---|
| `home_view` | surface=home 로드 | **✅** | — | — | — | — | — |
| `test_start` | 랜딩에서 첫 응답 상호작용 | — | ✅ `.pt-likert-btn` | ✅ radio/submit | ✅ submit | **❌** | **❌** |
| `test_complete` / `result_view` | `/result/` 로드 | — | ✅ | ✅ | ✅ | **❌ (result URL 없음)** | **❌** |
| `share_click` | `[data-share] .share-btn [id^=share-]…` | — | ✅ | ✅ | ✅ | 부분 | 부분 |
| `deep_dive_click` / `_impression` | `a[href*=fateaiverse]` | — (홈에 0건) | — | **✅** | — | — | — |

### 2.2 확인된 계측 구멍 3개 (S2 판단에 직접 영향)

1. **`test_landing_view`가 존재하지 않는다.** 랜딩 페이지 로드 시 발화하는 canonical 이벤트가 0개다.
   → `home_view` → `test_start` 사이의 이탈이 **홈에서 안 눌러서인지 / 랜딩에서 안 시작해서인지 구분 불가**.
2. **홈 카드 클릭이 측정되지 않는다.** 홈에는 `test_start` 바인딩 자체가 없다(surface≠test_landing).
3. **vibe-check / kpop-match는 canonical 퍼널 밖이다.**
   - 시작 버튼 = `<button onclick="vc_start()">` → 선택자 `[data-test-start], .test-start-btn, #start-test-btn, .pt-likert-btn, .vc-option, .option-btn, .quiz-option` 중 **어느 것도 매치하지 않음**
   - 보기 버튼 실제 클래스 = `card w-full text-left p-4 …` (`.vc-option` 아님 — 선택자가 실제 마크업과 어긋나 있다)
   - `/result/` URL 부재 → `test_complete` 영구 미발화
   - 대신 레거시 `vibe_check_start/_complete`, `kpop_match_start/_complete`만 발화

> **S2 측정축 권고**: 새 taxonomy를 늘리지 않는다. **딱 1개만 추가** — 홈 카드 클릭에 `data-test-start` 속성을 붙여
> 기존 `test_start` 바인딩을 재사용하거나(가장 싸다), 그게 의미를 흐린다면 `test_landing_view` 1개.
> 둘 중 **`test_landing_view` 권고**: `test_start`의 의미(=실제 응답 시작)를 오염시키지 않고 홈→랜딩 구간을 연다.

### 2.3 측정 자체의 상한 (S0에서 이월, 여전히 유효)

GA4/Clarity는 **동의 후에만** 로드된다. 배너 미클릭 세션은 어떤 이벤트도 남기지 않는다.
→ S2 Before/After 비교는 **동의 코호트 내부 비율**로만 유효하다. 절대치 비교 금지.

---

## 3. JA HOME — CURRENT AUDIT

### 3.1 실측 뷰포트 (라이브 `/ja/`, same-origin iframe 계측)

| 폭 | 콘텐츠 폭 | **잘린 요소** | <44px 터치타깃 | h1 top | 첫 카드 top→bottom | 페이지 높이 |
|---|---|---|---|---|---|---|
| **375** | 360 | **6** | 12 | 147 | 273 → 408 | 5,346 |
| **390 (JA Golden)** | 375 | **24** | 12 | 173 | 308 → 449 | 5,698 |
| 430 | 415 | **6** | 12 | 173 | 284 → 425 | 5,464 |
| 1240 | 1225 | 0 | 19 | 224 | 398 → 762 | 4,182 |

- **CTA above fold = PASS** (375/390 모두 첫 테스트 카드가 첫 화면 안)
- **overflow 0 = 조건부 PASS** — 문서는 가로 스크롤되지 않는다. 그러나 그건 `body { overflow-x: hidden }`이 **넘친 콘텐츠를 잘라내고 있기 때문**이다.

### 3.2 【신규 P1】 375·390에서 "なぜ AI Test Lab？" 카드가 잘린다 — 근본원인 확정

```
카드 실폭      406.28px      (grid-template-columns 계산값 = 406.281px)
그리드 컨테이너  343px         → 트랙이 컨테이너보다 63px 넓다
body           overflow-x: hidden  → 넘친 63px이 "잘려서 안 보인다"
```

원인은 전역 **`word-break: keep-all`** 이다. 일본어에는 단어 경계 공백이 없어 `keep-all`이 걸리면
구두점(`、`/`。`)이 없는 문장 전체가 **분해 불가능한 한 덩어리**가 된다.

6개 카드 본문의 min-content 실측:

| 본문 | min-content |
|---|---|
| どのデバイスでも完璧に動作するレスポンシブデザイン。 | **361px** ← 범인 |
| 数秒でパーソナライズされた結果を取得。待ち時間なし、メール不要。 | 263px |
| SNSで共有できる美しい結果画像を作成。 | 260px |
| データは端末で処理。個人情報をサーバーに保存しません。 | 233px |
| すべてのテストは完全無料。隠れた料金はありません。 | 178px |
| 英語、韓国語、日本語、中国語、スペイン語で利用可能。 | 149px |

361 + padding 45 = 406. Japan-first 사이트가 JA Golden 폭에서 본문을 잘라먹고 있다.

> **정정(S2-1 QA)**: 최초 측정에서 430px를 "잘림 0"으로 적었으나 측정 오류였다(같은 세션에서 폭을 바꿔
> 재측정할 때 레이아웃 갱신 전 값을 읽었다). 재실측 결과 **430px에서도 6개가 7px씩 잘린다**
> (콘텐츠 폭 415 < 카드 406 + 좌여백 16 = 422). 이 결함은 375·390·430 **세 폭 모두**에서 발생하고
> 1280에서만 사라진다. 정정은 결론(원인 = `word-break: keep-all`, 처리 = S2-2)을 바꾸지 않는다.

### 3.3 【신규 P1】 플래그십 카드 아이콘이 16px로 렌더된다 — 근본원인 확정

S0의 P2-8("flagship 카드 아이콘 렌더 이상")의 원인:

```
.kick-bento-item.large .text-7xl  →  computed font-size: 16px   (기대: 72px)
.kick-bento-item      .text-5xl  →  computed font-size: 60px   (정상)
```

`grep -rn '\.text-7xl\|\.text-8xl' css/*.css` = **0건**. 컴파일된 Tailwind에 `text-7xl`·`text-8xl` 유틸리티가 **없다**.
→ 홈의 **유일한 대형 카드**(= 유일한 완전 자산 personality-type)만 아이콘이 죽어 있다. 위계를 표현해야 할 카드가 오히려 가장 빈약해 보인다. (1240 스크린샷에서 육안 확인)

### 3.4 섹션 인벤토리 + 판정

| # | 섹션 | 실체 | 판정 | 근거 |
|---|---|---|---|---|
| 1 | **Nav (floating)** 相性 / ソウル / 年齢 / バイブ / K-POP / ブログ | 링크 실재 | **REBUILD** | personality-type이 **nav에 없다**. 본문 위계와 정면 충돌 |
| 2 | **Hero** orb + h1「気軽に始めよう。質問で見るあなたの傾向」+ sub | 정적 | **KEEP (카피 재작업)** | 진실 정합 ✅. 그러나 약속이 없다 — "무엇을 얻는가"가 없음 |
| 3 | **Bento grid 6종** 性格タイプ(large) / 恋愛 / 会話 / ワーク / ソウル / 精神年齢 | 링크 200 | **REBUILD** | **compatibility가 그리드에 없다.** DE-EMPHASIZE 대상 3종(恋愛·会話·ワーク)이 그리드의 절반을 차지 |
| 4 | **Hashtags** `#AI診断` `#性格診断` (Instagram 외부링크) | 정적 | **REMOVE (`#AI診断`)** | §7 위반 — AI 엔진 부재. 또한 홈에서 외부로 나가는 유일한 링크 |
| 5 | **커플 배너** `<!-- Valentine's Day Special Banner -->` 💕💘💝❤️ animate-pulse | 링크 실재 | **KEEP + 탈시즌화** | 9월에 발렌타인 마크업·하트 4종 애니메이션. 문구는 「運命の相性を診断！」 |
| 6 | **バイラルハブ** 「今すぐ参加 - リアルタイムで確認しよう！」 | **grid-cols-5에 카드 1개(위젯 데모)**, 실시간 데이터 0 | **REMOVE** | §5 정면 위반. 실측 텔레메트리 0. 실체화 비용 ≫ 가치 |
| 7 | **使い方 4단계** | 정적 | **KEEP (step4 수정)** | step4「結果を比較」 = 친구 비교 화면 **미구현** (S0 확인). 빈 약속 |
| 8 | **なぜ AI Test Lab？ 6항목** | 정적 | **DE-EMPHASIZE + 재작성** | 375/390에서 **잘림**(§3.2). 「共有可能な画像」은 love/work/communication에 이미지 없음 → PARTIAL 허위 |
| 9 | **Final CTA** 相性(HOT) / ライフサマリー / 年齢計算機 | 링크 실재 | **REBUILD** | 3개 버튼 중 **flagship 0개**. `HOT` 배지는 근거 없는 인기 주장 |
| 10 | **FAQ 6문항** | 정적, 내용 정직 | **KEEP** | S1이 정직화 완료. `最終更新: 2026年9月` — **stale 해소 확인** ✅ |
| 11 | **Footer** | — | KEEP | |
| — | **블로그 섹션** | **본문에 없음** (nav·footer 링크만) | **VERIFY_FIRST** | §6 "Articles" 자리가 비어 있음 |
| — | **결과 프리뷰 / Trust / 비교** | **본문에 없음** | ADD | §6 IA의 3개 축이 통째로 부재 |

### 3.5 홈 링크 분포 — 위계가 없다는 증거

```
compatibility   5  (배너·CTA·nav·mobile-menu·footer)   ← 그리드에는 없음
life-summary    5     age-calculator 5
vibe-check      2  (nav·mobile-menu 전용)              ← 본문 노출 0
kpop-match      2  (nav·mobile-menu 전용)              ← 본문 노출 0
personality-type 1  (bento large — 아이콘 16px로 깨짐)  ← nav에 없음
love-type 1 · work-style 1 · communication-style 1
```

> **홈은 세 개의 서로 다른 메뉴가 각자 다른 우선순위를 주장하고 있다.**
> nav = 相性/ソウル/年齢/バイブ/K-POP · 본문 = 性格/恋愛/会話/ワーク/ソウル/年齢 · CTA = 相性/ソウル/年齢.
> **세 메뉴 전부에 등장하는 테스트는 ソウル(life-summary)와 年齢뿐**이며, 둘 다 S0에서 PARTIAL·KEEP 등급이다.

### 3.6 §5 FAKE / EMPTY PROMISES — 홈 실사

| 문구 | 위치 | 실체 | 판정 |
|---|---|---|---|
| 「今すぐ参加 - リアルタイムで確認しよう！」 | バイラルハブ | 실시간 데이터 0, 카드 1개 | **REMOVE** |
| `#AI診断` | Hero 하단 | AI 엔진 부재 | **REMOVE** |
| 「結果を比較」 | 使い方 step4 | 비교 화면 미구현 | **REWRITE** |
| 「共有可能な画像」(전 테스트 함의) | なぜ 카드 | love/work/communication 이미지 없음 | **REWRITE** |
| `HOT` 배지 | Final CTA 相性 | 인기 근거 데이터 없음 | **REMOVE** |
| 발렌타인 마크업 + 하트 4종 | 커플 배너 | 9월 | **탈시즌화** |
| 「100%無料 / 隠れた料金はありません」 | なぜ · FAQ2 | 현재 사실이나 미래 봉쇄 | KEEP (S0 결정 유지) |

**가짜 live users / ranking / countdown / XP / event = 홈에 0건 (재확인).** 새로 만들지 않는다.

### 3.7 §7 HERO — 홈 밖의 AI 주장 (S2 범위 판단 필요)

홈 자체의 h1·sub는 정직하다. 그러나 **홈이 링크하는 랜딩의 `<title>`이 전부 AI를 주장한다**:

```
/ja/personality-type/   AI性格タイプ診断 - 16タイプからあなたは？
/ja/compatibility/      AI相性診断 - カップルの相性を無料でチェック
/ja/age-calculator/     AI年齢計算機 - 実年齢 vs 精神年齢 vs エネルギー年齢
/ja/life-summary/       AIライフサマリー - あなたの人生を一文で
/ja/vibe-check/         AIバイブチェック - 60秒で16の馬鹿げたAI性格タイプ
```

S0가 "밖으로 나가는 층에 허위가 남아 있다"고 지목한 바로 그 층이며 **S1에서 닫히지 않았다.**
브랜드명 `AI Test Lab` / `AIテストラボ`는 §7에 따라 **유지 가능**하지만, 위 5건은 기능 주장이다.
→ **S2 범위에 넣을지 사용자 결정 필요** (홈 밖 파일 = blast radius 확대. 5로케일 전파 필요).

---

## 4. FLAGSHIP REALITY COMPARISON (프로덕션 재검증)

| 축 | **personality-type** | **compatibility** | **kpop-match** | vibe-check |
|---|---|---|---|---|
| 엔진 | 40문항 리커트 → MBTI 4축 | 8문항×2인, 응답차 고정가중 | 5문항 축가중 | 5문항 축가중 |
| **완주 마찰** | **높음 (40문항)** | 중 (2인 필요 = 구조적 마찰) | **최저 (5문항)** | 최저 |
| **결정론** | ✅ | ✅ | ✅ | **❌ `Math.random()` 동점 처리 — 같은 답이 다른 결과** |
| **JA 결과 품질** | ✅ 완전 일본어 | ✅ | **✅ `name_ja`/`tagline_ja`/`desc_ja` ×16 완비** | **❌ `_en`/`_ko`만 존재 → JA 사용자가 영어 결과를 본다** |
| `/result/` URL | ✅ 200 | ✅ 200 | **❌ 404 (인라인)** | ❌ 404 |
| LINE 공유 (S1) | ✅ | ✅ | 부분 | 부분 |
| 결과별 OG | ❌ `og-default.png` | ❌ `og-default.png` | ❌ | ❌ |
| **robots** | **index,follow** ✅ | **index,follow** ✅ | **noindex** | **noindex** |
| sitemap | ✅ | ✅ | ❌ | ❌ |
| SEO 잠재 | **최고** — `/t/{16타입}/`×5로케일 = 80면 존재(현재 noindex 296자 스텁) | 중 (코어 업데이트 직격 이력, JA 631→111) | 잠재 높음, 봉인됨 | 잠재 높음, 봉인됨 |
| **canonical 계측** | ✅ 완전 | ✅ 완전 | **❌ 퍼널 밖** | **❌ 퍼널 밖** |
| FateAIverse 적합 | WEAK | **STRONG (CTA·UTM 이미 배선)** | NONE | NONE |
| **Japan fit** | 높음 (MBTI = 일본 최대 진단 수요) | 높음 (커플/친구) | **최고 (K-POP × 일본)** | 낮음 (영어 결과) |
| 홈 노출 현황 | **1회, 아이콘 깨짐** | 5회, 그리드에는 없음 | **nav 전용 2회** | nav 전용 2회 |

### 판정

| | 결론 |
|---|---|
| **FLAGSHIP 1** | **personality-type** — 유일한 완전 자산. index,follow + 결과면 + 80개 타입 랜딩. 최대 약점은 40문항 마찰 → **홈 카드에서 "40問・約5分"을 숨기지 말고 명시**하는 편이 이탈을 앞당겨 오히려 완주율을 올린다 |
| **FLAGSHIP 2** | **compatibility** — 유일한 2인 테스트 = 구조적 바이럴 + FateAIverse 유일 흑자 경로. index,follow. §9대로 **홈에서 FateAIverse는 광고하지 않는다** (현재 홈 fateaiverse 링크 = **0건, 이미 준수**) |
| **FLAGSHIP 3 후보** | **kpop-match** — S0의 "vibe-check / kpop-match" 묶음은 **분리해야 한다.** kpop-match만 JA 완전 로케일 + 결정론. Japan fit 최고. **단 noindex·result URL 부재·퍼널 밖** → **VERIFY_FIRST, S2에서 flagship 승격 보류** |
| **탈락** | **vibe-check** — JA 결과가 영어 + `Math.random()` 비결정론. **flagship 후보에서 제외.** 홈 승격 금지 |
| DE-EMPHASIZE | love-type / work-style / communication-style — 전부 noindex, 결과 랜딩·이미지 0. **현재 홈 그리드의 3/6을 차지 중** |

---

## 5. HOME IA PROPOSAL

### 5.1 목표

`home_view` → **flagship 카드 클릭** → `test_start` 경로를 **한 줄로** 만든다.
세 메뉴(nav/그리드/CTA)의 우선순위를 **하나로 통일**한다.

### 5.2 제안 IA (§6 골격 + 실존 섹션 재사용)

| 순 | 섹션 | 출처 | 변경 |
|---|---|---|---|
| 1 | **HERO** | 기존 #2 | 카피만 재작업. orb·레이아웃 유지 |
| 2 | **何を知りたい？** 自分 / 恋愛・友だち / 今日 | **신규 (경량)** | 3개 앵커 칩. 새 페이지 0개 — 아래 섹션으로 스크롤 |
| 3 | **Flagship Tests (2)** personality-type · compatibility | 기존 #3 bento **재구성** | large 2장. `text-7xl` 버그 수정. one-line promise + 문항수/소요시간 + 결과 기대 + CTA |
| 4 | **もっと試す** 精神年齢 · ソウル · K-POP · (恋愛/会話/ワーク) | 기존 #3 나머지 | 작은 카드로 강등. flagship과 시각 등급 분리 |
| 5 | **カップルで試す** | 기존 #5 배너 | 탈시즌화. `恋愛・友だち` 앵커 착지점 |
| 6 | **使い方 4단계** | 기존 #7 | step4 문구 수정 |
| 7 | **Trust** 運営主体·端末内処理·科学的評価ではない | **신규** — 소재는 `about.html` 실존 (법인명·대표·사업자번호) | 사이트 최강 신호가 홈에 없다 |
| 8 | **記事** JA 블로그 4편 | **신규** | nav의 `/blog.html?lang=ja` 의존 탈피 |
| 9 | **FAQ 6** | 기존 #10 | 유지 |
| 10 | **Final CTA** | 기존 #9 | flagship 2개로 교체, `HOT` 제거 |
| — | ~~バイラルハブ~~ | 기존 #6 | **REMOVE** |
| — | ~~なぜ AI Test Lab？ 6항목~~ | 기존 #8 | Trust(7)로 흡수 — §3.2 잘림 문제 동시 해소 |

**nav 재정렬**: `性格タイプ · 相性 · 精神年齢 · K-POP · ブログ` — 본문 위계와 일치시킨다.

### 5.3 §10 VISUAL — Clean Pop Lab

현 홈은 `hp-dark` + 보라/핑크 그라데이션 + 파티클 블러 = **"generic AI gradient overload" 금지 항목에 해당**.
S2 방향: warm white 기조 · deep ink 텍스트 · electric indigo(주) · coral(보조) · aqua/lime 절제 ·
굵은 일본어 라벨 · 스크린샷 친화. **FateAIverse의 gold/navy 복제 금지**는 현재 위반 없음.

### 5.4 §11 MOBILE 게이트 (JA390 Golden)

| 항목 | 현재 | S2 목표 |
|---|---|---|
| CTA above fold | PASS | 유지 |
| **잘린 요소** | **375=6 / 390=24** | **0** (`word-break` 정책 수정) |
| <44px 터치타깃 | 12 | 0 (nav 링크 h=21→44) |
| 카드 높이 | 135–225px | 유지 |
| 페이지 높이 | 5,698px | 바이럴허브·なぜ 제거로 단축 |
| flagship 아이콘 | **16px** | 72px |

### 5.5 §14 배치

| 배치 | 내용 | 게이트 |
|---|---|---|
| **S2-1** | Hero 카피 · intent 칩 · nav 재정렬 · 바이럴허브 REMOVE · `#AI診断` REMOVE · `HOT` REMOVE | JA390 잘림 측정, overflow 0 |
| **S2-2** | Flagship 2 카드 + 강등 카드 · `text-7xl` 수정 · `word-break` 수정 · 터치타깃 44px · **홈 카드 계측 1개** | 계측 실발화 확인 |
| **S2-3** | Trust · 記事 · 使い方 step4 · Final CTA · 배너 탈시즌화 | 빈 약속 0, guard, Gemini GO |

---

## 6. 이번 라운드에서 하지 않은 것

- 코드 변경 · 배포 · 브랜치 생성 **0**
- **실제 conversion 수치 인용 0** — 배포 직후이므로 §2는 구조만. UNKNOWN을 0으로 쓰지 않았다
- **375/390/430 실기기 스크린샷 미수행.** 브라우저 창 리사이즈가 뷰포트에 반영되지 않아(`innerWidth`가 1240에 고정) S0과 동일한 제약. **same-origin iframe 계측으로 대체**했고 수치는 그 방식의 실측이다. 육안 스크린샷은 390 iframe 1장 + 1240 데스크톱 1장만 확보
- ko/en/zh/es 홈 미감사 (S2는 JA Golden 한정)
- AdSense 관련 변경 **0** (§12)

## 7. 사용자 결정이 필요한 3가지

1. **랜딩 `<title>`의 AI 주장 5건**(§3.7)을 S2에 넣을지 — 홈 밖 파일 + 5로케일 전파 = blast radius 확대
2. **kpop-match를 flagship 3번으로 승격할지** — 승격하려면 noindex 해제 + 원어민 품질 검증이 선행 (S0 VERIFY_FIRST 미해소)
3. **계측 1개 추가 방식** — `test_landing_view`(권고) vs 홈 카드에 `data-test-start` 부착


---

# S2-1 IMPLEMENTATION RESULT (2026-09-08)

브랜치 `smart-s2-japan-home` (base `511f32a`). 승인 범위 3개만 실행했고 S3 영역은 열지 않았다.

## 커밋

| SHA | 내용 |
|---|---|
| `b139de9` | Home 위계 재편 — Hero 진실화 · Intent 계층 · Flagship 2단 진입 (S2-1A+B) |
| `8401c27` | 실체 없는 Home 표면 제거 — 바이럴 허브 · AI 기능 해시태그 (S2-1C) |
| `eb7c53d` | S2 Home guard (mutation 8/8 red) + 문서 정정 |

> **S2-1A와 S2-1B를 한 커밋으로 묶은 이유**: Intent 칩의 앵커가 Flagship 섹션을 가리킨다.
> A만 먼저 커밋하면 `#test-personality`가 존재하지 않는 중간 상태가 생기고, 이는 지시문이
> 명시적으로 금지한 **dead CTA**다. 커밋 분할보다 깨지지 않는 단위를 우선했다.

## 편집 구조 — 템플릿은 로케일 스냅샷 저장소다

`scripts/templates/index.html`은 5개 로케일 홈의 **byte-for-byte 스냅샷**
(`<!-- I18N_PAGE_START {lang} -->` … `_END`)을 담고 `build:i18n`이 그 블록을 그대로 꺼내
`{lang}/index.html`로 쓴다. 따라서 생성물을 편집 → 스냅샷 되맞춤 → `build:all` 후
**바이트 동일** 확인이 왕복 무결성 증명이다.

## 구현 중 발견해 함께 고친 것

**히어로 400px 공백 (자체 유발 회귀).** 히어로에서 벤토 그리드를 들어내자
`css/global-kick.css`의 `.kick-mesh-bg{min-height:100vh}`가 드러나 JA390에서
콘텐츠 402px + **빈 공간 398px**가 되었다. `.kick-mesh-bg`는 랜딩 페이지 `<body>`에도
쓰이므로 전역 CSS는 건드리지 않고, 히어로 섹션에 `id="hero"`를 주어 인라인 스타일에서
`#hero.kick-mesh-bg{min-height:0}`로만 무력화했다. 결과: 히어로 800 → 447px,
Intent 섹션이 JA390 첫 화면 안으로 올라왔다.

## 처리하지 않고 남긴 것 (의도적)

| 항목 | 이유 |
|---|---|
| 「なぜ AI Test Lab？」 375/390/430 잘림 | S2-2 이월. 이 섹션은 S2-3에서 Trust로 흡수 예정이라 지금 고치면 버려질 작업 |
| 44px 미만 터치타깃 14개 | **전부 기존 요소**(nav pill·footer·로고·해시태그). **신규 섹션 미달 0개** |
| XP/level/streak/badges JS 7종 | S2-2 이월 (지시문 명시) |
| `.live-ticker` 등 죽은 인라인 CSS, 대상 없는 countdown 함수 | 기존 dead code. countdown 블록에 **살아 있는 모바일 메뉴 핸들러**가 동거하므로 통째 삭제 불가 |
| 랜딩 `<title>` AI 주장 5건 | 홈 밖 파일. DECISION 2는 **홈 title/meta 한정**이었고 홈 5로케일 title/og/description은 이미 브랜드명뿐이라 **수정할 것이 없었다** |
| ko 홈 FAQ 「AI 궁합 테스트는 어떻게 하나요?」 | 본문 FAQ + FAQPage JSON-LD. title/meta가 아니며 FAQ는 S2-3 범위. **미해결로 보고** |
| JSON-LD `alternateName: "AI Life Summary"` (5로케일) | 구 브랜드명이지 AI 기능 주장이 아니다. S0 P1-13 잔여 |
