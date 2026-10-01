import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import TextField from '../components/TextField'
import { useForm } from '../hooks/useForm'
import { validateEmail, validateLoginId, validateNewPassword, validateNickname } from '../utils/validation'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const { values, validateAll, setError, field } = useForm(
    { loginId: '', email: '', password: '', passwordConfirm: '', nickname: '' },
    (v) => ({
      loginId: validateLoginId(v.loginId),
      email: validateEmail(v.email),
      password: validateNewPassword(v.password),
      passwordConfirm: !v.passwordConfirm
        ? '비밀번호 확인을 입력하세요.'
        : v.passwordConfirm !== v.password
          ? '비밀번호가 일치하지 않습니다.'
          : undefined,
      nickname: validateNickname(v.nickname),
    }),
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateAll()) return

    // POST /api/users 요청 형식 (비밀번호 확인은 프론트에서만 사용)
    const result = signup({
      loginId: values.loginId,
      email: values.email.trim(),
      password: values.password,
      nickname: values.nickname.trim(),
    })
    if (result === 'duplicate-login-id') {
      setError('loginId', '이미 사용 중인 아이디입니다.')
      return
    }
    if (result === 'duplicate-email') {
      setError('email', '이미 가입된 이메일입니다.')
      return
    }
    navigate('/login', { state: { notice: '가입이 완료되었습니다. 로그인해 주세요.', loginId: values.loginId } })
  }

  return (
    <section className="card auth-card">
      <h1>회원가입</h1>
      <p className="muted small">스터디에 참여하려면 계정을 만들어 주세요.</p>

      <form noValidate onSubmit={handleSubmit}>
        <TextField
          {...field('loginId')}
          label="아이디"
          placeholder="redbeanz01"
          autoComplete="username"
          help="영문 소문자·숫자 4~20자, 로그인에 사용합니다."
        />
        <TextField
          {...field('email')}
          label="이메일"
          type="email"
          placeholder="study@redbeanz.kr"
          autoComplete="email"
          help="아이디 찾기에 사용합니다."
        />
        <TextField
          {...field('password')}
          label="비밀번호"
          type="password"
          placeholder="8자 이상 입력하세요"
          autoComplete="new-password"
          help="8~64자"
        />
        <TextField
          {...field('passwordConfirm')}
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 한 번 더 입력하세요"
          autoComplete="new-password"
        />
        <TextField
          {...field('nickname')}
          label="닉네임"
          placeholder="2~20자"
          autoComplete="nickname"
          help="스터디에서 보여질 이름입니다."
        />
        <button type="submit" className="button primary block">
          가입하기
        </button>
      </form>

      <p className="auth-links">
        이미 계정이 있나요? <Link to="/login">로그인</Link>
      </p>
    </section>
  )
}
