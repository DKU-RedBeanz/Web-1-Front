import { useState, type ReactNode } from 'react'
import { SAMPLE_ACCOUNT } from '../data/sampleUser'
import { AuthContext, type Account, type AuthContextValue, type User } from './AuthContext'

const STORAGE_KEY = 'redbeanz:login-email'

function toUser({ password: _password, ...user }: Account): User {
  return user
}

function readStoredEmail(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStoredEmail(email: string | null) {
  try {
    if (email) sessionStorage.setItem(STORAGE_KEY, email)
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // 저장소를 쓸 수 없어도 화면 상태로는 동작합니다.
  }
}

// 임시 로그인 상태: 샘플 계정과 이 탭에서 가입한 계정을 메모리에서 비교합니다.
// 새로고침해도 로그인이 유지되도록 로그인한 이메일만 sessionStorage에 둡니다.
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([SAMPLE_ACCOUNT])
  const [loginEmail, setLoginEmail] = useState<string | null>(readStoredEmail)

  const account = accounts.find((item) => item.email === loginEmail)

  const value: AuthContextValue = {
    user: account ? toUser(account) : null,
    login(email, password) {
      const found = accounts.find((item) => item.email === email && item.password === password)
      if (!found) return false
      setLoginEmail(found.email)
      writeStoredEmail(found.email)
      return true
    },
    logout() {
      setLoginEmail(null)
      writeStoredEmail(null)
    },
    signup(input) {
      if (accounts.some((item) => item.email === input.email)) return 'duplicate-email'
      const joinedAt = new Date().toISOString().slice(0, 10)
      setAccounts((prev) => [...prev, { ...input, joinedAt, studyIds: [] }])
      return 'ok'
    },
    findEmailByNickname(nickname) {
      return accounts.find((item) => item.nickname === nickname)?.email ?? null
    },
  }

  return <AuthContext value={value}>{children}</AuthContext>
}
