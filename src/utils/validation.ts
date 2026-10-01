// 입력 오류 문구는 스타일 가이드(#6) Input 규칙을 따릅니다.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return '이메일을 입력하세요.'
  if (!EMAIL_PATTERN.test(email.trim())) return '올바른 이메일 형식이 아닙니다.'
}

// 회원가입 기준: 영문·숫자 포함 8자 이상 (Back #7과 확정 전 가정)
export function validateNewPassword(password: string): string | undefined {
  if (!password) return '비밀번호를 입력하세요.'
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return '영문·숫자 포함 8자 이상 입력하세요.'
  }
}

export function validateNickname(nickname: string): string | undefined {
  const length = nickname.trim().length
  if (length === 0) return '닉네임을 입력하세요.'
  if (length < 2 || length > 10) return '닉네임은 2~10자로 입력하세요.'
}

// 아이디 찾기 결과에서 이메일 일부를 가립니다. 예: study@redbeanz.kr → st***@redbeanz.kr
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  return `${local.slice(0, 2)}***@${domain}`
}
