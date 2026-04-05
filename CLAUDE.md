# CLAUDE.md — AI Test Lab (smartaitest.com)

> 글로벌 CLAUDE.md 공통 규칙 적용 (SEO·상호작용·과거이슈 포함). 이 파일은 프로젝트 특화 규칙만 포함.

---

## 프로젝트 정보

- **사이트:** https://smartaitest.com
- **타입:** 정적 HTML (126+ 파일)
- **AdSense:** ca-pub-6241798439911569
- **언어:** 한국어(ko), 영어(en), 일본어(ja), 중국어(zh), 스페인어(es)

---

## 콘텐츠 무결성 (필수)

- **저자:** 반드시 "AI Test Lab 편집팀" 표기 (가상 전문가 금지)
- **통계/연구:** 출처 없는 구체적 수치 금지 (예: "47% 감소"), 인용 시 실제 논문만
- **허위 인용 금지:** 연도·권호·페이지가 정확한 실존 논문만 인용

---

## 블로그 발행 시스템

- **자동 발행:** GitHub Actions가 매일 **오전 9시 (KST)** 실행 → `drafts/schedule.json` 확인 후 `blog/`로 이동
- **파일 위치:** `drafts/post-{N}-ko.html`, `drafts/post-{N}-en.html`
- **예약 등록:** `drafts/schedule.json`에 episode·publish_date·files 추가
- **수동 발행:** GitHub Actions > "Scheduled Blog Post Publish" > "Run workflow"

### 블로그 구조
- `blog/ko/post-{N}.html` / `blog/en/post-{N}.html` / `blog/post-{N}.html`
- `blog.html` (목록) / `drafts/` (예약 대기)

---

## SEO 규칙

### 필수 메타 요소 (모든 HTML 페이지)
- title (50-60자, 핵심 키워드 앞 배치)
- meta description (150-160자)
- canonical URL
- Open Graph (title/description/image/url/type/locale)
- Twitter Card (summary_large_image)
- hreflang (ko/en/x-default)

### 구조화 데이터
- JSON-LD 형식으로 `<head>`에 포함
- 사용 스키마: WebSite, BlogPosting, FAQPage

### HTML 규칙
- H1: 페이지당 정확히 1개, H1→H2→H3 계층 준수
- 모든 `<img>`에 `alt` 속성 필수
- 앵커 텍스트에 의미 있는 키워드 사용 ("여기 클릭" 금지)

### 기술적 SEO
- LCP < 2.5초, CLS < 0.1, FID < 100ms
- 반응형 디자인 + 뷰포트 메타 + 터치 타겟 48x48px 이상
- HTTPS 필수, 혼합 콘텐츠 금지
- `robots.txt`·`sitemap.xml` 최신 유지

### 네이버 SEO
- 네이버 서치어드바이저 등록 필수
- 필수 4항목: title, meta description, h1, img alt

---

## 마지막 업데이트
2026-04-05 — CLAUDE.md 컨텍스트 최적화 (277줄 → 80줄)
