# 공통 디자인 스타일 가이드 — Sprint 2

관련 이슈: [Front #6](https://github.com/DKU-RedBeanz/Web-1-Front/issues/6) · Figma: `RedBeanz 1팀 - 스터디 탐색 와이어프레임` › **스타일 가이드 (#6)** 페이지

Figma 변수(`RedBeanz Tokens`)와 [src/index.css](../src/index.css)의 CSS 변수 이름을 1:1로 맞췄습니다. 화면에서는 색상 값(`#8c2933`)을 직접 쓰지 않고 변수(`var(--primary)`)를 씁니다.

## 색상

| 구분 | 변수 | 값 | 용도 |
|---|---|---|---|
| 메인 | `--primary` | `#8C2933` | 주요 버튼·선택·링크 (팥색) |
| | `--primary-hover` | `#74202A` | 메인 hover |
| | `--primary-soft` | `#F7ECED` | 선택된 칩 배경 |
| 서브 | `--secondary` | `#D99A2B` | 강조 배지·포인트 (호박색) |
| | `--secondary-soft` | `#FDF3E1` | 서브 연한 배경 |
| | `--secondary-text` | `#8A5A00` | 서브 배경 위 텍스트 |
| 배경·테두리 | `--bg` | `#FAF9F7` | 페이지 배경 |
| | `--surface` | `#FFFFFF` | 카드·입력 배경 |
| | `--surface-muted` | `#F2F0ED` | 보조 배경·hover |
| | `--border` | `#E2DDD7` | 기본 테두리 |
| | `--border-strong` | `#C8C1BA` | 버튼·강한 테두리 |
| | `--focus-ring` | `#E3B9BD` | 포커스 링 |
| 텍스트 | `--text` | `#1B1B1F` | 본문·제목 |
| | `--text-secondary` | `#55555E` | 보조 텍스트 |
| | `--text-muted` | `#6E6E78` | 설명·캡션 |
| | `--text-placeholder` | `#9A9AA3` | placeholder |
| | `--text-on-primary` | `#FFFFFF` | 메인 위 텍스트 |
| 상태 | `--error` / `--error-soft` | `#D42A1E` / `#FEF3F2` | 오류 테두리·메시지 / 배경 |
| | `--success` / `--success-soft` | `#1B7A4B` / `#E8F5EE` | 성공 메시지 / 배경 |
| | `--disabled-bg` / `--disabled-text` | `#EEEBE8` / `#A8A29C` | 비활성 |

오류 색은 메인(팥색)과 구분되도록 더 밝은 빨강을 씁니다.

## 폰트

공통 폰트는 **Noto Sans KR** (Google Fonts, 400·500·700)이며 `index.html`에서 불러옵니다. 기본 본문은 15px, 줄간격 1.6입니다.

| 스타일 | 크기 / 굵기 / 줄간격 | 적용 |
|---|---|---|
| Heading/H1 | 24 / Bold / 140% | `h1` 페이지 제목 |
| Heading/H2 | 20 / Bold / 140% | `h2` 섹션 제목 |
| Heading/H3 | 17 / Bold / 145% | `h3` 카드 제목 |
| Body/Base | 15 / Regular / 160% | 본문 (기본) |
| Body/Small | 13 / Regular / 155% | `.small` 보조 설명 |
| Label/Base | 14 / Medium / 150% | 입력 라벨·칩 |
| Label/Button | 15 / Bold / 150% | 버튼 |
| Caption | 12 / Regular / 150% | `.caption`, 도움말·오류 메시지 |

## 간격·모서리

4px 단위(`--space-1` 4px ~ `--space-8` 32px). 카드 안 여백 20px, 폼 필드 간격 16px, 섹션 간격 24~32px.
모서리는 버튼·입력 `--radius-md`(8), 카드 `--radius-lg`(12), 칩 `--radius-pill`(999).

## 버튼

높이 44px · 좌우 20px · radius 8. 화면의 주요 행동 1개만 Primary를 씁니다.

```tsx
<button className="button primary">스터디 찾기</button>   {/* Primary */}
<Link to="/" className="button">조건 다시 입력</Link>      {/* Secondary (기본) */}
<Link to="/signup" className="button text">회원가입</Link> {/* Text: 링크형 이동 */}
<button className="button primary block">로그인</button>   {/* 폼 제출: 폭 100% */}
```

| 상태 | 표현 |
|---|---|
| hover | 배경을 한 단계 진하게 (`--primary` → `--primary-hover`, Secondary는 `--surface-muted`) |
| focus | 키보드 포커스 시 3px 포커스 링 (`:focus-visible`) |
| disabled | `--disabled-bg` / `--disabled-text`, 커서 not-allowed |

## 입력창

라벨 + 입력창(높이 44px, radius 8) + 도움말 또는 오류 메시지 구조입니다.

```tsx
<div className="form-field">
  <label htmlFor="email">이메일</label>
  <input id="email" className="input" aria-invalid={!!error} aria-describedby="email-message" />
  {error ? (
    <p id="email-message" className="field-error">{error}</p>
  ) : (
    <p id="email-message" className="field-help">로그인에 사용할 이메일</p>
  )}
</div>
```

| 상태 | 표현 |
|---|---|
| 기본 | `--border` 테두리, placeholder는 `--text-placeholder` |
| 포커스 | `--primary` 테두리 + 3px `--focus-ring` |
| 오류 | `aria-invalid="true"`이면 `--error` 테두리, 아래 메시지 `.field-error` |
| 비활성 | `disabled` → `--disabled-bg` 배경 |

- 오류 메시지는 입력창 바로 아래에 표시하고, 제출 시 첫 오류 필드로 포커스를 옮깁니다.
- 문구: 필수값 누락 "○○을(를) 입력하세요." / 형식 오류 "올바른 이메일 형식이 아닙니다." / 불일치 "비밀번호가 일치하지 않습니다."
- placeholder는 예시용이며 라벨을 대신하지 않습니다.
