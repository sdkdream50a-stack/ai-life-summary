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
- **예약 대기**: Episode 17 (2026-01-19), Episode 18 (2026-01-20) - 자동 발행 예정
- **다음 포스트 예약일**: 2026-01-21

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

## 프로젝트 정보

- **사이트**: goodpicknow.com
- **AdSense Publisher ID**: ca-pub-6241798439911569
- **지원 언어**: 한국어(ko), 영어(en), 일본어(ja), 중국어(zh), 스페인어(es)
- **블로그 구조**:
  - `blog/ko/post-{N}.html` (한국어)
  - `blog/en/post-{N}.html` (영어)
  - `blog/post-{N}.html` (기본/한국어)
  - `blog.html` (목록 페이지)
  - `drafts/` (예약 대기 포스트)
  - `drafts/schedule.json` (예약 스케줄)
