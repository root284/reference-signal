# Reference Signal

레퍼런스 유튜브 채널의 최근 영상 성과를 분석하고, 인사이트와 기획/스크립트 초안으로 이어주는 내부 웹앱입니다.

## 로컬 실행

```bash
cp .env.example .env
# .env에 YOUTUBE_API_KEY 입력
# AI 기능을 사용하려면 OPENAI_API_KEY도 입력
npm start
```

브라우저에서 `http://localhost:3000`을 엽니다.

## Railway 배포

1. GitHub 저장소에 이 폴더를 push합니다.
2. Railway에서 `New Project` → `Deploy from GitHub repo`를 선택합니다.
3. Variables에 `YOUTUBE_API_KEY`를 추가합니다.
4. AI 분석/기획/스크립트 생성을 위해 `OPENAI_API_KEY`를 추가합니다.
5. 선택적으로 `OPENAI_MODEL`을 추가합니다. 기본값은 `gpt-5.5`입니다.
6. Railway가 `npm start`로 앱을 실행합니다.
7. tools.qpola.net의 링크 모음에 Railway 배포 URL을 추가합니다.

## YouTube API 사용 범위

- `channels.list`: 핸들/채널 ID로 채널 정보와 업로드 재생목록 ID를 가져옵니다.
- `playlistItems.list`: 업로드 재생목록에서 최근 영상 ID를 가져옵니다.
- `videos.list`: 조회수, 좋아요 수, 댓글 수, 길이, 썸네일 등 영상 통계를 가져옵니다.

채널 URL은 `youtube.com/@handle` 또는 `youtube.com/channel/UC...` 형식을 우선 지원합니다.
