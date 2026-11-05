// 입력 오류 문구는 스타일 가이드(#6) Input 규칙을, 길이·형식은 Back #7 회원 데이터 설계 초안을 따릅니다.
const LOGIN_ID_PATTERN = /^[a-z0-9]{4,20}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLoginId(loginId: string): string | undefined {
  if (!loginId) return '아이디를 입력하세요.'
  if (!LOGIN_ID_PATTERN.test(loginId)) return '아이디는 영문 소문자·숫자 4~20자로 입력하세요.'
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return '이메일을 입력하세요.'
  if (email.trim().length > 100 || !EMAIL_PATTERN.test(email.trim())) return '올바른 이메일 형식이 아닙니다.'
}

// 원문 8~64자 (Back #7 질문 2: 길이 규칙만 두는 안으로 멘토 확인 중)
export function validateNewPassword(password: string): string | undefined {
  if (!password) return '비밀번호를 입력하세요.'
  if (password.length < 8 || password.length > 64) return '비밀번호는 8~64자로 입력하세요.'
}

// 2~20자, 중복 허용
export function validateNickname(nickname: string): string | undefined {
  const length = nickname.trim().length
  if (length === 0) return '닉네임을 입력하세요.'
  if (length < 2 || length > 20) return '닉네임은 2~20자로 입력하세요.'
}

// 아이디 찾기 결과에서 앞 2자만 보여줍니다. 예: redbeanz → re******
export function maskLoginId(loginId: string): string {
  return loginId.slice(0, 2) + '*'.repeat(Math.max(loginId.length - 2, 2))
}
