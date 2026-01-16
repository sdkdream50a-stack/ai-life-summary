# 블로그 다국어 관리 가이드

## 파일 구조

```
blog/
├── ko/                    # 한국어 블로그 글
│   ├── post-1.html
│   ├── post-2.html
│   └── ...
├── en/                    # 영어 블로그 글
│   ├── post-1.html
│   ├── post-2.html
│   └── ...
└── (기존 post-*.html)     # 레거시 파일 (추후 정리)
```

## 새 블로그 글 작성 워크플로우

### 1단계: 한국어 글 작성

1. 한국어로 블로그 글 내용을 작성합니다.
2. `/blog/ko/post-{번호}.html` 파일을 생성합니다.

### 2단계: AI에게 영어 번역 요청

다음과 같이 요청하세요:

```
/blog/ko/post-{번호}.html 파일을 영어로 번역해서
/blog/en/post-{번호}.html 파일로 생성해줘
```

### 3단계: AI가 자동으로 처리하는 내용

- 제목, 본문, 메타 태그 번역
- SEO 태그 자동 설정:
  - `<html lang="en">` 또는 `<html lang="ko">`
  - `<link rel="alternate" hreflang="...">` 태그
  - Open Graph 태그의 locale 설정
- 언어 전환 버튼 자동 추가

## SEO 핵심 태그 설명

### hreflang 태그 (필수)

각 페이지 `<head>`에 포함되어야 합니다:

```html
<!-- 한국어 페이지 -->
<link rel="alternate" hreflang="ko" href="https://ailifesummary.com/blog/ko/post-1.html">
<link rel="alternate" hreflang="en" href="https://ailifesummary.com/blog/en/post-1.html">
<link rel="alternate" hreflang="x-default" href="https://ailifesummary.com/blog/en/post-1.html">
```

- `hreflang="ko"`: 한국어 버전 URL
- `hreflang="en"`: 영어 버전 URL
- `hreflang="x-default"`: 기본 언어 (영어 권장 - 글로벌 SEO)

### canonical 태그

각 언어 버전에 고유한 canonical URL:

```html
<!-- 한국어 페이지 -->
<link rel="canonical" href="https://ailifesummary.com/blog/ko/post-1.html">

<!-- 영어 페이지 -->
<link rel="canonical" href="https://ailifesummary.com/blog/en/post-1.html">
```

### Open Graph locale

```html
<!-- 한국어 -->
<meta property="og:locale" content="ko_KR">

<!-- 영어 -->
<meta property="og:locale" content="en_US">
```

## 언어 전환 버튼

모든 블로그 글에 헤더에 언어 전환 버튼이 포함됩니다:

```html
<!-- Desktop -->
<div class="flex items-center border rounded-lg overflow-hidden">
    <a href="/blog/ko/post-1.html" class="lang-switch active">🇰🇷 한국어</a>
    <a href="/blog/en/post-1.html" class="lang-switch">🇺🇸 English</a>
</div>

<!-- Mobile -->
<div class="flex items-center space-x-2 pt-3 border-t">
    <span class="text-sm text-gray-500">언어:</span>
    <a href="/blog/ko/post-1.html" class="px-3 py-1 bg-primary text-white text-sm rounded">한국어</a>
    <a href="/blog/en/post-1.html" class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded">English</a>
</div>
```

## 번역 요청 예시

### 새 글 번역 요청

```
새로 작성한 한국어 블로그 글이야:

[여기에 한국어 내용 붙여넣기]

이 내용을 기반으로:
1. /blog/ko/post-16.html 한국어 버전 생성
2. /blog/en/post-16.html 영어 번역 버전 생성
해줘
```

### 기존 글 마이그레이션 요청

```
/blog/post-2.html 파일을 다국어 구조로 마이그레이션해줘
- /blog/ko/post-2.html (한국어)
- /blog/en/post-2.html (영어 번역)
```

## 체크리스트

새 블로그 글 작성 시:

- [ ] 한국어 원본 `/blog/ko/post-{번호}.html` 생성
- [ ] 영어 번역 `/blog/en/post-{번호}.html` 생성
- [ ] hreflang 태그 양쪽 파일에 포함 확인
- [ ] canonical URL 각각 설정 확인
- [ ] 언어 전환 버튼 링크 확인
- [ ] JSON-LD 스키마 inLanguage 설정 확인
- [ ] 배포 후 Google Search Console에서 확인

## 구글 애드센스 최적화 팁

1. **언어별 광고 단위**: 한국어/영어 페이지에 다른 광고 단위 ID 사용 가능
2. **지역 타겟팅**: 언어별로 다른 지역의 광고주가 입찰하여 수익 최적화
3. **콘텐츠 매칭**: 각 언어에 맞는 광고가 표시되어 클릭률 향상

## 참고 자료

- [Google 다국어 사이트 가이드](https://developers.google.com/search/docs/specialty/international)
- [hreflang 태그 사용법](https://developers.google.com/search/docs/specialty/international/localized-versions)
