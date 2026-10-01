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

// 임시 로그인 상태: 샘플 계정과 이 탭에서 가입한 계정을 메모리에서 비교합니다.
// 새로고침해도 로그인이 유지되도록 로그인한 아이디만 sessionStorage에 둡니다.
// 백엔드는 세션(JSESSIONID 쿠키) 방식을 제안했으며(Back #8), 연결 시 /api/users/me 응답으로 교체합니다.
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<SampleAccount[]>([SAMPLE_ACCOUNT])
  const [loginId, setLoginId] = useState<string | null>(readStoredLoginId)

  const account = accounts.find((item) => item.loginId === loginId)

  const value: AuthContextValue = {
    user: account ? toUser(account) : null,
    studyIds: account?.studyIds ?? [],
    login(request) {
      const found = accounts.find((item) => item.loginId === request.loginId && item.password === request.password)
      if (!found) return false
      setLoginId(found.loginId)
      writeStoredLoginId(found.loginId)
      return true
    },
    logout() {
      setLoginId(null)
      writeStoredLoginId(null)
    },
    signup(request) {
      if (accounts.some((item) => item.loginId === request.loginId)) return 'duplicate-login-id'
      if (accounts.some((item) => item.email === request.email)) return 'duplicate-email'
      setAccounts((prev) => [
        ...prev,
        {
          ...request,
          id: Math.max(...prev.map((item) => item.id)) + 1,
          role: 'USER',
          createdAt: new Date().toISOString().slice(0, 19),
          studyIds: [],
        },
      ])
      return 'ok'
    },
    findLoginIdByEmail(email) {
      return accounts.find((item) => item.email === email)?.loginId ?? null
    },
  }

  return <AuthContext value={value}>{children}</AuthContext>
}
