import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import Notice from '../components/Notice'
import TextField from '../components/TextField'
import { useForm } from '../hooks/useForm'
import type { SignupRequest } from '../types/user'
import { validateEmail, validateLoginId, validateNewPassword, validateNickname } from '../utils/validation'

const DUPLICATE_LOGIN_ID = '이미 사용 중인 아이디입니다.'
const CHECK_FAILED = '아이디 중복 검사에 실패했습니다. 다시 시도해 주세요.'
const SIGNUP_FAILED = '회원가입에 실패했습니다. 다시 시도해 주세요.'

export default function SignupPage() {
  const navigate = useNavigate()
  const [loginIdAvailable, setLoginIdAvailable] = useState<boolean | null>(null)
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState('')

  const { values, validateAll, field } = useForm(
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

  const checkLoginId = async () => {
    if (pending) return
    setLoginIdAvailable(null)
    const validationError = validateLoginId(values.loginId)
    setFormError(validationError ?? '')
    if (validationError) return

    setPending(true)
    try {
      const params = new URLSearchParams({ loginId: values.loginId })
      const response = await fetch(`/api/users/login-id-availability?${params}`, { cache: 'no-store' })
      const result = response.ok ? await response.json() : null
      if (typeof result?.available === 'boolean') setLoginIdAvailable(result.available)
      else setFormError(CHECK_FAILED)
    } catch {
      setFormError(CHECK_FAILED)
    } finally {
      setPending(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    setFormError('')
    if (!validateAll()) return
    if (!loginIdAvailable) {
      if (loginIdAvailable === null) setFormError('아이디 중복 검사를 해 주세요.')
      return
    }

    const request: SignupRequest = {
      loginId: values.loginId,
      email: values.email.trim(),
      password: values.password,
      nickname: values.nickname.trim(),
    }
    setPending(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })
      if (response.status === 201) {
        navigate('/login', { state: { notice: '가입이 완료되었습니다.', loginId: values.loginId } })
        return
      }
      if (response.status === 409) {
        const { message, errors } = await response.json()
        if (errors?.loginId) setLoginIdAvailable(false)
        setFormError(message)
        return
      }
      setFormError(response.status === 400 ? '입력값을 확인하세요.' : SIGNUP_FAILED)
    } catch {
      setFormError(SIGNUP_FAILED)
    } finally {
      setPending(false)
    }
  }

  const loginIdField = field('loginId')
  const error = formError || (loginIdAvailable === false && DUPLICATE_LOGIN_ID)

  return (
    <section className="card auth-card">
      <h1>회원가입</h1>
      <p className="muted small">스터디에 참여하려면 계정을 만들어 주세요.</p>

      {error && <Notice variant="error">{error}</Notice>}
      <form noValidate onSubmit={handleSubmit}>
        <fieldset className="signup-fields" disabled={pending}>
          <TextField
            {...loginIdField}
            onChange={(value) => {
              setLoginIdAvailable(null)
              setFormError('')
              loginIdField.onChange(value)
            }}
            label="아이디"
            placeholder="redbeanz01"
            autoComplete="username"
            help="영문 소문자·숫자 4~20자, 로그인에 사용합니다."
          />
          <button type="button" className="button" onClick={checkLoginId}>
            아이디 중복 검사
          </button>
          {loginIdAvailable && <Notice variant="success">사용 가능한 아이디입니다.</Notice>}
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
        </fieldset>
      </form>

      <p className="auth-links">
        이미 계정이 있나요? <Link to="/login">로그인</Link>
      </p>
    </section>
  )
}
