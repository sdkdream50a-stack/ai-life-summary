# Project Guidelines for Claude

## 블로그 포스팅 규칙

### 자동 예약 발행 시스템
- **GitHub Actions**가 매일 **오전 9시 (KST)**에 자동 실행
- `drafts/schedule.json`에서 오늘 날짜의 포스트 확인
- 해당 포스트를 `blog/` 폴더로 이동하고 `blog.html` 업데이트 후 자동 배포

### 포스트 생성 워크플로우
1. **포스트 파일 생성**: `drafts/` 폴더에 저장
   - `drafts/post-{N}-ko.html` (한국어)
   - `drafts/post-{N}-en.html` (영어)
   - `drafts/post-{N}.html` (기본)

2. **예약 정보 등록**: `drafts/schedule.json`에 추가
   ```json
   {
     "episode": 18,
     "publish_date": "2026-01-20",
     "title_ko": "제목",
     "title_en": "Title",
     "description_ko": "설명",
     "description_en": "Description",
     "emoji": "🎯",
     "gradient": "from-indigo-400 to-purple-500",
     "files": {
       "ko": "post-18-ko.html",
       "en": "post-18-en.html",
       "default": "post-18.html"
     }
   }
   ```

3. **자동 발행**: 발행일 오전 9시에 GitHub Actions가 자동 처리

### 현재 상태
- **발행 완료**: Episode 16 (2026-01-18)
- **예약 대기**: Episode 17~21 (2026-01-19 ~ 2026-01-23) - 자동 발행 예정
- **다음 포스트 예약일**: 2026-01-24

### 수동 발행
긴급 발행이 필요한 경우:
1. GitHub Actions > "Scheduled Blog Post Publish" > "Run workflow" 클릭
2. 또는 사용자가 "Episode N 배포해줘" 요청

### 그라데이션 색상 옵션
- `from-indigo-400 to-purple-500`
- `from-pink-400 to-rose-500`
- `from-emerald-400 to-teal-500`
- `from-blue-400 to-cyan-500`
- `from-amber-400 to-orange-500`
- `from-violet-400 to-fuchsia-500`
- `from-green-400 to-lime-500`
- `from-sky-400 to-indigo-500`
- `from-rose-400 to-red-500`

## SEO 가이드라인 (Google & Naver 기준)

### 핵심 원칙

1. **콘텐츠 품질 우선**
   - 독창적이고 가치 있는 콘텐츠 제공
   - 사용자가 북마크하고 공유하고 싶어하는 콘텐츠 작성
   - 단순 키워드 반복 금지 - 자연스러운 문맥에서 사용

2. **AI 생성 콘텐츠 정책 (Google)**
   - AI 사용 자체는 허용, 단 부가가치 필수
   - 금지: 노력 없이 대량 페이지 자동 생성 (스팸 정책 위반)
   - 필수: 정확성, 품질, 관련성 검토 후 게시
   - 권장: AI 사용 시 투명하게 공개

### 필수 메타 요소

모든 HTML 페이지에 반드시 포함:

```html
<!-- 1. Title (50-60자 권장, 핵심 키워드 앞쪽 배치) -->
<title>페이지 제목 | 사이트명</title>

<!-- 2. Meta Description (150-160자 권장, 행동 유도 문구 포함) -->
<meta name="description" content="명확하고 매력적인 설명">

<!-- 3. Canonical URL (중복 콘텐츠 방지) -->
<link rel="canonical" href="https://smartaitest.com/page-url">

<!-- 4. Open Graph (SNS 공유용) -->
<meta property="og:title" content="제목">
<meta property="og:description" content="설명">
<meta property="og:image" content="https://smartaitest.com/image.png">
<meta property="og:url" content="https://smartaitest.com/page-url">
<meta property="og:type" content="website">
<meta property="og:locale" content="ko_KR">

<!-- 5. Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="제목">
<meta name="twitter:description" content="설명">
<meta name="twitter:image" content="https://smartaitest.com/image.png">

<!-- 6. 다국어 지원 (hreflang) -->
<link rel="alternate" hreflang="ko" href="https://smartaitest.com/ko/page">
<link rel="alternate" hreflang="en" href="https://smartaitest.com/en/page">
<link rel="alternate" hreflang="x-default" href="https://smartaitest.com/page">
```

### HTML 구조 규칙

1. **H1 태그**: 페이지당 정확히 1개만 사용
2. **헤딩 계층**: H1 → H2 → H3 순서 준수 (건너뛰기 금지)
3. **이미지**: 모든 `<img>`에 `alt` 속성 필수
   ```html
   <img src="image.jpg" alt="이미지 내용을 설명하는 텍스트">
   ```
4. **링크**: 의미 있는 앵커 텍스트 사용
   - ❌ "여기 클릭" / "더보기"
   - ✅ "AI 궁합 테스트 시작하기"

### 구조화된 데이터 (Schema.org)

JSON-LD 형식으로 `<head>`에 추가:

```html
<!-- 웹사이트 기본 정보 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AI Test Lab",
  "url": "https://smartaitest.com",
  "description": "AI 기반 성격 테스트 및 인생 분석 서비스"
}
</script>

<!-- FAQ 페이지 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "질문",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "답변"
    }
  }]
}
</script>

<!-- 블로그 포스트 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "제목",
  "datePublished": "2026-01-20",
  "author": {"@type": "Organization", "name": "AI Test Lab"}
}
</script>
```

### 기술적 SEO 체크리스트

1. **성능 최적화**
   - LCP (Largest Contentful Paint) < 2.5초
   - CLS (Cumulative Layout Shift) < 0.1
   - FID (First Input Delay) < 100ms

2. **모바일 최적화**
   - 반응형 디자인 필수
   - 뷰포트 메타 태그 설정
   - 터치 타겟 최소 48x48px

3. **크롤링 최적화**
   - `robots.txt` 올바르게 설정
   - `sitemap.xml` 제출 및 최신 유지
   - 404 에러 최소화

4. **보안**
   - HTTPS 필수
   - 혼합 콘텐츠 (HTTP 리소스) 금지

### 네이버 SEO 특수 사항

1. **네이버 서치어드바이저 등록** 필수
2. **네이버 웹마스터 도구 진단** 4가지 필수 항목:
   - `<title>` 요소
   - `<meta name="description">` 요소
   - `<h1>` 헤딩 요소
   - 이미지 `alt` 속성
3. 한국어 콘텐츠는 자연스러운 문장 구조 중요

### 콘텐츠 작성 가이드

1. **제목 작성**
   - 핵심 키워드를 앞쪽에 배치
   - 숫자, 질문형, 이모지 활용으로 클릭률 향상
   - 예: "AI 궁합 테스트: 연인과의 궁합을 1분 만에 확인"

2. **본문 작성**
   - 서론에서 핵심 내용 요약
   - 단락을 짧게 유지 (3-4문장)
   - 불릿 포인트, 번호 목록 적극 활용
   - 이미지/표 등 시각 자료 포함

3. **내부 링크**
   - 관련 페이지 간 상호 링크
   - 앵커 텍스트에 키워드 포함

---

## 프로젝트 정보

- **사이트**: smartaitest.com
- **AdSense Publisher ID**: ca-pub-6241798439911569
- **지원 언어**: 한국어(ko), 영어(en), 일본어(ja), 중국어(zh), 스페인어(es)
- **블로그 구조**:
  - `blog/ko/post-{N}.html` (한국어)
  - `blog/en/post-{N}.html` (영어)
  - `blog/post-{N}.html` (기본/한국어)
  - `blog.html` (목록 페이지)
  - `drafts/` (예약 대기 포스트)
  - `drafts/schedule.json` (예약 스케줄)
