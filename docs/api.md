# 백엔드 API 계약 정리 — Sprint 2

[Web-1-Back](https://github.com/DKU-RedBeanz/Web-1-Back)의 API 계약을 프론트 기준으로 정리했습니다. 회원가입과 아이디 중복 검사는 백엔드 API를 호출하며, 로그인은 샘플 계정을 사용합니다.

## 회원·인증 (Back #7·#8)

| 요청 | 기능 | 권한 | 응답 | 프론트 화면 |
|---|---|---|---|---|
| `POST /api/users` | 회원가입 | 공개 | 201 / 400 / 409(아이디·이메일 중복) | `/signup` |
| `GET /api/users/login-id-availability?loginId=redbeanz` | 아이디 중복 검사 | 공개 | 200 (`{ "available": true }` 또는 `{ "available": false }`) / 400 | `/signup` |
| `GET /api/users/me` | 내 정보 | HTTP Basic | 200 / 401 | 연동 예정 |
| `GET /api/users` | 회원 목록 | 관리자 | 200 / 401 / 403 | — |
| `PATCH /api/users/me` | 내 정보 수정 | HTTP Basic, CSRF | 200 / 400 / 409 | — |
| `DELETE /api/users/me` | 회원 탈퇴 | HTTP Basic, CSRF | 204 / 400 / 403 | — |

```json
// 회원가입 요청 (role은 보내지 않음, 서버가 USER로 저장)
{ "loginId": "redbeanz", "email": "study@redbeanz.kr", "password": "********", "nickname": "팥빙수" }
// 회원 정보 응답 (비밀번호·해시 없음)
{ "id": 1, "loginId": "redbeanz", "email": "study@redbeanz.kr", "nickname": "팥빙수", "role": "USER", "createdAt": "2026-09-24T12:00:00" }
```

타입: [src/types/user.ts](../src/types/user.ts)

로컬에서는 백엔드의 `db/01_create_users.sql`을 MySQL에 적용한 뒤 8080 포트에서 백엔드를 실행합니다. `npm run dev`로 띄운 Vite는 `/api` 요청을 백엔드로 전달합니다. 배포 환경에서도 같은 경로를 백엔드에 연결해야 합니다.

### 입력 규칙 (프론트 검사 = 서버 400 기준)

| 필드 | 규칙 | 중복 | 오류 문구 |
|---|---|---|---|
| 아이디 `loginId` | 영문 소문자·숫자 4~20자 | 불가 (409) | "아이디는 영문 소문자·숫자 4~20자로 입력하세요." / "이미 사용 중인 아이디입니다." |
| 이메일 `email` | 이메일 형식, 100자 이하 | 불가 (409) | "올바른 이메일 형식이 아닙니다." / "이미 가입된 이메일입니다." |
| 비밀번호 `password` | 8~64자, UTF-8 기준 72바이트 이하, 공백만 입력 불가 | — | "비밀번호는 8~64자로 입력하세요." |
| 닉네임 `nickname` | 2~20자 | 허용 | "닉네임은 2~20자로 입력하세요." |

- 보호된 회원 API는 HTTP Basic 인증을 사용합니다. 정보 수정과 탈퇴에는 내 정보 조회에서 받은 `JSESSIONID` 쿠키와 `X-CSRF-TOKEN` 헤더를 함께 보냅니다.

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
| 로그인·로그아웃 API 일정 | Back #8 | `/login`, 헤더 로그인 상태 (현재 샘플) |
| 조건 enum 코드 값, 페이지네이션 여부 | Back #9 | 조건 타입·URL 쿼리, 목록 화면 |
| 참여 중인 스터디를 `/me`에 포함할지, 별도 API인지 | — | 마이페이지 (현재 샘플) |
| 아이디 찾기·비밀번호 재설정 API 일정 | Back #7·#8 제외 범위 | `/find-id`, `/reset-password` (현재 샘플) |
