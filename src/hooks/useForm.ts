import { useRef, useState } from 'react'

type Errors<T> = Partial<Record<keyof T, string>>

// 제출 시 전체 검사 → 첫 오류 필드로 포커스. 이후에는 입력한 필드만 다시 검사합니다.
export function useForm<T extends Record<string, string>>(initial: T, validate: (values: T) => Errors<T>) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<Errors<T>>({})
  const [submitted, setSubmitted] = useState(false)
  const inputs = useRef<Partial<Record<keyof T, HTMLInputElement | null>>>({})

  const setValue = (name: keyof T, value: string) => {
    const next = { ...values, [name]: value }
    setValues(next)
    if (submitted) setErrors((prev) => ({ ...prev, [name]: validate(next)[name] }))
  }

  const focus = (name: keyof T) => inputs.current[name]?.focus()

  const validateAll = (): boolean => {
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmitted(true)
    const firstError = (Object.keys(values) as (keyof T)[]).find((name) => nextErrors[name])
    if (firstError) focus(firstError)
    return !firstError
  }

  const setError = (name: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [name]: message }))
    focus(name)
  }

  const field = (name: keyof T & string) => ({
    id: name,
    value: values[name],
    error: errors[name],
    onChange: (value: string) => setValue(name, value),
    inputRef: (element: HTMLInputElement | null) => {
      inputs.current[name] = element
    },
  })

  return { values, validateAll, setError, field }
}
