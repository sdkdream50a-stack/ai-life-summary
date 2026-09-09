# S3-G0 — Result / Share / Viral Loop 감사

> 2026-09-09 · **CODE CHANGE = 0** · commit/push/PR/deploy 0
> 대상: production `https://smartaitest.com` @ `8312aaaa1f1a42dbcf3b5a08b5be7ce9fb4e9665`
> 방법: 실제 브라우저(Playwright/Chromium)로 두 flagship을 **완주**한 뒤 측정. 정적 추측 금지.
> 봇 챌린지 0건, 전 요청 200.

---

## 0. 측정 신뢰성 — 이번 감사에서 폐기한 오탐 2건

S2 감사의 detector 교훈을 그대로 적용해, 아래 두 초기 관찰은 **canonical evidence가 아니다.**

| 초기 관찰 | 실제 |
|---|---|
| Personality 결과 카드 "canvas 없음 → 공유 이미지 미생성" | **오탐.** `ptShareCard()`는 DOM에 붙이지 않는 **오프스크린** canvas를 쓴다. `toBlob`을 계측하니 **1080×1920 / 514,360 B PNG**가 실제로 생성되고 `my-type-ESTJ.png`로 다운로드된다. |
| Personality 4축이 전부 50% → "축 막대가 데이터에 반응하지 않음" | **오탐.** 4축 모두 문항 pole 비율이 **5:5**라, 모든 문항에 같은 값을 넣으면 `s0=s1=30` → **수학적으로 정확히 50%**가 맞다. 편향 응답을 주입하면 51/49/90/10으로 변한다. |

또한 `result_view` 등 spine 이벤트를 "호출자 없음"으로 본 초기 판단도 정정한다 — `analytics-events.js`가 **위임(delegation) 방식**으로 자동 바인딩하므로 개별 호출자가 없어도 발화한다.

**미확인 1건(정직하게 남김):** 축 주입 실험에서 응답을 반대로 뒤집었는데 표시값이 51/49/90/10으로 동일했다. sessionStorage를 직접 조작한 비-사용자 경로라 결론을 내리지 않는다. S3-1에서 **실제 퀴즈 경로로** 재확인 필요.

---

## 1. PERSONALITY

### RESULT
| 항목 | 값 |
|---|---|
| 문항 / 페이지 | 40문항 · 5문항×8페이지 |
| 완주 | landing → 8페이지 → `#pt-submit` → `/ja/personality-type/result/` |
| 결과 전달 | `sessionStorage`: `pt-result`, `pt-answers` |
| H1 | `性格タイプ診断結果` (제네릭) — **타입 라벨은 H1이 아니다** |
| 라벨 표시 | `ESTJ` 초대형 + `幹部` + 한 줄 설명 — 시각적으로는 매우 강함 |
| 콘텐츠 | 4축 막대 · 강み · 弱み · 相性の良いタイプ · 他のテスト · 理論的背景 |
| 길이 | 2.8 화면 · 본문 783자 |
| 테마 | **다크(kick)** — Clean Pop Lab 미적용 |

### SHARE_OBJECT = **YES**
1080×1920 (9:16 스토리) PNG, 514 KB, JA 로케일, 브랜딩(`smartaitest.com` / `@smartaitest` / `PERSONALITY`), 개인정보 유출 0.
**문제:** 상단 약 30% · 하단 약 25%가 빈 공간, **URL/QR 없음**, **CTA 문구 미포함**, 포맷 1종(9:16만).

### SHARE_CHANNELS
`copy` → `LINE` → `X` → `Facebook` + 카드 공유(native share) + 이미지 저장.
주 버튼 라벨 `タイプをシェアする`가 실제로는 **copy**. Japan-first 순서(LINE 우선) 아님.

### ANALYTICS
| 이벤트 | 발화 | 파라미터 |
|---|---|---|
| `result_view` | ✅ | test_type=personality-type |
| `test_complete` | ✅ | — |
| `share_click` | ✅ | locale·surface·device_type·page_path·test_type·**method**(copy/line) |
| `share_success` | ⚠️ **copy만** | line/X/facebook은 미발화 |
| `deep_dive_*` | — | personality에는 FateAIverse 없음 |

### REENTRY
공유 URL = **`/ja/personality-type/t/<type>/`** (결과 페이지가 아님 — 좋은 설계).
`/t/estj/` → 200, H1 `幹部`, og:image `assets/images/pt/estj.jpg`, CTA `このテストをやってみる →` 존재. **dead end 아님.**
**문제:** 1.1 화면 · 374자로 얇고, CTA 2개(`このテストをやってみる`·`16タイプすべて見る`)가 **같은 URL**로 감. 공유자와 비교하는 장치 없음.
`/ja/personality-type/result/`를 세션 없이 열면 → **랜딩으로 리다이렉트**(결과 안 보임).

### RETURN_REASON = **거의 없음**
`sessionStorage`뿐 → 탭 닫으면 소멸. 저장된 결과·비교·재방문 훅 0. (S2에서 제거한 dead gamification은 되살리지 않음 — 정상.)

### FATEAIVERSE = **0** (§16 value-first에 부합)

### TOP_PROBLEMS
1. 재방문 이유 0 — 결과가 세션과 함께 사라짐
2. 공유 카드의 여백 과다 · CTA/QR 부재 → 스크린샷 전파력 손실
3. `share_success`가 copy에만 연결 → 채널별 전환 측정 불가
4. `/t/<type>/` 도착지가 얇고 CTA가 중복 → 유입 후 다음 행동 약함
5. 결과 페이지 `<title>`이 `AI性格タイプ診断` — **AI 기능 주장 잔존**(신규 발견, 아래 §4)

---

## 2. COMPATIBILITY

### RESULT
| 항목 | 값 |
|---|---|
| 입력 | 이름 2개(선택) + 리커트 **16그룹**(8문항×2인) |
| 생년월일 | 폼에 date/select 입력 **없음** — 답변 없을 때만 생일 해시 폴백(문서상) |
| 완주 | `💕 相性を計算する` → `/ja/compatibility/result/` |
| H1 | `相性診断結果` (제네릭) |
| 점수 | 총점 **68%** + 5차원(61/73/73/61/73) |
| 라벨 | **`🐾 動物カップルタイプ` → `パンダとコアラカップル`** + 恋愛映画ジャンル + ラッキーデート |
| 길이 | **11.4 화면** · 본문 3,376자 |
| 테마 | 다크 — Clean Pop Lab 미적용 |

### SHARE_OBJECT = **YES(조건부)**
`📱 ストーリー 9:16` · `🖼️ フィード 1:1` 두 포맷. 단 **html2canvas를 jsdelivr CDN에서 런타임 로드**(외부 의존).

### SHARE_CHANNELS = 13종
`リンク · LINE · WhatsApp · Kakao · X · Facebook · Instagram · Threads · Telegram · Reddit · Pinterest · LinkedIn` + 이미지 2종.
**우선순위 없음** — JA 화면에 WhatsApp/Reddit/Pinterest/LinkedIn까지 동일 비중.

### ANALYTICS
`result_view` ✅ · `test_complete` ✅ · `deep_dive_impression` ✅ · `deep_dive_click` ✅ · `affiliate_impression` ✅ · `share_click` 위임 바인딩 ✅

### REENTRY = **DEAD END**
`/ja/compatibility/result/`를 세션 없이 열면 **랜딩으로 리다이렉트**. 공유 링크를 받은 친구는 **결과를 전혀 볼 수 없다.** 공유의 대상이 이미지뿐이며, 링크는 아무것도 전달하지 못한다.

### RETURN_REASON = **없음** (sessionStorage 키조차 0)

### FATEAIVERSE
`campaign=compatibility_result` · `content=deep_dive` · UTM 4파라미터. impression·click 모두 실측 발화. **primary CTA 아님** — §16 준수.

### TOP_PROBLEMS
1. **공유 링크 재진입 불가** — 바이럴 루프가 여기서 끊김
2. 11.4 화면 — 라벨과 점수가 첫 화면에 함께 있지 않음
3. 채널 13종 무순위 — Japan-first 아님
4. 결과 페이지가 **게이미피케이션/auth/monetization JS 98 KB**를 계속 로드(S2가 홈에서 제거한 계열)
5. 공유 이미지가 외부 CDN(html2canvas) 런타임 의존

---

## 3. COMMON

### DEAD_ENDS
- `/{locale}/compatibility/result/` 세션 없이 진입 → 랜딩 (결과 소실)
- `/{locale}/personality-type/result/` 세션 없이 진입 → 랜딩
- `/t/<type>/`의 CTA 2개가 동일 목적지

### MISSING_EVENTS
- `share_success`: personality는 **copy만**, 그 외 채널 미발화
- 공유 링크로 들어온 유입을 식별하는 파라미터/이벤트 없음(`share_entry` 부재)
- `result_id` 개념 자체가 없음 — 결과에 영속 식별자가 없어 재진입·비교 측정 불가

### MOBILE_ISSUES
- JA 페이지 첫 화면 상단을 **영어 전환 배너**가 점유 → 결과 인지 전에 화면 손실 (두 flagship 공통)
- Compatibility 11.4 화면
- 두 결과 모두 다크 테마 → 홈/랜딩의 Clean Pop Lab과 **시각적 불연속**

### TRUTH_RISKS
| 위험 | 상태 |
|---|---|
| Compatibility 점수의 과학성 주장 | **안전** — `結果は娯楽用であり、学術的診断・関係評価・科学的測定ではありません` 명시 |
| Personality 결과 `<title>` | ⚠️ `ESTJ 幹部 — AI性格タイプ診断` — **AI 기능 주장 잔존** |
| `/t/<type>/` `<title>` | ⚠️ `幹部 (ESTJ) — AI性格タイプ` — 동일 |
| og:title | ⚠️ `⚙️ ESTJ 幹部 — AI性格タイプ診断` |

→ pre-S3 hardening은 **27개 랜딩 표면의 visible H1**을 닫았고, S2는 **랜딩 title/og/twitter**를 닫았다. **결과·타입 페이지의 title/og는 어느 lane에도 포함된 적이 없다.** backlog A–E에도 없는 **신규 발견**이므로 escalation 대상.

### PERFORMANCE_RISKS (production 실측, 390px)
| | 요청 | 총 바이트 | JS | CSS | **폰트** |
|---|---|---|---|---|---|
| Personality result | 14 | 2,124,574 | 45,870 | 20,055 | **2,057,688 (96.9%)** |
| Compatibility result | 30 | 2,196,338 | 102,640 | 27,201 | **2,065,536 (94.0%)** |

- **Pretendard 2MB가 결과 페이지 페이로드의 94~97%** — S3가 무엇을 얹든 이 위에 얹힌다 (backlog C, 이번 변경 0)
- Compatibility는 저장소 기준 JS 316,931 B를 참조하며 그중 **98,128 B가 badges/level-xp/streak/user-data/auth/gamification-ui/referral/monetization** 계열
- 외부: fonts.googleapis, gstatic, GTM, Clarity ×2, Cloudflare Insights + (이미지 저장 시) jsdelivr html2canvas

---

## 4. VIRAL LOOP MAP (현행)

```
PERSONALITY
  Test 40Q ────────────────────────── WORKING
  → Result (label 강함, 2.8 화면) ──── WORKING
  → Share object (1080×1920 PNG) ──── PARTIAL  (여백 과다 · CTA/QR 없음 · 1포맷)
  → Share channels ────────────────── PARTIAL  (copy 우선 · LINE 후순위)
  → share_success 측정 ────────────── PARTIAL  (copy만)
  → Friend lands /t/<type>/ ───────── PARTIAL  (200·CTA 있음 · 얇음 · 비교 없음)
  → Friend takes test ─────────────── WORKING
  → Return to own result ──────────── DEAD     (세션 소멸)
  → Another test ──────────────────── PARTIAL  (「他のテストを試す」 존재)
  → FateAIverse ───────────────────── (의도적 MISSING)

COMPATIBILITY
  Test 8Q×2 ───────────────────────── WORKING
  → Result (68% + 동물 라벨) ───────── WORKING
  → Share object (9:16 + 1:1) ─────── PARTIAL  (외부 CDN 의존)
  → Share channels 13종 ───────────── PARTIAL  (무순위)
  → Friend opens shared LINK ──────── DEAD     ★ 최대 파손 지점
  → Friend takes test ─────────────── (링크로는 도달 불가, 이미지로만 유입)
  → Return ────────────────────────── DEAD
  → FateAIverse deep dive ─────────── WORKING  (impression·click 실측)
```

---

## 5. SCORE

| 축 (10점) | Personality | Compatibility |
|---|---:|---:|
| RESULT CLARITY | 7 | 6 |
| SELF LABEL | 9 | 8 |
| SHARE WORTHINESS | 6 | 7 |
| SHARE UX | 6 | 6 |
| MOBILE UX | 7 | 5 |
| REENTRY | 6 | 2 |
| RETURN REASON | 2 | 2 |
| SOCIAL LOOP | 5 | 3 |
| ANALYTICS | 7 | 8 |
| REFERRAL QUALITY | 6 | 8 |
| **합계** | **61 / 100** | **55 / 100** |

두 flagship 모두 **입구(테스트)와 결과 자체는 이미 좋고, 결과 이후가 끊긴다.** 공통 최저점은 `RETURN REASON`(2/2)과 `SOCIAL LOOP`이며, Compatibility는 `REENTRY` 2점이 루프를 실질적으로 차단한다.

---

## 6. 벤치마크 축 대조 (내부 구현 이해 후, 축만 참고)

| 축 | SmartAItest 현행 |
|---|---|
| Easy Entry | Personality 40문항(체감 김) / Compatibility 16그룹 — **Compatibility가 더 가벼움** |
| Self Label | 둘 다 보유 (16타입 / 동물 커플) — **강점** |
| Short Completion | Compatibility 우수, Personality 40문항은 이탈 위험 |
| Share Object | 둘 다 이미지 보유 — **경쟁력 있는 자산이 이미 있음** |
| Social Comparison | **부재** — 친구와 결과를 나란히 보는 장치 0 |
| Return Reason | **부재** |

---

## 7. TOP 5 BLOCKERS

1. **Compatibility 공유 링크 재진입 불가** — 공유해도 상대가 결과를 못 봄. 바이럴 루프 최대 파손.
2. **재방문 이유 0 (양 flagship)** — 결과가 세션과 함께 소멸, 영속 `result_id` 없음.
3. **Social comparison 부재** — "나 vs 너" 장치가 없어 공유가 일회성으로 끝남.
4. **share_success 측정 결손** — copy 외 채널 전환을 측정할 수 없어 S3 성과 판정 불가.
5. **결과/타입 페이지 title·og의 AI 기능 주장 잔존** — Truth Contract 미봉합 구역(신규 발견).

---

## 8. 권장 S3-1 (3 work package)

### S3-1A — Shareable Result Identity (양 flagship 공통 기반)
결과에 **URL로 복원 가능한 영속 식별자**를 부여한다. 공유 링크가 결과를 실제로 전달하게 만드는 최소 기반이며, 1·2·3·4번 blocker를 동시에 푼다.
- 결과 상태를 URL로 인코딩(서버 없이 가능한 범위) → `/{locale}/compatibility/r/<payload>` 형태
- 세션 없이 열어도 결과 렌더 · `share_entry` 이벤트 · `result_id` 파라미터 도입
- 기존 `/t/<type>/`는 Personality의 공유 도착지로 유지하되 CTA 중복 해소

### S3-1B — Japan-first Share Surface
- 채널 우선순위 확정: JA `LINE → native → copy → X`, KO `Kakao → native → copy`, EN `native → copy → X`
- `share_success`를 전 채널에 연결
- 공유 카드 재구성: 여백 축소 · 결과 라벨 상단 고정 · CTA/짧은 URL 삽입 · Compatibility와 포맷 정책 통일

### S3-1C — Result First-Screen & Continuity
- 첫 화면에 **라벨 + 핵심 수치**를 함께 배치 (Compatibility 68%가 첫 화면에 없음)
- 언어 배너가 결과 첫 화면을 가리지 않도록 배치 조정
- 결과 페이지에 Clean Pop Lab 적용해 홈/랜딩과 시각 연속성 확보
- Compatibility 결과에서 dead gamification 계열 98 KB 제거 (S2가 홈에서 한 것과 동일 원칙)

**ESTIMATED_SCOPE:** S3-1A 中(공유 URL 스킴 설계가 핵심) · S3-1B 中 · S3-1C 中~大(11.4화면 재구성 포함). 권장 착수 순서는 **A → B → C** — A 없이는 B/C의 성과를 측정할 수 없다.

**S3-1 범위 밖(backlog 유지):** desktop Likert 24~38px · JSON-LD name AI/IA 40건 · Pretendard 2MB · global chrome <44px · blog/guide H1.
