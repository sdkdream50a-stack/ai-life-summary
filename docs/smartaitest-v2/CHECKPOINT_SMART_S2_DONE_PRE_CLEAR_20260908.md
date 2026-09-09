# CHECKPOINT — SMART S2 DONE (pre-clear)

> 2026-09-08 · 세션 클리어 직전 상태 고정.
> **이 파일은 커밋/푸시하지 않았다** (사용자 지시). 워크트리에만 존재한다.

---

## CANONICAL CURRENT STATE

실제 명령으로 확인한 값이다. 추정 아님.

```
PROJECT   = SmartAItest  (/Users/seong/project/smartaitest)
BRANCH    = smart-s2-japan-home
HEAD      = 0a5e972e9219c113dec796cbece93be1ab744d47
REMOTE    = 0a5e972e9219c113dec796cbece93be1ab744d47   → local == remote
BASE      = origin/main = 511f32a9142385f0625fa43509560100cdabd3f4
AHEAD     = 16 commits
WORKTREE  = clean (uncommitted 0, untracked 0 — 이 체크포인트 파일 작성 전 기준)

PR        = #3  smart-s2-japan-head → main
            state=OPEN · mergeable=MERGEABLE · draft=false
            headSha = 0a5e972e9219c113dec796cbece93be1ab744d47
            41 files · +4,278 −5,173
CI        = Workers Builds: ai-life-summary — PASS

SMART_S2  = DONE
MERGE     = NO
DEPLOY    = NO
```

> PR headRefName 정정: `smart-s2-japan-home` (위 표기 오타 방지용 명시).

## 커밋 16개

```
0a5e972  fix(s2)     Final CTA 라벨이 자기 배경에 묻히던 결함 — 공통 원인 1곳 수정
e19006f  test(s2-3)  guard에 Truth/Trust/Preview/Articles/IA 조건 — mutation 7/7 red
c28be30  feat(s2-3)  Trust 재구성 · Result Preview · 相性をもっと知る · Final CTA를 FAQ 뒤로
f32100a  fix(s2-3)   홈 FAQ 진실 정정 — 0-100% 제거 · ko AI 주장 제거
c7537c5  fix(s2-3)   랜딩 25면 AI 기능 주장 제거 — 브랜드 유지
c8323f1  fix(s2-2c)  미선택 리커트 컨트롤 경계 3:1 (Gemini 지적, 실측 확인 후)
8e7ee5d  style(s2-2c) Clean Pop Lab — 홈 + flagship 랜딩 2종
79942e5  perf(s2-2b) 죽은 게이미피케이션 페이로드 제거 — gzip 30.6KB
d2d067c  fix(s2-2a)  랜드마크 · JA 줄바꿈 · 44px 터치 타깃
f15563b  fix(s2-1a)  compatibility "0〜100%" 주장 정정 — 실제 [50,95]
1c2e5dc  test(s2-1a) guard — Hero CTA 앵커 · title AI 주장
6384d4e  feat(s2-1a) JA 확정 구조를 ko/en/zh/es로 확장
fee6d5d  feat(s2-1a) JA Home 확정 — Hero/Intent/Flagship 필드
ebde9ef  test(s2-1)  S2 Home guard — mutation 8/8
8401c27  fix(s2-1)   실체 없는 Home 표면 제거 — 바이럴 허브 · #AI 해시태그
b139de9  feat(s2-1)  Home 위계 재편 — Hero · Intent · Flagship
```

## S2-3 — 구현 완료 (재구현 금지)

Batch A/B/C 전부 commit·push 완료.

```
Landing title/meta AI capability claims  25면 정리 완료
FAQ Truth                                완료
Trust                                    완료
Result Preview                           완료
JA Articles                              완료
Home IA                                  완료
Final CTA                                완료
Clean Pop Lab styling                    완료
```

## VISUAL TEXT INTEGRITY — 사용자 제보 결함

```
증상   Home Final CTA primary indigo 버튼의 라벨이 보이지 않음 (아이콘만 표시)
BEFORE foreground rgb(79,70,229) / background rgb(79,70,229) / contrast 1.00:1
       DOM 텍스트·접근가능 이름은 존재. 이모지는 컬러 글리프라 color 영향 없음

ROOT CAUSE
  .cpl .hp-dark a:not(.s2-chip):not(.s2-flag-card):not(.kick-bento-item):not(.s2-hero-cta)
  { color: var(--cpl-indigo) !important }
  산문 링크용 규칙이 Final CTA까지 포착. :not() 인자 특이도로 (0,6,1)이 되어
  (0,2,0)인 .cpl .gradient-bg { color:#fff !important } 를 이김.

FIX
  · selector scope를 산문 컨텍스트(p > a, li > a, summary a, .s2-trust-body a)로 축소
  · 브랜드 배경 컨트롤이 자기 color + -webkit-text-fill-color 고정
  · global-kick.css 변경 0 · CSS 1파일 공통 원인 수정 (버튼별 패치 아님)

AFTER  contrast 6.29:1 · visible YES
AFFECTED  Home 5 locales.  Landing 10 surfaces 영향 없음
```

## VISUAL TEXT AUDIT

```
P0 = 1 → 해결
P1 = 0
P2 = 2 backlog  (비-CPL /ja/age-calculator/ 다크 surface 저대비, S2 regression 아님)

invisible             5 → 0
critical low contrast 0
clipped               0
CTA under 3:1         5 → 0
CPL 15 surfaces       clean
```

### Detector false positive 정정 (중요)

감사 과정에서 탐지기 자체의 오탐 2건을 발견해 폐기·정정했다.

1. `background-image` 그라데이션 배경을 `background-color`만 보고 invisible로 오판 → 판정 불가 분류로 수정
2. 반투명 레이어를 흰색 위에 잘못 composite → 가장 바깥 불투명 색부터 문서 순서로 겹치도록 수정

정정 후 `/ja/age-calculator/` invisible **10 → 0**.

> **초기 오탐 수치(invisible 10건 등)는 canonical evidence로 사용 금지.**

감사 문서: `docs/smartaitest-v2/S2_VISUAL_TEXT_INTEGRITY_AUDIT.md` (커밋됨)

## S2 FINAL PRODUCT STATE

```
TRUST            4 truth-backed cards · JA Methodology 신규 생성 0
                 「結果のしくみ」 → Home FAQ #faq 앵커 · dead link 0
RESULT PREVIEW   new image 0 · 기존 pt/infp.jpg 1장 lazy
                 Personality 4축 / Compatibility 문항별 일치도 실제 구조 사용
                 「表示例」 명시 · 0〜100% claim 0 · 숫자 생성 0
ARTICLES         JA 「相性をもっと知る」 3편 · indexable + sitemap 검증
                 zodiac-vs-ai 제외 · Home FateAIverse direct CTA 0 · JA 전용
FAQ TRUTH        0-100 stale claim 0 · KO AI 궁합 visible + JSON-LD 동시 정정
LANDING TITLES   25 surfaces AI capability claim 0 · 브랜드 "AI Test Lab" 유지
FINAL CTA        Primary = Personality / Secondary = Compatibility
                 Primary label contrast 6.29:1 · 가짜 배지·카운트·랭킹 0
```

## GATES

```
A11Y          Home ja/ko/en axe 0 · Personality 0
              Compatibility heading-order 1 = pre-existing (CPL 전후 heading 시퀀스 동일)
MOBILE        JA375 / JA390 / JA430 / Desktop1280 / KO390 / EN390
              overflowX 0 · clipped 0 · 신규 <44px control 0
PERFORMANCE   129,283 B gzip / 9 requests   (pre-S2: 155,341 B / 18 requests)
              Result Preview lazy — initial fetch 0
GEMINI        GO · blockers 0 · text visibility 축 포함
FATEAIVERSE   20 hits / 18 files unchanged · Home links 0 · Compatibility UTM 4/4
ADSENSE       64 allowed / 225 blocked · unchanged
ANALYTICS     home_view · test_start unchanged · taxonomy 추가 0
BUILD PARITY  OK · S1 guard 45 template/generated pairs in sync
GUARDS        npm run verify green · S2 mutation 27/27 RED as expected
REGRESSIONS   0
```

## NEXT EXACT STEP (다음 세션)

S2 개발 재개가 아니다.

```
1. exact HEAD / PR re-anchor
2. PR #3 CI / mergeability 재확인
3. 사용자 merge/deploy 승인 확인
4. 승인된 경우에만 merge
5. production deploy
6. production actual verification
7. production에서 CTA contrast / visual / analytics / referral /
   AdSense / cache behavior 확인
8. S2_PRODUCTION_VERIFIED 판정
9. 그 이후에만 S3 계획
```

**사용자 승인 전 merge / deploy 절대 금지.**

## 이월 백로그

- consent-manager 주입 오버레이 컨트롤 3개 <44px (297면 공유 global chrome)
- compatibility landing `heading-order` 1건 (pre-existing)
- JA 블로그 6편 본문의 `AI相性診断` (블로그 템플릿 공통 — SEO/콘텐츠 정리 단계)
- 다른 26면이 참조하는 게이미피케이션 JS/CSS 파일 (홈 임계 경로에서만 제거됨)
- Articles JA 전용 — ko/en/zh/es에 동급 indexable 세트 없음
- Result Preview에 쓴 `pt/infp.jpg`는 카드 내 문구가 영어 + 보라 그라데이션
  (기존 자산, 새 이미지 생성 금지로 그대로 둠 — S3 결과 카드 작업 시 후보)
