# SMART S2 — VISUAL TEXT INTEGRITY AUDIT

> 2026-09-08 · 브랜치 `smart-s2-japan-home` · 사용자 스크린샷 제보에서 출발
> 도구: 자체 visual-text detector (canvas 기반 색 해석) + axe-core 4.10.2

---

## 0. 제보

Home Final CTA의 왼쪽 인디고 primary 버튼에서 **아이콘은 보이는데 라벨이 보이지 않는다.**

---

## 1. 재현 — 실측

현재 HEAD에서 그대로 재현됐다.

```
TEXT_EXISTS_IN_DOM = "🧬 性格タイプ診断"
ACCESSIBLE_NAME    = "🧬 性格タイプ診断"
VISUALLY_VISIBLE   = NO
computed color            = rgb(79, 70, 229)
computed background-color = rgb(79, 70, 229)
-webkit-text-fill-color   = rgb(79, 70, 229)
opacity 1 · visibility visible · display block · filter none · mix-blend-mode normal
CONTRAST_RATIO     = 1.00 : 1     (WCAG AA 요구 4.5:1)
```

이모지만 보인 이유는 컬러 글리프 폰트라 `color`의 영향을 받지 않기 때문이다.

## 2. ROOT_CAUSE

```css
/* css/clean-pop-lab.css — 문제의 규칙 */
.cpl .hp-dark a:not(.s2-chip):not(.s2-flag-card):not(.kick-bento-item):not(.s2-hero-cta) {
    color: var(--cpl-indigo) !important;   /* #4F46E5 */
}
```

| | |
|---|---|
| SOURCE_RULE | `.cpl .gradient-bg { background: var(--cpl-indigo) !important; color:#fff !important }` — 특이도 (0,2,0) |
| OVERRIDING_RULE | 위 `.hp-dark a:not()×4` — `:not()`이 인자의 특이도를 더해 **(0,6,1)** |
| IMPORTANT | 양쪽 모두 `!important` → **특이도가 높은 쪽이 이김** |
| TOKEN | `--cpl-indigo` 가 전경과 배경에 동시에 적용 |
| ROOT_CAUSE | 산문(prose) 링크를 인디고로 칠하려던 규칙이 **버튼까지 잡았다.** Final CTA는 `a.gradient-bg.text-white` 이므로 4개의 `:not()` 예외 어디에도 걸리지 않았다 |

`cta.matches('.cpl .hp-dark a:not(...)') === true` 로 직접 확인.

**AFFECTED_SELECTORS** = `.cpl .hp-dark a:not(.s2-chip):not(.s2-flag-card):not(.kick-bento-item):not(.s2-hero-cta)`
**AFFECTED_SURFACES** = 5 (ja·ko·en·zh·es 홈의 Final CTA primary 버튼). 랜딩 10면은 `.hp-dark` 안에 브랜드 버튼이 없어 영향 없음.

## 3. FIX — 페이지별 패치가 아니라 공통 원인 1곳

예외 목록을 늘리는 방식은 **다음에 추가되는 버튼 클래스에서 똑같이 깨진다.** 규칙을 원래 의도(산문 링크)로 좁히고, 브랜드 배경을 칠하는 컨트롤은 자기 전경색을 스스로 고정하게 했다.

```css
/* 산문 링크만 */
.cpl .hp-dark p > a,
.cpl .hp-dark li > a,
.cpl .hp-dark summary a,
.cpl .hp-dark .s2-trust-body a { color: var(--cpl-indigo) !important; }

/* 계약: 자기 브랜드 배경을 칠하는 컨트롤은 항상 읽히는 전경을 유지한다 */
.cpl a.gradient-bg, .cpl button.gradient-bg,
.cpl a.kick-btn-primary, .cpl button.kick-btn-primary,
.cpl a.s2-hero-cta, .cpl .s2-flag-cta, .cpl .pt-btn-primary,
.cpl a.gradient-bg *, .cpl a.kick-btn-primary * {
    color: #fff !important; -webkit-text-fill-color: #fff !important;
}
```

`global-kick.css`(79면)는 건드리지 않았다. 변경은 `css/clean-pop-lab.css` 1파일.

```
POST_FIX_CONTRAST  = 6.29 : 1  (white on #4F46E5)
POST_FIX_SCREENSHOT = screenshot-1788870809707-28.jpg  (라벨 「🧬 性格タイプ診断」 정상 표시)
```

## 4. 전수 감사 결과

detector는 보이는 텍스트 노드마다 tag / text / rect / color / background / opacity / contrast / clipped / visible을 기록한다.
제외: `display:none` · `visibility:hidden` · `opacity:0` · `aria-hidden` · `.sr-only`/`.visually-hidden` · 0×0 · script/style · 이모지·화살표만 있는 노드.

```
SURFACES_SCANNED  = 15 CPL 면(홈 5 · personality 5 · compatibility 5 중 ja 실측 + 로케일 홈 5)
                    + 비-CPL 대표면(age-calculator 등)
                    폭: JA 375 / 390 / 1280 · KO390 · EN390
CONTROLS_SCANNED  = 홈 기준 로케일당 31~40, 랜딩 8~22

수정 전                     수정 후
INVISIBLE_TEXT       = 5           0
LOW_CONTRAST         = 0           0
CLIPPED              = 0           0
EMPTY_VISUAL_CONTROL = 5           0    (DOM 텍스트·접근가능 이름은 있는데 아이콘만 보이던 CTA)
CTA under 3:1        = 5           0
```

**P0** = 1건 — Home Final CTA primary 라벨 invisible (5로케일). **수정 완료.**
**P1** = 0
**P2** = 2건 — 비-CPL 다크면(`/ja/age-calculator/`)의 저대비 텍스트 2건. S2 CPL 범위 밖이며 S2가 만든 것이 아니다. 백로그.

## 5. 탐지기 자체의 오탐 2건 — 폐기하고 정정

정확한 수치를 위해 두 번 고쳐 썼다. **이 기록을 남기는 이유는 잘못된 1차 수치를 결론으로 쓰지 않았음을 남기기 위해서다.**

| 오탐 | 원인 | 정정 |
|---|---|---|
| compatibility 랜딩 「無料で相性を見てみる」 invisible | 배경이 `background-color`가 아니라 **핑크 `background-image` 그라데이션**인데 색상만 추적 | 텍스트와 첫 불투명 색 사이에 background-image가 있으면 **판정 불가**로 분류 |
| age-calculator 다크면 invisible 10건 | 반투명 레이어(`rgba(255,255,255,.08)`)를 **흰색 위에** 합성해 배경이 거의 흰색으로 계산됨 | 가장 바깥 불투명 색을 먼저 찾고, 반투명 레이어를 그 위에 **문서 순서대로 겹쳐** 계산 |

정정 후 age-calculator invisible 10 → 0.

## 6. 회귀 가드

`scripts/check-s2-home.js`에 시각 텍스트 계약을 추가했다(정적 검사, CSS 주석은 제외하고 규칙만 본다).

- 광범위한 `.hp-dark a:not(...)` 색상 규칙 재등장 = FAIL
- `a.gradient-bg` / `a.s2-hero-cta` / `.s2-flag-cta` / `.pt-btn-primary` 가 **자기 선택자로** 흰 전경을 고정하지 않으면 FAIL
- `-webkit-text-fill-color` 고정이 없으면 FAIL (gradient-text 규칙이 라벨을 지울 수 있다)
- 5로케일 홈의 primary Final CTA에 보이는 라벨이 없으면 FAIL

mutation 4종 전부 red 확인 → 누적 **27/27**.
