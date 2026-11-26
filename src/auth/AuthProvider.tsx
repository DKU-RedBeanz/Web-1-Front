import { useRef, useState, type ReactNode } from 'react'
import { deleteMe, getMe, updateMe, UserApiError } from '../api/users'
import type { LoginRequest, User } from '../types/user'
import { AuthContext, type AuthContextValue } from './AuthContext'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // 현재 백엔드의 Basic 인증에 맞춥니다. 비밀번호는 브라우저 저장소에 저장하지 않습니다.
  const credentials = useRef<LoginRequest | null>(null)

  const logout = () => {
    credentials.current = null
    setUser(null)
  }

  const requireCredentials = () => {
    if (!credentials.current) throw new Error('다시 로그인해 주세요.')
    return credentials.current
  }

  const handleError = (error: unknown): never => {
    if (error instanceof UserApiError && (error.status === 401 || error.status === 404)) logout()
    throw error
  }

  const value: AuthContextValue = {
    user,
    async login(request) {
      const account = await getMe(request)
      credentials.current = { ...request }
      setUser(account)
    },
    logout,
    async update(request) {
      const current = requireCredentials()
      try {
        const account = await updateMe(current, request)
        if (request.password) credentials.current = { ...current, password: request.password }
        setUser(account)
      } catch (error) {
        handleError(error)
      }
    },
    async deleteAccount(password) {
      const current = requireCredentials()
      if (!user) throw new Error('다시 로그인해 주세요.')
      try {
        await deleteMe(current, user.id, password)
      } catch (error) {
        handleError(error)
      }
    },
  }

  return <AuthContext value={value}>{children}</AuthContext>
}
