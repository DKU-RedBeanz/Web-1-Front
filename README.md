# 레드빈즈 웹개발 프로젝트 1팀 — 프론트엔드

외부 AI API를 활용한 영단어·회화 학습과, 조건에 맞는 스터디 추천·연결을 제공하는 서비스의 프론트엔드 저장소입니다.

## 프로젝트 정보

- 상태: 초기 구성 중·미릴리스
- 기획 영역: 로그인·회원 정보, AI 학습, 스터디 탐색·추천·연결, 내부 소통
- 프론트 기술(제안): React 19 + TypeScript, Vite, React Router, Node.js 22 LTS + npm — [Front #1](https://github.com/DKU-RedBeanz/Web-1-Front/issues/1)에서 멘토 확인 중
- 미정: AI 제공사·추천 방식, 댓글 또는 채팅 선택
- 라이선스: [MIT](LICENSE)

## 역할 및 Sprint 1

담당: **박인찬** / 마감: **2026-09-24(목)**

[Front #1](https://github.com/DKU-RedBeanz/Web-1-Front/issues/1)에서 프론트 기술을 제안·확정하고 기본 프로젝트 및 `스터디 조건 입력 → 추천 목록 → 스터디 상세`의 간단한 화면을 구성합니다. 샘플 데이터로 화면을 확인하며 실제 AI·로그인·백엔드 연동과 배포는 이번 과제에 포함하지 않습니다. 프론트의 로컬 MySQL 연결은 필수가 아닙니다.

백엔드는 유다현님이 공통 프로젝트·MySQL·.env, 유관우님이 Security 초기 설정을 맡습니다. 필요한 데이터·API 계약은 함께 조율합니다.

## 실행 방법

### 요구 버전

| 항목 | 버전 |
|---|---|
| Node.js | 22 LTS (22.22.0 이상) |
| npm | Node.js에 포함된 버전 사용 |
| React | 19 |
| Vite | 8 |
| React Router | 8 |
| TypeScript | 6 |

`node -v`로 버전을 확인합니다. 22.22.0 미만이면 [Node.js 22 LTS](https://nodejs.org/)를 설치합니다.

### 명령

```bash
git clone https://github.com/DKU-RedBeanz/Web-1-Front.git
cd Web-1-Front
npm install        # 의존성 설치 (package-lock.json 기준)
npm run dev        # 개발 서버 실행 → http://localhost:5173
npm run build      # 타입 검사 + 프로덕션 빌드 → dist/
npm run preview    # 빌드 결과 확인 → http://localhost:4173
npm run lint       # oxlint 검사
```

### 현재 화면

샘플 데이터로 `스터디 조건 입력(/) → 추천 목록(/studies) → 스터디 상세(/studies/:id)` 흐름과 결과 없음 상태를 확인할 수 있습니다. 실제 백엔드·AI·로그인 연동은 없습니다. 화면별 필요한 정보와 백엔드 질문은 [docs/study-flow.md](docs/study-flow.md)에 정리했습니다.

```text
src/
├── App.tsx               # 라우트 구성
├── pages/                # 조건 입력·추천 목록·상세 화면
├── components/           # 공통 UI (조건 배지)
├── data/sampleStudies.ts # 샘플 스터디 데이터
├── types/study.ts        # 스터디·조건 타입과 표시 라벨
└── utils/recommend.ts    # 임시 추천(조건 일치 필터)
```

프론트 코드에는 AI API 비밀키나 DB 접속 정보를 넣지 않습니다.

## 협업 안내

이슈 → 담당자 지정 → 브랜치 → PR → 리뷰 → 병합 순서로 진행합니다. AI를 활용해도 되며 직접 실행한 결과와 주요 동작을 함께 설명합니다.

- [Sprint 1 및 팀원별 작업](https://github.com/DKU-RedBeanz/Web-1-Back/wiki/Sprint-1)
- [작업 및 코드 리뷰 절차](https://github.com/DKU-RedBeanz/Web-1-Back/wiki/Work-and-Review)
- [Git 컨벤션](https://github.com/DKU-RedBeanz/Web-1-Back/wiki/Git-Convention)
- [요구사항 초안](https://github.com/DKU-RedBeanz/Web-1-Back/wiki/Requirements)
- [백엔드 저장소](https://github.com/DKU-RedBeanz/Web-1-Back)
- [Issue 템플릿](.github/ISSUE_TEMPLATE/task.md) · [PR 템플릿](.github/pull_request_template.md)
