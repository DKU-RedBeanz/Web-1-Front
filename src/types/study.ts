// 스터디 조건·표시 정보는 Sprint 1 기획 초안입니다. 백엔드와 계약이 확정되면 맞춰 수정합니다.

export type StudyGoal = 'vocabulary' | 'conversation' | 'exam'
export type StudyLevel = 'beginner' | 'intermediate' | 'advanced'
export type StudyTime = 'weekday-evening' | 'weekend' | 'flexible'
export type StudyMode = 'online' | 'offline'

export type StudyCondition = {
  goal: StudyGoal | ''
  level: StudyLevel | ''
  time: StudyTime | ''
  mode: StudyMode | ''
}

export type Study = {
  id: number
  title: string
  summary: string
  description: string
  goal: StudyGoal
  level: StudyLevel
  time: StudyTime
  mode: StudyMode
  location: string
  schedule: string
  leaderNickname: string
  memberCount: number
  capacity: number
  tags: string[]
}

export const GOAL_LABELS: Record<StudyGoal, string> = {
  vocabulary: '영단어',
  conversation: '회화',
  exam: '시험 대비',
}

export const LEVEL_LABELS: Record<StudyLevel, string> = {
  beginner: '입문·초급',
  intermediate: '중급',
  advanced: '고급',
}

export const TIME_LABELS: Record<StudyTime, string> = {
  'weekday-evening': '평일 저녁',
  weekend: '주말',
  flexible: '시간 협의',
}

export const MODE_LABELS: Record<StudyMode, string> = {
  online: '온라인',
  offline: '오프라인',
}
