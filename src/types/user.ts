// 회원 데이터는 Back #7(회원가입)·#8(로그인·내 정보) 설계 초안의 요청·응답 필드를 따릅니다.
// 멘토 확정 전 초안이므로 계약이 바뀌면 여기부터 맞춥니다.

// GET /api/users/me, POST /api/auth/login 응답 (비밀번호·해시 없음)
export type User = {
  id: number
  loginId: string
  email: string
  nickname: string
  role: 'USER'
  createdAt: string
}

// POST /api/users 요청 — role은 요청에서 받지 않고 서버가 USER로 저장합니다.
export type SignupRequest = {
  loginId: string
  email: string
  password: string
  nickname: string
}

// POST /api/auth/login 요청
export type LoginRequest = {
  loginId: string
  password: string
}

// 409 응답: 아이디·이메일 중 어느 쪽이 중복인지 구분해 필드 아래에 안내합니다.
export type SignupResult = 'ok' | 'duplicate-login-id' | 'duplicate-email'
