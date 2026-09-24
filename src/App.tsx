import { Link, Route, Routes } from 'react-router'
import ConditionPage from './pages/ConditionPage'
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
        <span className="muted small">샘플 데이터로 동작하는 화면입니다</span>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<ConditionPage />} />
          <Route path="/studies" element={<RecommendationListPage />} />
          <Route path="/studies/:studyId" element={<StudyDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}
