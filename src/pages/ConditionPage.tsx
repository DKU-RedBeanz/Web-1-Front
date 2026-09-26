import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import {
  GOAL_LABELS,
  LEVEL_LABELS,
  MODE_LABELS,
  TIME_LABELS,
  type StudyCondition,
} from '../types/study'
import { conditionFromSearchParams, conditionToSearchParams } from '../utils/recommend'

type FieldProps = {
  name: keyof StudyCondition
  legend: string
  labels: Record<string, string>
  value: string
  onChange: (name: keyof StudyCondition, value: string) => void
}

function ConditionField({ name, legend, labels, value, onChange }: FieldProps) {
  const options = [['', '상관없음'], ...Object.entries(labels)]
  return (
    <fieldset className="field">
      <legend>{legend}</legend>
      <div className="chips">
        {options.map(([optionValue, label]) => (
          <label key={optionValue || 'any'} className={value === optionValue ? 'chip selected' : 'chip'}>
            <input
              type="radio"
              name={name}
              value={optionValue}
              checked={value === optionValue}
              onChange={() => onChange(name, optionValue)}
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function ConditionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // 목록에서 '조건 다시 입력'으로 돌아오면 이전 선택을 유지합니다.
  const [condition, setCondition] = useState<StudyCondition>(() => conditionFromSearchParams(searchParams))

  const handleChange = (name: keyof StudyCondition, value: string) => {
    setCondition((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(`/studies?${conditionToSearchParams(condition)}`)
  }

  return (
    <section>
      <h1>나에게 맞는 스터디 찾기</h1>
      <p className="muted">원하는 조건을 고르면 조건에 맞는 스터디를 추천해 드려요.</p>

      <form className="card" onSubmit={handleSubmit}>
        <ConditionField name="goal" legend="학습 목표" labels={GOAL_LABELS} value={condition.goal} onChange={handleChange} />
        <ConditionField name="level" legend="내 수준" labels={LEVEL_LABELS} value={condition.level} onChange={handleChange} />
        <ConditionField name="time" legend="가능한 시간" labels={TIME_LABELS} value={condition.time} onChange={handleChange} />
        <ConditionField name="mode" legend="진행 방식" labels={MODE_LABELS} value={condition.mode} onChange={handleChange} />
        <button type="submit" className="button primary">
          추천 스터디 보기
        </button>
      </form>
    </section>
  )
}
