# S1 FAQPage RED → GREEN Evidence

> **Runtime impact: NONE.** 이 배치는 증거 완성과 정본 정정만 한다.
> 두 측정 모두 **현재 HEAD 의 같은 가드**(`scripts/check-s1-guards.js` guard #8)로 수행했다.
> 과거 트리에 그 시점의 가드를 기대하지 않는다 — 현재 가드를 실행하면서 `--root=` 로
> 과거 트리를 읽는다. 이것이 "same guard" 의 핵심이다.

```
CURRENT_HEAD    = 50a3f276f91b8e552e8956753a9c1da4a30fda27
FAQ_FIX_COMMIT  = 3dbdd3cdbac365c2797267dc49acc805ab60a1f5   fix(s1-7)
PRE_FIX_SHA     = 11185a807af20fe4fe973e465901997834682bbe   fix(s1-2b)
```

## FAQ_FIX_COMMIT 이 정확히 그 배치인가 (추측 아님)

`origin/main..HEAD` 11개 커밋 중 **FAQPage 줄을 삭제하는 커밋은 `3dbdd3c` 하나뿐**이며,
그 커밋이 건드린 런타임 페이지는 정확히 문제의 8개다.

```
$ git show --stat 3dbdd3cdbac365c2797267dc49acc805ab60a1f5
     es/age-calculator/index.html          |  13 ---
     es/life-summary/index.html            |  49 ---------
     ja/age-calculator/index.html          |  13 ---
     ja/life-summary/index.html            |  49 ---------
     ko/age-calculator/index.html          |  13 ---
     ko/life-summary/index.html            |  49 ---------
     scripts/check-s1-guards.js            |  75 ++++++++++++-
     scripts/templates/age-calculator.html |  52 ---------
     scripts/templates/life-summary.html   | 196 ----------------------------------
     zh/age-calculator/index.html          |  13 ---
     zh/life-summary/index.html            |  49 ---------
     11 files changed, 74 insertions(+), 497 deletions(-)
```

8개 런타임 페이지의 diff 는 **순수 삭제**다(추가 줄 0):

```
+0  -13  {ko,ja,zh,es}/age-calculator/index.html
+0  -49  {ko,ja,zh,es}/life-summary/index.html
```

삭제된 줄을 전수 분류한 결과 FAQPage JSON-LD 블록(및 그 JSON 구조 괄호) 외의 요소는 없었다.

---

## Why the original estimate was wrong

최초 보고는 규모를 **"24면 / 약 100문항"** 으로 추정했다. 실제는 **8블록 / 8파일**이다.

원인은 초기 스캔이 HTML 에서 `"name":` 필드를 **정규식으로 전부 세었기** 때문이다.
그 필드는 FAQPage 의 `Question.name` 에만 있지 않고 같은 페이지의 다른 스키마에도 존재한다:

`WebSite` · `SoftwareApplication` · `WebApplication` · `Organization` ·
`HowTo`(각 step 이 `name` 을 가진다) · `BreadcrumbList`/`ListItem` · `Quiz` · `Offer`

그래서 FAQPage 와 무관한 이름들이 "영어 FAQ 문항"으로 집계됐다.
(이 오판 모드는 아래 MUTATION C 로 재현·차단을 증명했다.)

## Canonical method

- `<script type="application/ld+json">` 블록만 수집
- `JSON.parse` 로 실제 파싱 — 텍스트 휴리스틱 금지
- object / array / 중첩 object / `@graph` 재귀
- `@type` 이 문자열이든 배열이든 대응
- `@type === "FAQPage"` 인 객체만 판정
- 파싱 실패는 **조용히 skip 하지 않고** 파일 · 블록 인덱스 · 에러 타입과 함께 `PARSE_ERROR` 로 FAIL

판정 규칙: 비영어 페이지의 FAQPage 는 그 페이지 언어와 일치해야 한다.
FAQPage 부재 = PASS(원어민 검수 스키마가 생기기 전까지의 의도된 상태).
영어 페이지는 영어 FAQPage 를 유지한다.

---

## RED — PRE_FIX_SHA

```
$ node scripts/check-s1-guards.js --faq-only --root=<worktree @ 11185a807af20fe4fe973e465901997834682bbe>
FAQPage audit
  root                             : /private/tmp/claude-501/-Users-seong-project-smartaitest/e59f1763-a3c8-4c7e-84e4-218e8942078d/scratchpad/s1-faq-prefix
  HTML files scanned               : 204
  JSON-LD blocks parsed            : 259
  FAQPage blocks                   : 38
  wrong-language FAQPage           : 8
  correct localized FAQPage kept   : 30
  parse errors                     : 0
  affected files                   : 8
      ko/age-calculator/index.html
      ko/life-summary/index.html
      ja/age-calculator/index.html
      ja/life-summary/index.html
      zh/age-calculator/index.html
      zh/life-summary/index.html
      es/age-calculator/index.html
      es/life-summary/index.html

FAQPage check FAILED (8):
  - ko/age-calculator/index.html: FAQPage structured data in block #2 is en on a ko page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - ko/life-summary/index.html: FAQPage structured data in block #2 is en on a ko page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - ja/age-calculator/index.html: FAQPage structured data in block #2 is en on a ja page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - ja/life-summary/index.html: FAQPage structured data in block #2 is en on a ja page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - zh/age-calculator/index.html: FAQPage structured data in block #2 is en on a zh page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - zh/life-summary/index.html: FAQPage structured data in block #2 is en on a zh page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - es/age-calculator/index.html: FAQPage structured data in block #2 is en on a es page — remove it rather than submitting wrong-language schema (the visible FAQ stays).
  - es/life-summary/index.html: FAQPage structured data in block #2 is en on a es page — remove it rather than submitting wrong-language schema (the visible FAQ stays).

$ echo $?
1
```

**PRE_FIX mismatch = 8 · files = 8 · parse errors = 0**

## GREEN — CURRENT_HEAD

```
$ node scripts/check-s1-guards.js --faq-only
FAQPage audit
  root                             : /Users/seong/project/smartaitest
  HTML files scanned               : 204
  JSON-LD blocks parsed            : 251
  FAQPage blocks                   : 30
  wrong-language FAQPage           : 0
  correct localized FAQPage kept   : 30
  parse errors                     : 0
  affected files                   : 0

FAQPage check PASSED — every FAQPage block matches its page locale.

$ echo $?
0
```

**CURRENT mismatch = 0 · parse errors = 0 · correct localized FAQPage preserved = 30**

### 정상 블록이 함께 사라지지 않았다

| | PRE-FIX | CURRENT |
|---|---|---|
| HTML files scanned | 204 | 204 |
| JSON-LD blocks parsed | 259 | 251 |
| FAQPage blocks | 38 | 30 |
| wrong-language FAQPage | **8** | **0** |
| **correct localized FAQPage kept** | **30** | **30** |
| parse errors | 0 | 0 |
| exit code | 1 | 0 |

정상 블록 수가 양쪽 모두 **30 으로 동일**하다. 38 − 30 = 8 로 제거 수와도 일치한다.
즉 제거된 8개는 전부 wrong-language 블록이었고, 올바르게 현지화된 블록은 하나도 잃지 않았다.

---

## Mutation test — 가드가 load-bearing 임을 증명

임시 복사본을 만들어 변형하고 원복했다(`cp` 백업/복원, `git checkout`·`reset --hard` 미사용).

| # | 변형 | 기대 | 결과 |
|---|---|---|---|
| **A** | 올바른 JA FAQPage 질문 1개를 영어로 | FAIL | **FAIL** — `block #2 is en+ja on a ja page`, wrong-language 1, exit 1 |
| **B** | malformed JSON-LD 삽입 | PARSE_ERROR / FAIL | **FAIL** — `PARSE_ERROR in … block #1 — SyntaxError: Expected property name or '}' …`, exit 1 |
| **C** | FAQPage 아닌 `WebApplication`·`Quiz`·`ListItem` 의 `name` 4개를 영어로 | 오판 없음 | **PASS** — wrong-language 0, exit 0 |

C 가 핵심이다. 초기 grep 이 정확히 이 경우를 FAQ 불일치로 잘못 셌고,
파서 기반 가드는 세지 않는다.

---

## Root override 계약

```bash
node scripts/check-s1-guards.js                    # 기본: 이 repo, 전체 8종 가드 (변경 없음)
node scripts/check-s1-guards.js --faq-only         # FAQPage 검사만
node scripts/check-s1-guards.js --faq-only --root=/abs/path   # 다른 체크아웃을 읽기 전용 검사
S1_GUARD_ROOT=/abs/path node scripts/check-s1-guards.js --faq-only
```

- `--root` 는 **read-only inspection 전용**이다. 가드 전체에 `writeFileSync`/`mkdirSync`/
  `rmSync` 등 쓰기 API 호출이 **0건**이며, RED 캡처 후 대상 worktree 의
  `git status` 가 비어 있음을 확인했다.
- FAQ 검사를 분리한 이유: 전체 스위트를 과거 커밋에 강제로 돌리면 그 시점에는 아직
  존재하지 않던 다른 가드들의 실패와 섞여 증거가 흐려진다.

## 재현

```bash
git worktree add --detach /tmp/s1-faq-prefix 3dbdd3c^
node scripts/check-s1-guards.js --faq-only --root=/tmp/s1-faq-prefix   # 8, exit 1
node scripts/check-s1-guards.js --faq-only                             # 0, exit 0
git worktree remove /tmp/s1-faq-prefix
```

---

## Runtime impact

**NONE.** 이 배치가 바꾼 것은 `scripts/check-s1-guards.js`(root/faq-only 지원 · PARSE_ERROR ·
집계 출력)와 `docs/smartaitest-v2/` 문서뿐이다. `.assetsignore` 가 `scripts/` 와 `*.md` 를
배포에서 제외하므로 **프로덕션에 나가는 자산 변경은 0** 이다.
HTML runtime = 0 · JS runtime = 0 · CSS runtime = 0.

원래의 과대추정은 `fix(s1-5)` 커밋 메시지에 그대로 남아 있다. 이미 push 된 히스토리이므로
재작성하지 않았다. 이 문서는 실수를 덮는 것이 아니라 증거 품질 개선으로 남긴다.
