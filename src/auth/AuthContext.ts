import { createContext, useContext } from 'react'

export type Account = {
  email: string
  password: string
  nickname: string
  joinedAt: string
  studyIds: number[]
}

// 화면에 노출하는 사용자 정보에는 비밀번호를 포함하지 않습니다.
export type User = Omit<Account, 'password'>

export type SignupInput = Pick<Account, 'email' | 'password' | 'nickname'>

export type AuthContextValue = {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  signup: (input: SignupInput) => 'ok' | 'duplicate-email'
  findEmailByNickname: (nickname: string) => string | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.')
  return value
}
