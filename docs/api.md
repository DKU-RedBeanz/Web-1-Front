# 백엔드 API 계약 정리 — Sprint 2

[Web-1-Back](https://github.com/DKU-RedBeanz/Web-1-Back) 이슈에 올라온 **설계 초안**을 프론트 기준으로 정리했습니다. 멘토 확정 전이므로 계약이 바뀌면 이 문서와 `src/types/`를 함께 고칩니다. 현재 화면은 실제 API 대신 샘플 데이터로 같은 형태를 흉내 냅니다.

## 회원·인증 (Back #7·#8)

| 요청 | 기능 | 권한 | 응답 | 프론트 화면 |
|---|---|---|---|---|
| `POST /api/users` | 회원가입 | 공개 | 201 / 400 / 409(아이디·이메일 중복) | `/signup` |
| `POST /api/auth/login` | 로그인 | 공개 | 200(내 정보) / 400 / 401 | `/login` |
| `POST /api/auth/logout` | 로그아웃(세션 삭제) | 현재 세션 | 204 | `/mypage` 로그아웃 버튼 |
| `GET /api/users/me` | 내 정보 | 로그인 필요 | 200 / 401 | `/mypage`, 헤더 로그인 상태 |

```json
// 회원가입 요청 (role은 보내지 않음, 서버가 USER로 저장)
{ "loginId": "redbeanz", "email": "study@redbeanz.kr", "password": "********", "nickname": "팥빙수" }
// 로그인 요청
{ "loginId": "redbeanz", "password": "********" }
// 로그인·내 정보 응답 (비밀번호·해시 없음)
{ "id": 1, "loginId": "redbeanz", "email": "study@redbeanz.kr", "nickname": "팥빙수", "role": "USER", "createdAt": "2026-09-24T12:00:00" }
```

타입: [src/types/user.ts](../src/types/user.ts)

### 입력 규칙 (프론트 검사 = 서버 400 기준)

| 필드 | 규칙 | 중복 | 오류 문구 |
|---|---|---|---|
| 아이디 `loginId` | 영문 소문자·숫자 4~20자 | 불가 (409) | "아이디는 영문 소문자·숫자 4~20자로 입력하세요." / "이미 사용 중인 아이디입니다." |
| 이메일 `email` | 이메일 형식, 100자 이하 | 불가 (409) | "올바른 이메일 형식이 아닙니다." / "이미 가입된 이메일입니다." |
| 비밀번호 `password` | 8~64자 | — | "비밀번호는 8~64자로 입력하세요." |
| 닉네임 `nickname` | 2~20자 | 허용 | "닉네임은 2~20자로 입력하세요." |

- 로그인 실패(401)는 아이디·비밀번호 중 무엇이 틀렸는지 구분하지 않고 "아이디 또는 비밀번호가 올바르지 않습니다."로 안내합니다.
- 인증 방식은 **세션(JSESSIONID 쿠키)** 이 제안되어 있습니다. 연결 시 `fetch(..., { credentials: 'include' })`와 CSRF 토큰 전달이 필요합니다.

## 스터디 조회 (Back #9)

| 요청 | 기능 | 권한 | 응답 | 프론트 화면 |
|---|---|---|---|---|
| `GET /api/studies?goal=&level=&time=&mode=` | 조건별 목록 | 공개 | 200, 없으면 `{ "content": [] }` | `/studies` |
| `GET /api/studies/{id}` | 상세 | 로그인 필요 | 200 / 401 / 404 | `/studies/:studyId` |

- 상세는 로그인 필요 정책에 맞춰, 비로그인 상태로 상세에 들어가면 `/login`으로 보내고 로그인 후 원래 상세로 돌아옵니다.
- 목록 응답은 배열을 `content`로 감싼 형태입니다. 필드명(`title`, `summary`, `memberCount`, `capacity`, `schedule`, `location`, `leaderNickname`, `tags`)은 현재 `src/types/study.ts`와 같습니다.
- **차이점:** 조건 값이 백엔드 초안에서는 대문자 코드(`VOCA`, `BEGINNER`, `WEEKDAY_EVENING`, `ONLINE`)이고 프론트는 소문자(`vocabulary`, `beginner`, `weekday-evening`, `online`)입니다. 코드 값이 확정되면 `src/types/study.ts`의 값과 URL 쿼리를 맞춥니다.

## 남은 질문

| 항목 | 이슈 | 프론트 영향 |
|---|---|---|
| 아이디·이메일 분리, 닉네임 중복 허용, 비밀번호 8~64자 확정 | Back #7 | 회원가입 검사 규칙 |
| 세션 방식 확정, CORS vs Vite 프록시, CSRF 토큰 전달 | Back #8 | API 호출 설정 |
| 조건 enum 코드 값, 페이지네이션 여부 | Back #9 | 조건 타입·URL 쿼리, 목록 화면 |
| 참여 중인 스터디를 `/me`에 포함할지, 별도 API인지 | — | 마이페이지 (현재 샘플) |
| 아이디 찾기·비밀번호 재설정 API 일정 | Back #7·#8 제외 범위 | `/find-id`, `/reset-password` (현재 샘플) |
