# S1 — FAQPage 언어 불일치: RED → GREEN 증거

> 생성 2026-09-08 · **런타임 변경 0** — 이 배치는 증거 완성과 정본 정정만 한다.
> 두 측정 모두 **같은 파서 기반 가드**(`scripts/check-s1-guards.js` guard #8)로 수행했다.
> 과거 커밋에 가드가 없었다는 이유로 다른 스크립트를 쓰지 않았다 — 가드에
> read-only 오버라이드(`--faq-only`, `--root=`)를 추가해 동일 로직을 두 트리에 겨눴다.

| | SHA |
|---|---|
| PRE-FIX (FAQPage 수정 직전) | `11185a807af20fe4fe973e465901997834682bbe` — `fix(s1-2b)` |
| CURRENT | `8f2d5324f738625835ad61dc9bf08ec897b082ac` |

| 지표 | PRE-FIX | CURRENT |
|---|---|---|
| ld+json 블록 파싱 | 259 | 251 |
| FAQPage 블록 | **38** | **30** |
| **wrong-language FAQPage 블록** | **8** | **0** |
| **parse errors** | **0** | **0** |
| 영향받은 파일 | 8 | 0 |
| exit code | 1 | 0 |

블록 수 차이 38 − 30 = 8 로, 제거한 수와 정확히 일치한다. 정상 블록이 함께 사라지지 않았다.

---

## 재현 방법

```bash
# PRE-FIX 트리를 detached worktree 로 꺼낸다 (읽기 전용, 브랜치 변경 없음)
git worktree add --detach /tmp/s1-prefix 3dbdd3c^

# 같은 가드를 두 트리에 겨눈다
node scripts/check-s1-guards.js --faq-only --root=/tmp/s1-prefix   # -> 8, exit 1
node scripts/check-s1-guards.js --faq-only                          # -> 0, exit 0

git worktree remove /tmp/s1-prefix
```

`node scripts/check-s1-guards.js` (인자 없음)의 기본 동작은 바뀌지 않았다 — 전체 가드 8종을 이 저장소에 대해 실행한다.

---

## PRE-FIX 출력 (verbatim)

```
$ node scripts/check-s1-guards.js --faq-only --root=<worktree @ 11185a807af20fe4fe973e465901997834682bbe>
FAQPage locale check
  root                        : /private/tmp/claude-501/-Users-seong-project-smartaitest/e59f1763-a3c8-4c7e-84e4-218e8942078d/scratchpad/s1-prefix-worktree
  ld+json blocks parsed       : 259
  FAQPage blocks found        : 38
  wrong-language FAQPage blocks: 8
  parse errors                : 0
  affected files              : 8
      ko/age-calculator/index.html
      ko/life-summary/index.html
      ja/age-calculator/index.html
      ja/life-summary/index.html
      zh/age-calculator/index.html
      zh/life-summary/index.html
      es/age-calculator/index.html
      es/life-summary/index.html

FAQPage check FAILED (8):
  - ko/age-calculator/index.html: FAQPage structured data is in en on a ko page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - ko/life-summary/index.html: FAQPage structured data is in en on a ko page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - ja/age-calculator/index.html: FAQPage structured data is in en on a ja page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - ja/life-summary/index.html: FAQPage structured data is in en on a ja page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - zh/age-calculator/index.html: FAQPage structured data is in en on a zh page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - zh/life-summary/index.html: FAQPage structured data is in en on a zh page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - es/age-calculator/index.html: FAQPage structured data is in en on a es page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - es/life-summary/index.html: FAQPage structured data is in en on a es page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
$ echo $?
1
```

## CURRENT 출력 (verbatim)

```
$ node scripts/check-s1-guards.js --faq-only
FAQPage locale check
  root                        : /Users/seong/project/smartaitest
  ld+json blocks parsed       : 251
  FAQPage blocks found        : 30
  wrong-language FAQPage blocks: 0
  parse errors                : 0
  affected files              : 0

FAQPage check PASSED — every FAQPage block matches its page locale.
$ echo $?
0
```

---

## 왜 초기 추정이 컸는가

최초 보고는 이 결함의 규모를 **"24면 / 약 100문항"** 으로 추정했다. 실제는 **8블록 / 8파일**이다.

원인은 초기 스캔이 HTML 에서 `"name":` 필드를 **정규식으로 전부 세었기** 때문이다.
그 필드는 FAQPage 의 `Question.name` 에만 있는 것이 아니라 같은 페이지의 다른 스키마에도 존재한다:

`WebSite` · `SoftwareApplication` · `Organization` · `HowTo`(각 step 이 `name` 을 가진다) ·
`BreadcrumbList`/`ListItem` · `Quiz` · `Offer` · `WebApplication`

그래서 FAQPage 와 무관한 이름들이 "영어 FAQ 문항"으로 집계됐다.

정본 계수는 `application/ld+json` 을 `JSON.parse` 한 뒤 **`@type === "FAQPage"` 인 객체만**
검사하고 `@graph` 내부까지 재귀한다. 로케일 홈 5면은 FAQPage 가 `@graph` 안에 중첩돼 있어
최상위 `@type` 만 보면 놓친다 — 가드 구현 중 실제로 이 버그를 만들었고 25 vs 30 불일치로
발견해 정정했다.

**이것은 과거 실수를 덮는 수정이 아니라 증거 품질 개선으로 기록한다.** 원래의 과대추정은
`fix(s1-5)` 커밋 메시지에 남아 있고, 히스토리는 재작성하지 않았다.

---

## 가드 계약 (guard #8)

- `<script type="application/ld+json">` 만 읽는다
- `JSON.parse` 로 실제 파싱한다 — 텍스트 휴리스틱 금지
- object / array 모두 처리하고 `@graph` 내부로 재귀한다
- `@type` 이 문자열이든 배열이든 대응한다
- `@type === "FAQPage"` 인 객체만 검사한다
- **파싱 실패는 조용히 무시하지 않는다** — `PARSE_ERROR` 로 별도 FAIL 처리한다
  (구문 오류 뒤에 잘못된 언어의 FAQPage 가 숨는 것을 막는다)
- 판정: 비영어 페이지의 FAQPage 는 그 페이지 언어와 일치해야 한다.
  FAQPage 부재 = PASS(원어민 검수 스키마가 생기기 전까지의 의도된 상태).
  영어 페이지는 영어 FAQPage 를 유지한다.
