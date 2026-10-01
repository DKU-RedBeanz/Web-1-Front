import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import StudyBadges from '../components/StudyBadges'
import { SAMPLE_STUDIES } from '../data/sampleStudies'
import { remainingSeats } from '../utils/recommend'

export default function StudyDetailPage() {
  const { user } = useAuth()
  const location = useLocation()
  const { studyId } = useParams()
  const [searchParams] = useSearchParams()
  const study = SAMPLE_STUDIES.find((item) => String(item.id) === studyId)
  const backTo = `/studies?${searchParams}`

  // 목록은 공개, 상세는 로그인 필요 (Back #9·#3 접근 정책). 로그인 후 이 상세로 돌아옵니다.
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />

  if (!study) {
    return (
      <section className="card empty">
        <p className="empty-title">스터디를 찾을 수 없어요.</p>
        <Link to={backTo} className="button">
          추천 목록으로
        </Link>
      </section>
    )
  }

  const seats = remainingSeats(study)

  return (
    <section>
      <Link to={backTo} className="back-link">
        ← 추천 목록으로
      </Link>
      <article className="card">
        <h1>{study.title}</h1>
        <StudyBadges study={study} />
        <p>{study.description}</p>

        <dl className="detail-list">
          <dt>일정</dt>
          <dd>{study.schedule}</dd>
          <dt>장소</dt>
          <dd>{study.location}</dd>
          <dt>스터디장</dt>
          <dd>{study.leaderNickname}</dd>
          <dt>인원</dt>
          <dd>
            {study.memberCount}/{study.capacity}명 ({seats > 0 ? `${seats}자리 남음` : '모집 마감'})
          </dd>
          <dt>태그</dt>
          <dd>{study.tags.map((tag) => `#${tag}`).join(' ')}</dd>
        </dl>

        {/* 신청·승인 방식이 미정이므로 이번 스프린트에서는 버튼만 표시합니다. */}
        <button type="button" className="button primary" disabled>
          {seats > 0 ? '참여 신청 (준비 중)' : '모집 마감'}
        </button>
      </article>
    </section>
  )
}
