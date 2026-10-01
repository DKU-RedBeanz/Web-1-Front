import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import Notice from '../components/Notice'
import TextField from '../components/TextField'
import { useForm } from '../hooks/useForm'
import { validateEmail } from '../utils/validation'

type LoginLocationState = { from?: string; email?: string } | null

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const state = useLocation().state as LoginLocationState
  const [failed, setFailed] = useState(false)

  // 비밀번호 형식은 회원가입에서만 검사합니다.
  const { values, validateAll, field } = useForm({ email: state?.email ?? '', password: '' }, (v) => ({
    email: validateEmail(v.email),
    password: v.password ? undefined : '비밀번호를 입력하세요.',
  }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFailed(false)
    if (!validateAll()) return
    if (!login(values.email.trim(), values.password)) {
      // 어떤 값이 틀렸는지는 알리지 않습니다.
      setFailed(true)
      return
    }
    navigate(state?.from ?? '/', { replace: true })
  }

  return (
    <section className="card auth-card">
      <h1>로그인</h1>
      <p className="muted small">RedBeanz 계정으로 로그인하세요.</p>

      {failed && <Notice variant="error">이메일 또는 비밀번호가 올바르지 않습니다.</Notice>}

      <form noValidate onSubmit={handleSubmit}>
        <TextField
          {...field('email')}
          label="이메일"
          type="email"
          placeholder="이메일을 입력하세요"
          autoComplete="email"
        />
        <TextField
          {...field('password')}
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
        />
        <button type="submit" className="button primary block">
          로그인
        </button>
      </form>

      <nav className="auth-links" aria-label="계정 관련 이동">
        <Link to="/signup">회원가입</Link>
        <Link to="/find-id">아이디 찾기</Link>
        <Link to="/reset-password">비밀번호 재설정</Link>
      </nav>
    </section>
  )
}
