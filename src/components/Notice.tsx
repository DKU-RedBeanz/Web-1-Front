import type { ReactNode } from 'react'

type NoticeProps = {
  variant: 'success' | 'error'
  children: ReactNode
}

// 성공·오류 안내 배너. 오류는 바로 읽히도록 role="alert"를 씁니다.
export default function Notice({ variant, children }: NoticeProps) {
  return (
    <p className={`notice ${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}
