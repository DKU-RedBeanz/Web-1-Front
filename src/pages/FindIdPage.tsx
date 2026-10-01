import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import Notice from '../components/Notice'
import TextField from '../components/TextField'
import { useForm } from '../hooks/useForm'
import { maskLoginId, validateEmail } from '../utils/validation'

// 이메일은 중복 불가(Back #7)라 이메일로 아이디를 찾습니다. 실제 조회 API는 아직 범위 밖이라 샘플 계정에서 찾습니다.
export default function FindIdPage() {
  const { findLoginIdByEmail } = useAuth()
  const [result, setResult] = useState<string | null | undefined>(undefined)

  const { values, validateAll, field } = useForm({ email: '' }, (v) => ({ email: validateEmail(v.email) }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateAll()) {
      setResult(undefined)
      return
    }
    setResult(findLoginIdByEmail(values.email.trim()))
  }

  return (
    <section className="card auth-card">
      <h1>아이디 찾기</h1>
      <p className="muted small">가입할 때 입력한 이메일로 아이디를 찾아요.</p>

      <form noValidate onSubmit={handleSubmit}>
        <TextField {...field('email')} label="이메일" type="email" placeholder="study@redbeanz.kr" autoComplete="email" />
        <button type="submit" className="button primary block">
          아이디 찾기
        </button>
      </form>

      {result === null && <Notice variant="error">일치하는 계정이 없습니다.</Notice>}
      {result && (
        <>
          <div className="result-box" role="status">
            <p className="caption muted">가입된 아이디</p>
            <p className="result-value">{maskLoginId(result)}</p>
          </div>
          <div className="button-row">
            <Link to="/login" state={{ loginId: result }} className="button">
              로그인
            </Link>
            <Link to="/reset-password" className="button text">
              비밀번호 재설정
            </Link>
          </div>
        </>
      )}

      {!result && (
        <p className="auth-links">
          <Link to="/login">로그인으로 돌아가기</Link>
        </p>
      )}
    </section>
  )
}
