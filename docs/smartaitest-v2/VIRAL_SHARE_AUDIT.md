# VIRAL / SHARE READINESS AUDIT — SMART S0

> 2026-09-08 · repo `644c3f8` · 라이브 브라우저 실행 + 소스 검증 · **코드 변경 0**
> 목표 기준: `Preview == Saved Image == OG == Shared Landing`

---

## 0. 최종 판정

# VIRAL_READY = NOT_READY

한 줄 이유: **결과를 공유하면 친구는 결과를 못 본다.** 4개 주력 테스트 중 결과가 실재하는 랜딩으로 공유되는 것은 personality-type 하나뿐이고, 그 랜딩은 296자 `noindex` 스텁이다. 그리고 일본 시장의 필수 채널인 **LINE이 JA 결과 화면에 없다**.

---

## 1. `Preview == Saved Image == OG == Shared Landing` 대조표

| 테스트 (JA) | 화면 결과 | 이미지 저장 | 결과별 OG | 공유 링크가 가리키는 곳 | 친구가 보는 것 | 판정 |
|---|---|---|---|---|---|---|
| **personality-type** | ✅ INTP+4축+강점 | ✅ PNG (포맷 선택 없음) | ✅ `/t/intp/`가 `pt/intp.jpg` 보유 | `/{lang}/personality-type/t/{type}/` | **타입 랜딩 (296자, noindex)** | **PARTIAL** |
| **compatibility** | ✅ 68점+5축+응답분석 | ✅ 9:16 / 1:1 | ❌ 전부 `og-default.png` | **`/{lang}/compatibility/` (입력 폼)** | **빈 입력 폼** | **FAIL** |
| **life-summary** | ✅ 소울타입+레이더 | ✅ 9:16 / 1:1 | ❌ `og-default.png` | 결과 URL(파라미터 없음) → 입력으로 리다이렉트 | **입력 폼** | **FAIL** |
| **age-calculator** | ✅ 정신/에너지 나이 | ✅ 9:16 / 1:1 | ❌ `og-default.png` | 결과 URL(파라미터 없음) | **입력 폼** | **FAIL** |
| vibe-check | ✅ | ✅ html2canvas | ❌ | 현재 페이지 URL | 입력 화면 | FAIL |
| kpop-match | ✅ | ✅ html2canvas | ❌ | 현재 페이지 URL | 입력 화면 | FAIL |
| love/work/communication-style | ✅ | ❌ 없음 | ❌ | 없음 | — | **NONE** |

**증거**
- `js/compatibility-share.js:17-23` `generateShareUrl()` → `window.location.origin + path.replace(/result\/?$/,'')`. 라이브 실행값: `https://smartaitest.com/ja/compatibility/` — **입력 폼**.
- `js/personality-type-result.js:90` → `pathname.replace('result/','t/'+type+'/')` — **유일하게 결과를 담은 URL**.
- 전 결과 페이지 `og:image` = `https://smartaitest.com/assets/images/og-default.png` (직접 확인: ja/index, ja/compatibility, ja/compatibility/result, ja/personality-type, ja/personality-type/result, ja/life-summary/result, ja/age-calculator/result).
- `/assets/images/pt/{16타입}.jpg`는 **존재하고 `/t/{type}/` 페이지에서만 og로 쓰인다** — 결과 페이지에서는 안 쓴다.

---

## 2. 일본 시장 치명타 — LINE 부재

라이브 `/ja/compatibility/result/`의 공유 버튼 실측 (DOM 순서 그대로):

```
1. 💛 Kakao      ← 한국 메신저가 첫 번째
2. 𝕏  Twitter
3. 📘 Facebook
4. 📷 Instagram
5.    Threads
6.    Telegram
7.    Reddit
8.    Pinterest
9.    LinkedIn
```

**LINE 없음.** `document.body.innerText`에 "LINE" 문자열 0건, "kakao" 다수.

저장소 전체 대조:

| 로케일 JA 파일 | LINE 버튼 | Kakao 버튼 |
|---|---|---|
| `ja/index.html` | 있음 (FAQ 문구) | 있음 |
| `ja/compatibility/result/index.html` | **0** | 8 |
| `ja/life-summary/result/index.html` | **0** | 5 |
| `ja/age-calculator/result/index.html` | 2 | 1 |
| `ja/personality-type/result/index.html` | **0** | 0 |
| **JA 전체 파일 수** | **1** | **12** |

`shareToLine()`은 `js/share.js:282`, `js/compatibility-share.js:99`, `js/age-share.js:79` 세 곳에 **구현되어 있으나 JA 결과 화면에 렌더되지 않는다**.

동시에 JA 홈 FAQ는 이렇게 약속한다:
> "Twitter/X、Facebook、WhatsApp、**LINE**、KakaoTalk に直接共有"

→ **CLAIM vs REALITY = MISMATCH (P0, Japan-first 전략 직격)**

---

## 3. 공유 문구가 "AI"를 주장한다

`ja/compatibility/result/index.html`의 Twitter 공유 문구:

```js
ja: 'AI相性テストしてみない？🥰'
ko: '나랑 AI 궁합 테스트 해볼래? 🥰'
zh: '要测试我们的AI配对吗？🥰'
es: '¿Quieres probar nuestra compatibilidad IA? 🥰'
```

실제 엔진은 8문항 리커트 고정 가중이다. **공유되는 문구가 사이트 밖으로 나가는 AI 허위 주장**이라 표면 중 가장 위험하다.
(참고: `copyViralLink()`의 문구에서는 "AI"가 제거되어 있다 — 부분 교정 상태.)

---

## 4. 친구 비교 (compare / friend loop)

| 기능 | 상태 | 증거 |
|---|---|---|
| 친구 초대 링크 생성 | 구현됨 | `js/viral-link.js:89` `generateComparisonLink()` |
| PII 포함 여부 | **없음 (하드닝 완료)** | `js/viral-link.js:99-106` 생일·이름 인코딩을 명시적으로 제거 |
| 링크가 가리키는 곳 | `https://smartaitest.com/compatibility/?ref_src=share` | `viral-link.js` `baseUrl` 기본값 |
| **로케일** | **루트 `/compatibility/`는 `_redirects`에 의해 `/en/compatibility/`로 301** | `_redirects` |
| 비교 UI | **없음** — 친구가 결과를 내도 두 결과를 나란히 보는 화면이 없다 | 저장소 전체에 compare 화면 부재 |
| 판정 | **FRIEND_LOOP = NOT_IMPLEMENTED** | |

→ 일본어 사용자가 만든 초대 링크가 **친구를 영어 페이지로 보낸다**. (`ja/compatibility/result/index.html`은 `baseUrl`을 `/ja/compatibility/`로 넘기려 시도하지만, 넘기는 `userData.year`가 `undefined`라 실제로는 `window.currentViralLink`가 현재 결과 URL로 폴백한다 — 라이브 실측값 `https://smartaitest.com/ja/compatibility/result/`.)

---

## 5. 결과 품질 (RESULT QUALITY AUDIT)

| 기준 | personality-type | compatibility | life-summary | age-calculator |
|---|---|---|---|---|
| 한 문장 정체성 라벨 | ✅ "INTP 論理学者 / 何よりも真実を求める哲学者" | ⚠️ "良い可能性" (68점) — 정체성 아님 | ✅ 소울타입명+슬로건 | ❌ 숫자 두 개 |
| 3가지 특성 | ✅ 강점 3 + 약점 + 궁합타입 | ✅ 5축 % | ✅ 5특성 레이더(단 humor 랜덤) | ⚠️ 문구 2개 |
| 지나치게 일반적인가 | 보통 (16타입 표준) | 낮음 (응답 기반) | **높음 — 12버킷 바넘** | 보통 |
| 공유 시 자기표현 되는가 | ✅ "私のタイプはINTP" | ⚠️ 커플 점수(개인 표현 아님) | ✅ 타입명 | ❌ |
| 친구 비교 가능 | ❌ | ❌ (UI 없음) | ❌ | ❌ |
| 다음 테스트로 이어짐 | ✅ 相性/ソウル/年齢 링크 | ✅ | ✅ | ✅ |
| 블로그로 이어짐 | ✅ 2편 링크 | — | — | — |

**결론**: 자기표현 자산으로서 가장 강한 것은 **personality-type**이고, 그 다음이 vibe-check/kpop-match(정체성 라벨 + 이미지 저장 + 계측 완비)다. compatibility는 완주 경험은 가장 좋지만 **공유 산출물이 "커플 점수"라 개인 정체성 표현이 되지 않는다.**

---

## 6. 종합 — 무엇이 뷰럴을 막고 있는가 (순서대로)

1. **공유 랜딩이 결과가 아니다.** (compatibility·life-summary·age·vibe·kpop = 전부 입력 폼으로 착지)
2. **LINE 부재 + Kakao 우선.** 일본 시장에서 공유 채널 자체가 없다.
3. **결과별 OG 이미지 부재.** 모든 공유가 동일한 `og-default.png`로 표시된다 → 타임라인에서 구분 불가.
4. **친구 비교 화면 미구현.** 초대 → 비교 → 재공유 루프가 닫히지 않는다.
5. **가장 뷰럴 가능한 두 테스트(vibe/kpop)가 `noindex`.**
6. **공유 문구의 "AI" 주장** — 사이트 밖으로 나가는 허위 진술.
