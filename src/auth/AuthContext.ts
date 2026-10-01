import { createContext, useContext } from 'react'
import type { LoginRequest, SignupRequest, SignupResult, User } from '../types/user'

// 프론트 샘플 계정: API 응답(User)에 비밀번호와 참여 스터디(별도 API 미정)를 더한 형태
export type SampleAccount = User & {
  password: string
  studyIds: number[]
}

export type AuthContextValue = {
  user: User | null
  // 참여 중인 스터디는 /me 포함 여부가 미정이라 샘플 데이터에서만 제공합니다.
  studyIds: number[]
  login: (request: LoginRequest) => boolean
  logout: () => void
  signup: (request: SignupRequest) => SignupResult
  findLoginIdByEmail: (email: string) => string | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.')
  return value
}
