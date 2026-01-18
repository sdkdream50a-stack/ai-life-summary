# Blog Post Creation Skill

블로그 포스트를 생성하고 배포하는 스킬입니다.

## 사용법

```
/blog-post [콘텐츠]
```

## 입력 형식

사용자가 제공해야 하는 정보:

```
포커스 키워드: [메인 키워드]
관련 키워드 (LSI): [쉼표로 구분된 관련 키워드들]
SEO 최적화 제목: [제목]
메타 디스크립션: [설명]
===
[HTML 콘텐츠]
```

## 실행 단계

### 1단계: 기존 블로그 구조 분석

다음을 확인합니다:
- `blog/ko/` 디렉토리에서 가장 최신 post 번호 확인
- 기존 포스트의 HTML 구조 파악 (post-1.html 등 참고)
- blog.html의 포스트 목록 구조 확인

### 2단계: 새 포스트 번호 결정

- 기존 최대 post 번호 + 1 = 새 Episode 번호
- 날짜는 오늘 날짜 사용 (YYYY-MM-DD 형식)

### 3단계: 파일 생성

다음 3개 파일을 생성합니다:

1. **한국어 버전**: `blog/ko/post-{N}.html`
2. **영어 버전**: `blog/en/post-{N}.html`
3. **기본 버전**: `blog/post-{N}.html`

각 파일에 포함할 내용:
- Google AdSense 코드 (기존 포스트에서 복사)
- SEO 메타 태그 (title, description, keywords)
- Open Graph / Twitter Card 메타 태그
- hreflang 태그 (다국어 지원)
- 기존 포스트와 동일한 헤더/푸터 구조
- 사용자가 제공한 HTML 콘텐츠
- JSON-LD 스키마 (BlogPosting, FAQPage, SpeakableSpecification)

### 4단계: blog.html 업데이트

`<!-- AUTO-GENERATED POSTS END -->` 주석 바로 앞에 새 포스트 카드 추가:

```html
<!-- Post {N} -->
<article class="card-hover bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
    <div class="h-48 bg-gradient-to-br from-{color1}-400 to-{color2}-500 flex items-center justify-center">
        <span class="text-6xl">{emoji}</span>
    </div>
    <div class="p-6">
        <div class="flex items-center space-x-2 mb-3">
            <span class="text-xs text-primary font-medium bg-indigo-50 px-2 py-1 rounded">Episode {N}</span>
            <span class="text-xs text-gray-400">{YYYY-MM-DD}</span>
        </div>
        <h3 class="font-heading font-semibold text-lg mb-2 line-clamp-2">
            <span class="lang-en">{영어 제목}</span>
            <span class="lang-ko">{한국어 제목}</span>
            <span class="lang-ja">{일본어 제목}</span>
            <span class="lang-zh">{중국어 제목}</span>
            <span class="lang-es">{스페인어 제목}</span>
        </h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">
            <span class="lang-en">{영어 설명}</span>
            <span class="lang-ko">{한국어 설명}</span>
            ...
        </p>
        <a href="/blog/post-{N}.html" class="text-primary text-sm font-medium hover:underline inline-flex items-center space-x-1">
            <span>Read More</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
    </div>
</article>
```

### 5단계: 배포 (선택)

사용자에게 배포 여부를 확인한 후:

```bash
git add blog/ko/post-{N}.html blog/en/post-{N}.html blog/post-{N}.html blog.html
git commit -m "feat: add blog post {N} - {제목 요약}"
git push origin main
```

## 체크리스트

- [ ] AdSense 코드 포함 확인
- [ ] 모든 메타 태그 설정
- [ ] hreflang 태그 설정
- [ ] JSON-LD 스키마 추가
- [ ] 5개 언어 지원 (한국어, 영어, 일본어, 중국어, 스페인어)
- [ ] blog.html에 카드 추가
- [ ] git commit & push

## 그라데이션 색상 옵션

카드 배경에 사용할 수 있는 색상 조합:
- `indigo-400 to purple-500`
- `pink-400 to rose-500`
- `emerald-400 to teal-500`
- `blue-400 to cyan-500`
- `amber-400 to orange-500`
- `violet-400 to fuchsia-500`
- `green-400 to lime-500`
- `sky-400 to indigo-500`
- `rose-400 to red-500`

## 주의사항

1. 영어 버전은 한국어 콘텐츠를 번역하여 생성
2. 일본어, 중국어, 스페인어는 blog.html 카드의 제목/설명만 번역
3. 기존 포스트 스타일과 일관성 유지
4. canonical URL은 각 언어별 버전으로 설정
