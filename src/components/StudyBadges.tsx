import { GOAL_LABELS, LEVEL_LABELS, MODE_LABELS, TIME_LABELS, type Study } from '../types/study'

export default function StudyBadges({ study }: { study: Study }) {
  return (
    <ul className="badges">
      <li>{GOAL_LABELS[study.goal]}</li>
      <li>{LEVEL_LABELS[study.level]}</li>
      <li>{TIME_LABELS[study.time]}</li>
      <li>{MODE_LABELS[study.mode]}</li>
    </ul>
  )
}
