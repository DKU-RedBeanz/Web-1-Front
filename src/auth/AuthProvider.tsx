import { useState, type ReactNode } from 'react'
import { SAMPLE_ACCOUNT } from '../data/sampleUser'
import type { User } from '../types/user'
import { AuthContext, type AuthContextValue, type SampleAccount } from './AuthContext'

const STORAGE_KEY = 'redbeanz:login-id'

function toUser({ password: _password, studyIds: _studyIds, ...user }: SampleAccount): User {
  return user
}

function readStoredLoginId(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStoredLoginId(loginId: string | null) {
  try {
    if (loginId) sessionStorage.setItem(STORAGE_KEY, loginId)
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // 저장소를 쓸 수 없어도 화면 상태로는 동작합니다.
  }
}

// 임시 로그인 상태: 샘플 계정을 사용합니다.
// 새로고침해도 로그인이 유지되도록 로그인한 아이디만 sessionStorage에 둡니다.
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [loginId, setLoginId] = useState<string | null>(readStoredLoginId)

  const account = SAMPLE_ACCOUNT.loginId === loginId ? SAMPLE_ACCOUNT : null

  const value: AuthContextValue = {
    user: account ? toUser(account) : null,
    studyIds: account?.studyIds ?? [],
    login(request) {
      if (SAMPLE_ACCOUNT.loginId !== request.loginId || SAMPLE_ACCOUNT.password !== request.password) return false
      setLoginId(request.loginId)
      writeStoredLoginId(request.loginId)
      return true
    },
    logout() {
      setLoginId(null)
      writeStoredLoginId(null)
    },
    findLoginIdByEmail(email) {
      return SAMPLE_ACCOUNT.email === email ? SAMPLE_ACCOUNT.loginId : null
    },
  }

  return <AuthContext value={value}>{children}</AuthContext>
}
