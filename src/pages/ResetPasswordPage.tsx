import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import Notice from '../components/Notice'
import TextField from '../components/TextField'
import { useForm } from '../hooks/useForm'
import { validateEmail } from '../utils/validation'

const RESEND_DELAY_MS = 5000

// 실제 메일 발송은 이번 범위 밖입니다. 계정 존재 여부와 관계없이 같은 안내를 보여줍니다.
export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(false)

  const { validateAll, field } = useForm({ email: '' }, (v) => ({ email: validateEmail(v.email) }))

  useEffect(() => {
    if (!cooldown) return
    const timer = setTimeout(() => setCooldown(false), RESEND_DELAY_MS)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateAll()) return
    setSent(true)
    setCooldown(true)
  }

  return (
    <section className="card auth-card">
      <h1>비밀번호 재설정</h1>
      <p className="muted small">가입한 이메일을 입력하면 재설정 방법을 안내해 드려요.</p>

      <form noValidate onSubmit={handleSubmit}>
        <TextField {...field('email')} label="이메일" type="email" placeholder="study@redbeanz.kr" autoComplete="email" />
        <button type="submit" className="button primary block" disabled={cooldown}>
          {sent ? '안내 다시 받기' : '재설정 안내 받기'}
        </button>
      </form>

      {sent && <Notice variant="success">입력한 이메일로 재설정 안내를 보냈어요. (샘플 화면)</Notice>}

      <p className="auth-links">
        <Link to="/login">로그인으로 돌아가기</Link>
      </p>
    </section>
  )
}
