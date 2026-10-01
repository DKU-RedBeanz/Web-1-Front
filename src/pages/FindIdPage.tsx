import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import Notice from '../components/Notice'
import TextField from '../components/TextField'
import { useForm } from '../hooks/useForm'
import { maskEmail } from '../utils/validation'

// 실제 조회 없이 샘플 계정에서 닉네임으로 찾습니다. 찾는 기준은 백엔드와 확정 전 가정입니다.
export default function FindIdPage() {
  const { findEmailByNickname } = useAuth()
  const [result, setResult] = useState<string | null | undefined>(undefined)

  const { values, validateAll, field } = useForm({ nickname: '' }, (v) => ({
    nickname: v.nickname.trim() ? undefined : '닉네임을 입력하세요.',
  }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateAll()) {
      setResult(undefined)
      return
    }
    setResult(findEmailByNickname(values.nickname.trim()))
  }

  return (
    <section className="card auth-card">
      <h1>아이디 찾기</h1>
      <p className="muted small">가입할 때 입력한 닉네임으로 아이디(이메일)를 찾아요.</p>

      <form noValidate onSubmit={handleSubmit}>
        <TextField {...field('nickname')} label="닉네임" placeholder="닉네임을 입력하세요" autoComplete="nickname" />
        <button type="submit" className="button primary block">
          아이디 찾기
        </button>
      </form>

      {result === null && <Notice variant="error">일치하는 계정이 없습니다.</Notice>}
      {result && (
        <>
          <div className="result-box" role="status">
            <p className="caption muted">가입된 아이디</p>
            <p className="result-value">{maskEmail(result)}</p>
          </div>
          <div className="button-row">
            <Link to="/login" state={{ email: result }} className="button">
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
