import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import Notice from '../components/Notice'
import TextField from '../components/TextField'
import { useForm } from '../hooks/useForm'
import type { UpdateUserRequest, User } from '../types/user'
import { validateEmail, validateNewPassword, validateNickname } from '../utils/validation'

type FormMode = 'edit' | 'delete'

function AccountForm({ user, mode, onDone, onDelete, onCancel }: {
  user: User
  mode: FormMode
  onDone: () => void
  onDelete: () => void
  onCancel: () => void
}) {
  const { update, deleteAccount } = useAuth()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const deleting = mode === 'delete'
  const { values, validateAll, field } = useForm(
    { email: user.email, nickname: user.nickname, password: '', passwordConfirm: '' },
    (v) => deleting ? {
      password: v.password ? undefined : '현재 비밀번호를 입력하세요.',
    } : {
      email: validateEmail(v.email),
      nickname: validateNickname(v.nickname),
      password: v.password ? validateNewPassword(v.password) : undefined,
      passwordConfirm: v.password !== v.passwordConfirm ? '비밀번호가 일치하지 않습니다.' : undefined,
    },
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    setError('')
    if (!validateAll() || (deleting && !confirmed)) return
    const changes: UpdateUserRequest = {}
    if (values.email.trim() !== user.email) changes.email = values.email.trim()
    if (values.nickname.trim() !== user.nickname) changes.nickname = values.nickname.trim()
    if (values.password) changes.password = values.password
    if (!deleting && Object.keys(changes).length === 0) {
      setError('변경할 정보를 입력하세요.')
      return
    }

    setPending(true)
    try {
      if (deleting) {
        await deleteAccount(values.password)
        onDelete()
      } else {
        await update(changes)
        onDone()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '요청에 실패했습니다.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="card" noValidate onSubmit={handleSubmit}>
      <h2 className="section-title">{deleting ? '회원 탈퇴' : '정보 수정'}</h2>
      {error && <Notice variant="error">{error}</Notice>}
      <fieldset className="signup-fields" disabled={pending}>
        {!deleting && (
          <>
            <TextField {...field('email')} label="이메일" type="email" autoComplete="email" />
            <TextField {...field('nickname')} label="닉네임" autoComplete="nickname" />
          </>
        )}
        <TextField
          {...field('password')}
          label={deleting ? '현재 비밀번호' : '새 비밀번호'}
          type="password"
          autoComplete={deleting ? 'current-password' : 'new-password'}
          help={deleting ? undefined : '변경할 때만 입력하세요. (8~64자)'}
        />
        {deleting ? (
          <label>
            <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
            {' '}계정이 삭제되는 것을 확인했으며 탈퇴에 동의합니다.
          </label>
        ) : (
          <TextField {...field('passwordConfirm')} label="새 비밀번호 확인" type="password" autoComplete="new-password" />
        )}
        <div className="button-row">
          <button type="submit" className="button primary" disabled={deleting && !confirmed}>
            {pending ? '처리 중…' : deleting ? '회원 탈퇴' : '저장'}
          </button>
          <button type="button" className="button" onClick={onCancel}>취소</button>
        </div>
      </fieldset>
    </form>
  )
}

export default function MyPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<FormMode | null>(null)
  const [notice, setNotice] = useState('')
  const [leaving, setLeaving] = useState(false)

  if (leaving) return null
  if (!user) return <Navigate to="/login" replace state={{ from: '/mypage' }} />

  const leave = (path: string, notice: string) => {
    setLeaving(true)
    logout()
    navigate(path, { replace: true, state: { notice } })
  }

  return (
    <section>
      <h1>마이페이지</h1>
      {notice && <Notice variant="success">{notice}</Notice>}
      <div className="card">
        <div className="profile">
          <span className="avatar" aria-hidden="true">{user.nickname.charAt(0)}</span>
          <div>
            <p className="profile-name">{user.nickname}</p>
            <p className="muted small">@{user.loginId}</p>
          </div>
        </div>
        <dl className="detail-list">
          <dt>아이디</dt><dd>{user.loginId}</dd>
          <dt>이메일</dt><dd>{user.email}</dd>
          <dt>닉네임</dt><dd>{user.nickname}</dd>
          <dt>가입일</dt><dd>{user.createdAt.slice(0, 10)}</dd>
        </dl>
      </div>
      {mode ? (
        <AccountForm
          key={mode}
          user={user}
          mode={mode}
          onCancel={() => setMode(null)}
          onDone={() => { setMode(null); setNotice('회원 정보가 수정되었습니다.') }}
          onDelete={() => leave('/login', '회원 탈퇴가 완료되었습니다.')}
        />
      ) : (
        <div className="button-row">
          <button type="button" className="button" onClick={() => { setNotice(''); setMode('edit') }}>정보 수정</button>
          <button type="button" className="button" onClick={() => leave('/', '로그아웃되었습니다.')}>로그아웃</button>
          <button type="button" className="button text" onClick={() => { setNotice(''); setMode('delete') }}>회원 탈퇴</button>
        </div>
      )}
    </section>
  )
}
