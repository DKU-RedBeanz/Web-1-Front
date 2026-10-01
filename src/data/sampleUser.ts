import type { Account } from '../auth/AuthContext'

// 화면 확인용 샘플 계정입니다. 실제 인증은 백엔드 API(Back #7·#8) 연결 시 교체합니다.
export const SAMPLE_ACCOUNT: Account = {
  email: 'study@redbeanz.kr',
  password: 'redbeanz1',
  nickname: '팥빙수',
  joinedAt: '2026-09-24',
  studyIds: [1, 3],
}
