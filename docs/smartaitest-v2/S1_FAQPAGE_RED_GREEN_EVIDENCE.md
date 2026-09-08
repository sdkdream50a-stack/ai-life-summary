# S1 FAQPage RED → GREEN Evidence

> **Runtime impact: NONE.** 이 배치는 증거 완성과 정본 정정만 한다.
> 두 측정 모두 **현재 HEAD 의 같은 가드**(`scripts/check-s1-guards.js` guard #8)로 수행했다.
> 과거 트리에 그 시점의 가드를 기대하지 않는다 — 현재 가드를 실행하면서 `--root=` 로
> 과거 트리를 읽는다. 이것이 "same guard" 의 핵심이다.

## SHA 역할표 — 네 SHA 를 서로 섞지 않는다

| SHA | 역할 |
|---|---|
| `3dbdd3c^` = `11185a8` | **PRE_FIX_SHA** — FAQ fix 직전, RED 상태의 트리 |
| `3dbdd3c` | **FAQ_FIX_COMMIT** — 8개 wrong-language FAQPage 블록을 제거한 커밋 |
| `b193939` | **PR_HEAD_BEFORE_EVIDENCE** — evidence closure 작업 시작 직전의 PR head |
| `f3bc9df` | **CURRENT_HEAD** — evidence 가 추가된 현재 PR head (GREEN 측정 기준) |
| `644c3f8` | **BASE** — `origin/main`. PR 은 **미merge** (`mergeCommit = null`) |

```
FAQ_FIX_COMMIT          = 3dbdd3cdbac365c2797267dc49acc805ab60a1f5   fix(s1-7)
PRE_FIX_SHA             = 3dbdd3c^ = 11185a807af20fe4fe973e465901997834682bbe   fix(s1-2b)
PR_HEAD_BEFORE_EVIDENCE = b193939a0ea9463c75ce089cb645752ec1fa6cc3
CURRENT_HEAD            = f3bc9df6c766c2e9dfeb01fa7568aa52c007adab
BASE (origin/main)      = 644c3f86511bb3ccbbf6f1a3ddfdd637b639e18d   (미merge)
```

**`b193939` 와 `CURRENT_HEAD` 가 왜 다른가:**
`b193939` was the PR head before the evidence / locale-distribution documentation commits;
subsequent evidence-only commits advanced the PR head without runtime changes.
(`b193939` → `65577e9` 로케일 분포 증거 → `f3bc9df` 측정 트리 동일성·BEFORE/AFTER 축 분리.
모두 `.md` 전용이다.)

**이 표기가 다시 낡지 않는 이유:** 이후 evidence-only 커밋이 HEAD 를 더 밀어도 그것들은 `.md` 만
바꾸므로 **측정 트리는 불변**이다 — 아래 동일성 증명이 그 불변식이다. GREEN 수치는 `94b643b`
이후의 어떤 evidence 커밋에서 재실행해도 같다.

### 측정 트리 동일성 — 이 문서가 자기 자신을 무효화하지 않는다는 증명

증거 문서를 커밋할 때마다 HEAD 가 움직인다. 그래서 "현재 HEAD 의 가드로 측정했다"는 주장은
문서를 쓰는 행위 자체로 낡을 수 있다. 이 배치의 커밋들은 **`.md` 만** 바꾸므로 그렇지 않다:

```
$ git diff --name-only 94b643b..b193939 -- . ':!*.md'   → 0 files
$ git diff --name-only b193939..65577e9 -- . ':!*.md'   → 0 files
$ git diff --name-only 65577e9..f3bc9df -- . ':!*.md'   → 0 files
$ git diff --name-only 94b643b..f3bc9df -- . ':!*.md'   → 0 files

$ git show 94b643b:scripts/check-s1-guards.js | shasum   c988f98953ef6edd85554d446462ea20d74b4a57
$ git show HEAD:scripts/check-s1-guards.js    | shasum   c988f98953ef6edd85554d446462ea20d74b4a57   (IDENTICAL)
```

가드 파일과 런타임 트리가 바이트 동일하므로 아래 RED/GREEN/MUTATION 수치는 이 커밋들
어디에서 재실행해도 같다. 실제로 `94b643b`·`b193939`·`65577e9`·`f3bc9df` 네 시점에서 모두
재실행해 동일함을 확인했다(최초 캡처는 `50a3f27`). 표에 적은 최종 GREEN 은 `f3bc9df` 실행값이다.

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
  root                             : /private/tmp/claude-501/-Users-seong-project-smartaitest/e1c4c885-f857-4f36-85de-019c6af3f668/scratchpad/s1-faq-prefix
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

### mismatch 0 이 "FAQPage 를 전부 지워서" 가 아니다 — 보존 30블록의 로케일 분포

산술(30 = 30)만으로는 "혹시 비영어 FAQPage 를 싹 지우고 영어만 남긴 것 아닌가" 를 배제하지
못한다. 그래서 GREEN 트리의 30블록이 실제로 **어느 로케일에 살아 있는지** 전수 집계했다.

| locale | 보존된 FAQPage blocks | 파일 |
|---|---|---|
| en | 9 | `index` · `about` · `age-calculator` · `compatibility` · `life-summary` · `friend-compatibility` · `marriage-compatibility` · `personality-type` |
| ko | 7 | `index` · `about` · `compatibility` · `friend-compatibility` · `marriage-compatibility` · `personality-type` |
| ja | 6 | `index` · `compatibility` · `friend-compatibility` · `marriage-compatibility` · `personality-type` |
| zh | 4 | `index` · `compatibility` · `personality-type` |
| es | 4 | `index` · `compatibility` · `personality-type` |
| **합계** | **30** | |

**비영어 로케일에 21블록이 살아 있다** (ko 7 + ja 6 + zh 4 + es 4). 5개 로케일 전부가
자기 언어의 FAQPage 를 여전히 제출한다. 제거는 `age-calculator`·`life-summary` 두 계열의
비영어 4로케일 × 2면 = 8블록에만 적용됐고, 그 8개는 전부 영어 본문이었다.

---

## Mutation test — 가드가 load-bearing 임을 증명

가드가 통과하는 이유가 "검사를 안 해서"가 아님을 보인다.
현재 트리의 5개 로케일 디렉터리를 임시 복사본으로 뜬 뒤 변형하고 원복했다
(`cp` 백업/복원. `git checkout`·`reset --hard` 미사용, 원본 트리 무변경).

복사본 baseline: `wrong-language 0 · parse errors 0 · exit 0` — 변형 전 깨끗함을 먼저 확인.

| # | 변형 | 기대 | 결과 |
|---|---|---|---|
| **A** | 올바른 JA FAQPage 질문 1개를 영어로 | FAIL | **FAIL** — wrong-language 1, affected files 1, exit 1 |
| **B** | malformed JSON-LD 블록 삽입 | PARSE_ERROR + FAIL | **FAIL** — parse errors 1, exit 1 |
| **C** | FAQPage 아닌 `WebApplication`·`Quiz`·`ListItem` 의 `name` 4개를 영어로 | 오판 없음 | **PASS** — wrong-language 0, exit 0 |

세 변형 모두 원복 후 `exit 0` 으로 되돌아왔다.

### A — wrong-language

`ja/compatibility/index.html` 의 `"相性診断は本当に無料ですか？"` → `"Is the compatibility test really free?"`

```
  wrong-language FAQPage           : 1
  correct localized FAQPage kept   : 29
  affected files                   : 1
      ja/compatibility/index.html

FAQPage check FAILED (1):
  - ja/compatibility/index.html: FAQPage structured data in block #2 is en+ja on a ja page — …
$ echo $?   → 1
```

한 문항만 바꿔도 `en+ja` 로 잡힌다 — 블록 전체가 영어일 때만 걸리는 게 아니다.

### B — malformed JSON-LD

같은 파일 `</head>` 앞에 trailing comma 를 가진 블록을 삽입한다. fixture 를 정확히 적는다 —
`position` 값은 fixture 길이에 따라 달라지므로, 문자열이 다르면 숫자도 달라진다:

```html
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage",}</script>
```

```
  wrong-language FAQPage           : 0
  parse errors                     : 1

FAQPage check FAILED (1):
  - ja/compatibility/index.html: PARSE_ERROR in application/ld+json block #2 —
    SyntaxError: Expected double-quoted property name in JSON at position 51 (line 1 column 52)
$ echo $?   → 1
```

(`@context` 를 `"x"` 로 줄인 fixture 로도 재실행해 `position 34` 로 동일하게 FAIL 하는 것을
확인했다. 걸리는 사실은 위치 숫자가 아니라 **parse errors 1 · exit 1** 이다.)

깨진 블록은 **조용히 skip 되지 않는다**. 이것이 없으면 문법 오류 뒤에 잘못된 언어의
FAQPage 가 숨을 수 있다.

### C — non-FAQ false positive (핵심)

같은 파일에서 FAQPage **바깥** 스키마의 `name` 4곳을 영어로 바꿨다
(`WebApplication` `AI相性診断`, `Quiz` `AI相性診断`, `ListItem` `ホーム`, `ListItem` `AI相性診断`).
이 파일은 올바른 JA FAQPage 를 함께 가지고 있다.

```
  FAQPage blocks                   : 30
  wrong-language FAQPage           : 0
  correct localized FAQPage kept   : 30
  parse errors                     : 0
FAQPage check PASSED
$ echo $?   → 0
```

같은 변형 파일에 **폐기된 초기 방법**(모든 `"name"` 을 정규식으로 세는 방식)을 돌리면:

```
$ grep -oE '"name": *"[^"]*"' ja/compatibility/index.html | grep -vE '[ぁ-ゟ゠-ヿ一-鿿]'
      "name": "AI Compatibility Test"     ← WebApplication
      "name": "AI Test Lab"               ← Organization
      "name": "Home"                      ← ListItem
      "name": "AI Compatibility Test"     ← ListItem
      "name": "AI Compatibility Test"     ← Quiz
      "name": "AI Test Lab"               ← Organization
  naive 방식 "영어 FAQ 문항" 집계 : 6
  파서 기반 가드 집계             : 0
```

**한 파일에서 6건의 허위 계수.** 최초 보고의 "24면 / 100문항" 과대추정이 정확히 이
방식에서 나왔다. 파서 기반 가드는 0을 센다.

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

## Final gate — CURRENT_HEAD

```
$ npm run verify
  … build:i18n → build:legal → build:sitemap → build:adsense-boundary
  AdSense boundary verified: 64 allowed, 225 blocked deployable HTML files, 10 source templates, 0 changed.
  S1 guards passed: 45 template/generated pairs in sync, 128 core surfaces instrumented,
  18 referral CTAs on canonical UTM, 11 locale-authority checks,
  20 result surfaces with market-correct share channels, locale banner covering 5/5 markets,
  299 pages clean of stale trust copy, 30 FAQPage blocks language-matched (0 parse errors).
$ echo $?   → 0

$ node scripts/check-s1-guards.js --faq-only
  wrong-language FAQPage : 0 · parse errors : 0
$ echo $?   → 0

$ git status --short     (verify 실행 직후)
  (빈 출력)
```

`npm run verify` 는 빌더를 먼저 돌린다. 그 뒤 워킹 트리가 비어 있다는 것은
**빌드 재생성물이 커밋된 상태와 바이트 동일**하다는 뜻이다 — 즉 이 배치는 생성물 드리프트를
만들지 않는다.

---

## Runtime impact

**NONE.** 이 배치가 바꾼 것은 `scripts/check-s1-guards.js`(root/faq-only 지원 · PARSE_ERROR ·
집계 출력)와 `docs/smartaitest-v2/` 문서뿐이다. `.assetsignore` 가 `scripts/` 와 `*.md` 를
배포에서 제외하므로 **프로덕션에 나가는 자산 변경은 0** 이다.
HTML runtime = 0 · JS runtime = 0 · CSS runtime = 0.

원래의 과대추정은 `fix(s1-5)` 커밋 메시지에 그대로 남아 있다. 이미 push 된 히스토리이므로
재작성하지 않았다. 이 문서는 실수를 덮는 것이 아니라 증거 품질 개선으로 남긴다.
