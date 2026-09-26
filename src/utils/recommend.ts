import type { Study, StudyCondition } from '../types/study'

const CONDITION_KEYS = ['goal', 'level', 'time', 'mode'] as const

// 임시 추천: 선택한 조건이 모두 일치하는 샘플만 반환합니다. '상관없음'('')은 필터에서 제외합니다.
// 실제 추천 기준은 백엔드·멘토와 확정한 뒤 교체합니다.
export function recommendStudies(studies: Study[], condition: StudyCondition): Study[] {
  return studies
    .filter((study) => CONDITION_KEYS.every((key) => !condition[key] || study[key] === condition[key]))
    .sort((a, b) => remainingSeats(b) - remainingSeats(a))
}

export function remainingSeats(study: Study): number {
  return Math.max(study.capacity - study.memberCount, 0)
}

export function conditionFromSearchParams(params: URLSearchParams): StudyCondition {
  return {
    goal: (params.get('goal') ?? '') as StudyCondition['goal'],
    level: (params.get('level') ?? '') as StudyCondition['level'],
    time: (params.get('time') ?? '') as StudyCondition['time'],
    mode: (params.get('mode') ?? '') as StudyCondition['mode'],
  }
}

export function conditionToSearchParams(condition: StudyCondition): URLSearchParams {
  const params = new URLSearchParams()
  for (const key of CONDITION_KEYS) {
    if (condition[key]) params.set(key, condition[key])
  }
  return params
}
