# TEST ENGINE TRUTH MATRIX — SMART S0

> 작성 2026-09-08 · repo `smartaitest` @ `644c3f8` (main, clean) · **코드 변경 0**
> 판정 근거 = 소스 코드 직접 확인 + 라이브 브라우저 실행. 추측 없음.

---

## 0. 판정 요약

| TEST_ID | ENGINE_TYPE | 입력 의존? | 결정론? | 등급 |
|---|---|---|---|---|
| personality-type | LIKERT_WEIGHTED (40문항) | **YES** | YES | **CONFIRMED — 유일한 진짜 자산** |
| compatibility | LIKERT_WEIGHTED (8문항×2인) | YES | YES | CONFIRMED (단, 공유 경로에서 엔진 분기 → §3) |
| age-calculator | QUESTION_RULE (7문항 고정 오프셋) | YES | YES | CONFIRMED |
| life-summary / soul | **BIRTHDAY_HASH % 12** | 생일만 | 부분 (§4 랜덤 오염) | **PARTIAL — 바넘** |
| love-type | LIKERT (15문항) | YES | YES | CONFIRMED |
| work-style | LIKERT (15문항) | YES | YES | CONFIRMED |
| communication-style | LIKERT (15문항) | YES | YES | CONFIRMED |
| vibe-check | AXIS_WEIGHTED (5문항, 인라인) | YES | **NO — 동점 시 랜덤** | CONFIRMED (noindex인데 홈 노출) |
| kpop-match | AXIS_WEIGHTED (5문항, 인라인) | YES | YES | CONFIRMED (noindex인데 홈 노출) |
| friend-compatibility | 랜딩만(본문 8.8k자, JS 0) | — | — | **STATIC/랜딩** |
| marriage-compatibility | 랜딩만(본문 8.9k자, JS 0) | — | — | **STATIC/랜딩** |
| mood-report (ko 전용) | 정적 12변형 페이지 | — | — | STATIC |
| holiday-position (ko 전용) | 정적 6변형 페이지 | — | — | STATIC |
| daily question | **UNREACHABLE** — `js/daily-questions.js`(54KB) 존재하나 참조 HTML 0건 | — | — | **DEAD CODE** |

**AI_USED / LLM_USED / ML_USED / NLP_USED = 전 테스트 NO.** 저장소 어디에도 LLM 호출·모델 추론·서버 엔드포인트가 없다. 전부 클라이언트 사이드 산술이다.

---

## 1. personality-type — CONFIRMED

| 항목 | 값 | 증거 |
|---|---|---|
| ROUTE | `/{ko,en,ja,zh,es}/personality-type/` → `/…/result/` | 파일 존재 |
| INPUTS | 40문항 5점 리커트, 개인정보 0 | `js/personality-type-data.js:120` `PT_QUESTIONS` (40개) |
| ENGINE_TYPE | LIKERT_WEIGHTED → MBTI 4축 | `js/personality-type.js:181-213` |
| ALGORITHM | `scores{E,I,S,N,T,F,J,P}` 누적, 정/역문항 `val` vs `6-val`, 축별 비교로 4글자 | `js/personality-type.js:200-213` |
| RANDOM_USED | **NO** (`Math.random` 0건) | `grep -c Math.random js/personality-type*.js` = 0 |
| OUTPUTS | 타입코드 + 이름 + 태그라인 + 설명 + 4축 % 바 + 강점/약점/궁합타입 | 라이브 실행 확인 |
| PERSISTED | `sessionStorage['pt-result']` (타입코드만) | `js/personality-type-result.js:8` |
| SHAREABLE | 공유 URL = `/{lang}/personality-type/t/{type}/` — **유일하게 실재하는 결과 랜딩** | `js/personality-type-result.js:90` |
| SCIENTIFIC_CLAIM | 페이지 본문은 정직: "Jung 1921 4축 기반, MBTI®와 무관, 진단적 동등성 주장 없음" | `ja/personality-type/result/index.html` 본문 |
| 불일치 | **`<title>` = "AI性格タイプ診断"** — 본문의 정직한 고지와 충돌 | 라이브 title |
| PRIVACY | 서버 전송 0, 개인정보 입력 0 | 코드 |
| FATEAIVERSE_RELEVANCE | WEAK | — |

**라이브 실행 결과 (2026-09-08, `/ja/personality-type/`)**: 40문항 응답 → `INTP 論理学者` / 4축 55·52·57·55% / 강점 3개 렌더. 정상 작동.

---

## 2. age-calculator (精神年齢) — CONFIRMED, 과거 결함 해소됨

| 항목 | 값 | 증거 |
|---|---|---|
| ENGINE_TYPE | QUESTION_RULE — 손으로 배정한 고정 오프셋 | `js/age-calculator.js:31-92` |
| ALGORITHM | mental = realAge + Σ(q2,q4,q5,q7 오프셋), 15~80 클램프 / energy = realAge + Σ(q1,q3,q6 + 출생월 계절 보정) | `js/age-calculator.js:33-52, 68-88` |
| RANDOM_USED | **NO** | `grep -c Math.random js/age-calculator.js` = **0** |
| 문구 선택 | `options[Math.abs(gap) % options.length]` — 결정론적 | `js/age-calculator.js:270, 287` |
| PERSISTED | localStorage | `ja/age-calculator/result/index.html` |
| SCIENTIFIC_CLAIM | JSON-LD FAQ가 정직: "illustrative entertainment, does not measure cognition" | `ja/age-calculator/index.html:953` |
| 결함 | **JA 페이지의 JSON-LD FAQ가 영어 원문 그대로** | `ja/age-calculator/index.html:953-957` |

> **STALE 정정**: `.omc/plans/adsense-approval-plan.md`가 기록한 "age-calculator = `Math.random()` 4곳, 새로고침마다 결과 변동"은 **이미 수정되어 현재 사실이 아니다**. 판정 = **SUPERSEDED**.

---

## 3. compatibility — CONFIRMED, 단 **공유 경로에서 엔진이 갈린다**

### 3.1 정상 경로 (본인이 테스트를 마친 경우)

| 항목 | 값 | 증거 |
|---|---|---|
| INPUTS | 이름 2개(선택) + **8문항 리커트 × 2인** + 생년월일 2개(**선택**) | `ja/compatibility/index.html` 인라인 스크립트 |
| ENGINE | `calculateCompatibilityFromAnswers(data, lang)` | `js/compatibility.js:321` |
| 산출 | 5축(communication/values/energy/emotional/growth) 응답 일치도 + 가중평균 | 라이브 확인 |
| 생일 역할 | **별자리 라벨 장식용만** (페이지가 명시) | `answerAnalysisUi.note` |
| 라이브 검증 | さくら(1995-03-14) × ゆうた(1993-08-22), 답변 A[4,3,2,1,5,4,3,2] B[2,1,5,4,3,2,1,5] → **68점**, `answerBreakdown` 존재 | 브라우저 실행 |

### 3.2 공유 링크 경로 — **P0 무결성 결함**

결과 페이지는 `?a=YYYYMMDD&b=YYYYMMDD` URL 파라미터를 먼저 읽고, 그 경우 **응답이 없으므로 구(舊) 생일 해시 엔진으로 폴백**한다.

```
ja/compatibility/result/index.html  (URL 파라미터 분기 → personA/personB만 구성)
    ↓ hasAnswerData() == false
js/compatibility.js:221  calculateCompatibility()
    → hashBirthdays() djb2 → seededRandom(sin(seed)*10000) → 별자리 원소 궁합
```

**동일 두 사람에 대한 두 엔진의 산출값 (브라우저에서 직접 계산):**

| 엔진 | 총점 | communication | values | energy | emotional | growth |
|---|---|---|---|---|---|---|
| 응답 기반 (본인이 본 결과) | **68** | 73 | 61 | 73 | 73 | 61 |
| 생일 해시 (공유 링크가 쓰는 것) | **61** | 60 | 60 | 68 | 60 | 60 |

→ 같은 커플이 링크를 통해 다시 보면 **다른 점수**가 나온다. `PREVIEW == SHARED LANDING` = **FAIL**.

### 3.3 부가 결함

- `?a=&b=` 링크는 **두 사람의 생년월일과 이름을 URL에 노출**한다. 현재 이 형식을 **생성하는 코드는 없다**(`js/viral-link.js:89-118`이 PII를 명시적으로 제거) → 신규 유출 없음. 그러나 **읽는 코드는 살아 있어** 과거에 유포된 링크는 여전히 동작하고 PII를 담고 있다. 등급 = **LEGACY RISK / P1**.
- 게이미피케이션 블록이 `localStorage['compatibility-person1-birth']`를 읽는데 **이 키를 쓰는 코드가 저장소에 없다** → XP·배지·스트릭이 이 화면에서 **한 번도 발화하지 않는다**. `ja/compatibility/result/index.html:1447-1449`.

---

## 4. life-summary / soul-types — PARTIAL (바넘 + 랜덤 오염)

| 항목 | 값 | 증거 |
|---|---|---|
| INPUTS | **생년월일만** (질문 없음) | `ja/life-summary/index.html` |
| ENGINE_TYPE | **BIRTHDAY_HASH** | `js/soul-types.js:345-347` |
| ALGORITHM | `hashBirthday(birthday) % 12` → 고정 12종 중 1개 | `js/soul-types.js:345-368` |
| 결과 다양성 | **12가지. 같은 생일 = 항상 같은 prose** | `SOUL_TYPES` 12개 |
| SCIENTIFIC_CLAIM | 홈 FAQ가 "誕生日ハッシュの人生要約"라고 **정직하게** 명시 | `ja/index.html` FAQ |
| PERSISTED | localStorage | — |
| **RANDOM 오염** | 결과 페이지의 레이더 차트가 **매 새로고침마다 값이 바뀐다** | 아래 |

`ja/life-summary/result/index.html:1396-1403`이 `RadarChartManager`를 실제로 호출한다. 그 안에서:

- `js/radar-chart.js:131` — `humor: Math.floor((traits.creativity || 70) * 0.9 + Math.random() * 10)`
  → `traits.creativity`가 있어도 **`Math.random()`이 항상 더해진다**. 6개 특성 중 humor는 **비결정론적**.
- `js/radar-chart.js:112` — `getViralCopy()`가 카피를 `Math.random()`으로 뽑는다. 결과 문구가 새로고침마다 바뀐다.

→ "같은 입력 = 같은 결과"라는 제품 약속이 이 화면에서 깨진다. 등급 = **P1**.

---

## 5. love-type / work-style / communication-style — CONFIRMED

| TEST | 문항 | 엔진 | 파일 |
|---|---|---|---|
| love-type | 15 | LIKERT | `js/love-type.js` (39KB) |
| work-style | 15 | LIKERT | `js/work-style.js` (37KB) |
| communication-style | 15 | LIKERT | `js/communication-style.js` (39KB) |

`Math.random` 0건. 홈 그리드에 노출됨. **결과 전용 랜딩·공유 이미지·OG 없음** — 뷰럴 자산화 안 됨.

---

## 6. vibe-check / kpop-match — CONFIRMED, 그리고 **가장 현대적인 표면**

전용 엔진 JS 파일이 없어 처음엔 UNKNOWN으로 보였으나, 인라인 스크립트(16.7KB)를 정독한 결과 **가장 잘 만들어진 두 테스트**다.

| 항목 | vibe-check | kpop-match |
|---|---|---|
| 문항 | 5문항, 선택지마다 E/I·S/N·T/F·J/P 축 가중치 | 5문항, 축 스코어링 |
| 엔진 | LIKERT/AXIS_WEIGHTED, 20개 축 배정 | AXIS_WEIGHTED |
| 결과 이미지 | **html2canvas 저장 지원** | 동일 |
| 링크 복사 | 있음 | 있음 |
| **분석 이벤트** | `vibe_check_start`, `vibe_check_complete`, `share_save_image`, `share_copy_link` | `kpop_match_start`, `kpop_match_complete`, `share_save_image`, `share_copy_link` |
| RANDOM | **1건 — 아래** | 0건 |
| robots | **noindex, follow** | **noindex, follow** |
| 홈 노출 | 상단 네비 `🔥 バイブ` | 상단 네비 `💜 K-POP` |
| 본문 분량 | 25.2k자 | 35.7k자 |

**전략적 모순**: 사이트에서 **완주 이벤트·공유 이벤트가 실제로 계측되는 유일한 두 테스트**이고, **결과 이미지 저장이 붙어 있으며, 본문도 얇지 않은데(25k·35k자)**, 둘 다 `noindex`로 검색에서 배제되어 있다. 과거 "thin 스텁"으로 판정되어 봉인된 흔적(`.omc/plans/adsense-final-push.md`: "vibe-check 274자·kpop-match 298자 = 스텁")인데, **그 판정은 현재 파일 기준으로 STALE**이다.

**결정론 결함 (P2)**: `ja/vibe-check/index.html:386`
```js
if(scores.E === scores.I && Math.random()<0.5) t = 'I' + t.slice(1);
```
E/I 동점일 때 **동전 던지기로 타입을 바꾼다**. 같은 응답이 다른 결과를 낼 수 있다.

---

## 7. friend-compatibility / marriage-compatibility — STATIC 랜딩

- `ja/{friend,marriage}-compatibility/index.html`: 본문 8.8k/8.9k자, JS는 `consent-manager.js`만, `noindex`.
- **홈에서 링크되지 않는다** (JA 홈 링크 목록에 부재).
- 테스트 기능 없음 = 설명 페이지. `ko`·`en`에도 존재, `zh`·`es`에는 부재(로케일 비대칭).

---

## 8. daily question — DEAD CODE

`js/daily-questions.js`(54KB), `js/daily-share.js`, `js/daily-test.js`가 저장소에 있으나 **어떤 HTML도 참조하지 않는다**. `/daily/` 디렉토리는 이전 정리에서 삭제되었다.

→ `DAILY_QUESTION = UNREACHABLE`. 리텐션 루프 없음.

---

## 9. 배포되지만 아무도 부르지 않는 JS (dead weight)

참조 HTML 0건인 파일 — `.assetsignore`가 `js/`를 제외하지 않으므로 **전부 프로덕션에 배포된다**:

| 파일 | 크기 | 원래 용도 |
|---|---|---|
| `js/daily-questions.js` | 54KB | 삭제된 daily 페이지 |
| `js/community-data.js` | 29KB | 삭제된 community (Math.random 14곳) |
| `js/community-feed.js` | 25KB | 동상 |
| `js/ads-manager.js` | 24KB | 구 AdSense 매니저 |
| `js/wrapped-slides.js` | 18KB | 삭제된 wrapped |
| `js/ranking-ui.js` | 16KB | 삭제된 ranking |
| `js/events-system.js` | 15KB | 삭제된 events |
| `js/common.js` | 15KB | — |
| `js/daily-share.js` | 13KB | — |
| `js/wrapped-share.js` | 12KB | — |
| `js/exit-intent.js` | 12KB | — |
| `js/wrapped-data.js` | 8KB | Math.random 13곳 |
| `js/daily-test.js` | 8KB | — |
| **합계** | **≈249KB** | |

추가로 `js/i18n.js.backup` (315KB)도 배포 대상이다.
