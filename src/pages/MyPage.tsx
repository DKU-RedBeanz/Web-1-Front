import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { SAMPLE_STUDIES } from '../data/sampleStudies'
import { MODE_LABELS } from '../types/study'

export default function MyPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  // 로그아웃 중에는 아래 로그인 리다이렉트 대신 홈 이동을 기다립니다.
  if (loggingOut) return null
  // 비로그인 접근은 로그인 화면으로 보냅니다. (인증 방식 확정 전 가정)
  if (!user) return <Navigate to="/login" replace state={{ from: '/mypage' }} />

  const studies = SAMPLE_STUDIES.filter((study) => user.studyIds.includes(study.id))

  const handleLogout = () => {
    setLoggingOut(true)
    logout()
    navigate('/', { state: { notice: '로그아웃되었습니다.' } })
  }

  return (
    <section>
      <h1>마이페이지</h1>

      <div className="card">
        <div className="profile">
          <span className="avatar" aria-hidden="true">
            {user.nickname.charAt(0)}
          </span>
          <div>
            <p className="profile-name">{user.nickname}</p>
            <p className="muted small">{user.email}</p>
          </div>
        </div>
        <dl className="detail-list">
          <dt>이메일</dt>
          <dd>{user.email}</dd>
          <dt>닉네임</dt>
          <dd>{user.nickname}</dd>
          <dt>가입일</dt>
          <dd>{user.joinedAt}</dd>
        </dl>
      </div>

      <div className="card">
        <h2 className="section-title">참여 중인 스터디</h2>
        {studies.length === 0 ? (
          <p className="muted small">
            아직 참여 중인 스터디가 없어요. <Link to="/">스터디 찾기</Link>
          </p>
        ) : (
          <ul className="my-studies">
            {studies.map((study) => (
              <li key={study.id}>
                <Link to={`/studies/${study.id}`}>
                  <span>
                    <span className="my-study-title">{study.title}</span>
                    <span className="caption muted">
                      {study.schedule} · {MODE_LABELS[study.mode]}
                    </span>
                  </span>
                  <span aria-hidden="true">›</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="button-row stretch">
        <button type="button" className="button" disabled>
          정보 수정 (준비 중)
        </button>
        <button type="button" className="button" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </section>
  )
}
