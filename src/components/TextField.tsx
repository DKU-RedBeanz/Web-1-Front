type TextFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  inputRef?: (element: HTMLInputElement | null) => void
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  autoComplete?: string
  help?: string
  error?: string
}

// 스타일 가이드(#6) Input: 라벨 + 입력창 + 도움말/오류 메시지
export default function TextField({
  id,
  label,
  value,
  onChange,
  inputRef,
  type = 'text',
  placeholder,
  autoComplete,
  help,
  error,
}: TextFieldProps) {
  const messageId = `${id}-message`
  const message = error ?? help

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        ref={inputRef}
        className="input"
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {message && (
        <p id={messageId} className={error ? 'field-error' : 'field-help'}>
          {message}
        </p>
      )}
    </div>
  )
}
