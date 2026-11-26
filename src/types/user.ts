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

export type UpdateUserRequest = {
  email?: string
  nickname?: string
  password?: string
}

// HTTP Basic 인증 입력
export type LoginRequest = {
  loginId: string
  password: string
}
