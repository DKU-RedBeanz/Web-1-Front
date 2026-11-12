import { Link, useSearchParams } from 'react-router'
import StudyBadges from '../components/StudyBadges'
import { SAMPLE_STUDIES } from '../data/sampleStudies'
import { GOAL_LABELS, LEVEL_LABELS, MODE_LABELS, TIME_LABELS } from '../types/study'
import { conditionFromSearchParams, recommendStudies, remainingSeats } from '../utils/recommend'

export default function RecommendationListPage() {
  const [searchParams] = useSearchParams()
  const condition = conditionFromSearchParams(searchParams)
  const studies = recommendStudies(SAMPLE_STUDIES, condition)
  const query = searchParams.toString()

  const selected = [
    condition.goal && GOAL_LABELS[condition.goal],
    condition.level && LEVEL_LABELS[condition.level],
    condition.time && TIME_LABELS[condition.time],
    condition.mode && MODE_LABELS[condition.mode],
  ].filter(Boolean)

  return (
    <section>
      <h1>추천 스터디</h1>
      <p className="muted">
        선택한 조건: {selected.length > 0 ? selected.join(' · ') : '전체 (조건 없음)'}
      </p>
      <Link to={`/?${query}`} className="button">
        조건 다시 입력
      </Link>

      {studies.length === 0 ? (
        <div className="card empty">
          <p className="empty-title">조건에 맞는 스터디가 없어요.</p>
          <p className="muted">조건을 줄이거나 '상관없음'을 선택해 다시 찾아보세요.</p>
        </div>
      ) : (
        <ul className="study-list">
          {studies.map((study) => {
            const seats = remainingSeats(study)
            return (
              <li key={study.id}>
                <Link to={`/studies/${study.id}?${query}`} className="card study-card">
                  <h2>{study.title}</h2>
                  <p>{study.summary}</p>
                  <StudyBadges study={study} />
                  <p className="muted small">
                    {study.memberCount}/{study.capacity}명 · {seats > 0 ? `${seats}자리 남음` : '모집 마감'}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
