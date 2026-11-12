// 회원 API 응답 (비밀번호·해시 없음)
export type User = {
  id: number
  loginId: string
  email: string
  nickname: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

// POST /api/users 요청 — role은 요청에서 받지 않고 서버가 USER로 저장합니다.
export type SignupRequest = {
  loginId: string
  email: string
  password: string
  nickname: string
}

// 샘플 계정 로그인 입력
export type LoginRequest = {
  loginId: string
  password: string
}
