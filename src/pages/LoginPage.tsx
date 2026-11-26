import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import Notice from '../components/Notice'
import TextField from '../components/TextField'
import { useForm } from '../hooks/useForm'

type LoginLocationState = { from?: string; loginId?: string } | null

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const state = useLocation().state as LoginLocationState
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  // 로그인은 필수값만 확인합니다. 형식 검사는 회원가입에서만 합니다.
  const { values, validateAll, field } = useForm({ loginId: state?.loginId ?? '', password: '' }, (v) => ({
    loginId: v.loginId ? undefined : '아이디를 입력하세요.',
    password: v.password ? undefined : '비밀번호를 입력하세요.',
  }))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    setError('')
    if (!validateAll()) return
    setPending(true)
    try {
      await login({ loginId: values.loginId, password: values.password })
      navigate(state?.from ?? '/', { replace: true })
    } catch (error) {
      setError(error instanceof Error ? error.message : '로그인에 실패했습니다.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="card auth-card">
      <h1>로그인</h1>
      <p className="muted small">RedBeanz 계정으로 로그인하세요.</p>

      {error && <Notice variant="error">{error}</Notice>}

      <form noValidate onSubmit={handleSubmit}>
        <fieldset className="signup-fields" disabled={pending}>
          <TextField {...field('loginId')} label="아이디" placeholder="아이디를 입력하세요" autoComplete="username" />
          <TextField
            {...field('password')}
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
          />
          <button type="submit" className="button primary block">
            {pending ? '로그인 중…' : '로그인'}
          </button>
        </fieldset>
      </form>

      <nav className="auth-links" aria-label="계정 관련 이동">
        <Link to="/signup">회원가입</Link>
        <Link to="/find-id">아이디 찾기</Link>
        <Link to="/reset-password">비밀번호 재설정</Link>
      </nav>
    </section>
  )
}
