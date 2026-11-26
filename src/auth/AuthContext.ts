import { createContext, useContext } from 'react'
import type { LoginRequest, UpdateUserRequest, User } from '../types/user'

// 프론트 샘플 계정: API 응답(User)에 비밀번호와 참여 스터디(별도 API 미정)를 더한 형태
export type SampleAccount = User & {
  password: string
  studyIds: number[]
}

export type AuthContextValue = {
  user: User | null
  login: (request: LoginRequest) => Promise<void>
  logout: () => void
  update: (request: UpdateUserRequest) => Promise<void>
  deleteAccount: (password: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.')
  return value
}
