# Project Guidelines for Claude

## 블로그 포스팅 규칙

### 예약 발행 시스템
- **예약 발행 = 해당 날짜에 실제 배포**
- 포스트 파일은 미리 `drafts/` 폴더에 생성
- 발행일에 `blog/` 폴더로 이동 + `blog.html` 업데이트 + git push

### 예약 발행 워크플로우
1. **포스트 생성 시**: `drafts/` 폴더에 파일 생성
   - `drafts/post-{N}-ko.html`
   - `drafts/post-{N}-en.html`
   - `drafts/post-{N}.html`
2. **발행일에 배포 요청 시**:
   - 파일을 `blog/ko/`, `blog/en/`, `blog/`로 이동
   - `blog.html`에 포스트 카드 추가
   - git commit & push

### 현재 상태
- **발행 완료**: Episode 16 (2026-01-18) - 사이트에 표시됨
- **예약 대기**: Episode 17 (2026-01-19) - `drafts/` 폴더에 있음
- **다음 포스트 예약일**: 2026-01-20

### 예약 대기 목록
| Episode | 발행 예정일 | 제목 | 상태 |
|---------|------------|------|------|
| 17 | 2026-01-19 | 웹 개발 용어 정복: 50대 비전공자를 위한 쉬운 번역 가이드 | drafts/ 대기중 |

### 포스트 생성 시 체크리스트
1. 예약 대기 목록에서 다음 발행 예정일 확인
2. 다음 Episode 번호 = 최신 예약 + 1
3. 다음 날짜 = 최신 예약 날짜 + 1일
4. `drafts/` 폴더에 파일 생성
5. 예약 대기 목록 업데이트

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
