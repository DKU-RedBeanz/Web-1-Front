import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router'
import { useAuth } from './auth/AuthContext'
import Notice from './components/Notice'
import ConditionPage from './pages/ConditionPage'
import FindIdPage from './pages/FindIdPage'
import LoginPage from './pages/LoginPage'
import MyPage from './pages/MyPage'
import RecommendationListPage from './pages/RecommendationListPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SignupPage from './pages/SignupPage'
import StudyDetailPage from './pages/StudyDetailPage'

const NOTICE_DURATION_MS = 3000

function NotFoundPage() {
  return (
    <section className="card empty">
      <p className="empty-title">페이지를 찾을 수 없어요.</p>
      <Link to="/" className="button">
        처음으로
      </Link>
    </section>
  )
}

// navigate(경로, { state: { notice } })로 넘긴 안내(가입 완료·로그아웃)를 3초간 보여줍니다.
function FlashNotice() {
  const location = useLocation()
  const notice = (location.state as { notice?: string } | null)?.notice
  const [hiddenKey, setHiddenKey] = useState<string | null>(null)

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setHiddenKey(location.key), NOTICE_DURATION_MS)
    return () => clearTimeout(timer)
  }, [notice, location.key])

  if (!notice || hiddenKey === location.key) return null
  return <Notice variant="success">{notice}</Notice>
}

export default function App() {
  const { user } = useAuth()

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">
            R
          </span>
          RedBeanz
        </Link>
        <nav className="nav">
          <NavLink to="/studies">스터디 목록</NavLink>
          {user ? <NavLink to="/mypage">마이페이지</NavLink> : <NavLink to="/login">로그인</NavLink>}
        </nav>
      </header>
      <main className="container">
        <FlashNotice />
        <Routes>
          <Route path="/" element={<ConditionPage />} />
          <Route path="/studies" element={<RecommendationListPage />} />
          <Route path="/studies/:studyId" element={<StudyDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/find-id" element={<FindIdPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}
