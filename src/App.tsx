import { Link, Route, Routes } from 'react-router'
import ConditionPage from './pages/ConditionPage'
import PlaceholderPage from './pages/PlaceholderPage'
import RecommendationListPage from './pages/RecommendationListPage'
import StudyDetailPage from './pages/StudyDetailPage'

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

export default function App() {
  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          RedBeanz
        </Link>
        <nav className="chips">
          <Link to="/studies">스터디 목록</Link>
          <Link to="/login">로그인</Link>
          <Link to="/mypage">마이페이지</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<ConditionPage />} />
          <Route path="/studies" element={<RecommendationListPage />} />
          <Route path="/studies/:studyId" element={<StudyDetailPage />} />
          <Route
            path="/login"
            element={
              <PlaceholderPage
                title="로그인"
                links={[
                  { to: '/signup', label: '회원가입' },
                  { to: '/find-id', label: '아이디 찾기' },
                  { to: '/reset-password', label: '비밀번호 재설정' },
                ]}
              />
            }
          />
          <Route
            path="/signup"
            element={<PlaceholderPage title="회원가입" links={[{ to: '/login', label: '로그인' }]} />}
          />
          <Route
            path="/find-id"
            element={<PlaceholderPage title="아이디 찾기" links={[{ to: '/login', label: '로그인' }]} />}
          />
          <Route
            path="/reset-password"
            element={<PlaceholderPage title="비밀번호 재설정" links={[{ to: '/login', label: '로그인' }]} />}
          />
          <Route
            path="/mypage"
            element={<PlaceholderPage title="마이페이지" links={[{ to: '/', label: '홈' }]} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}
