import type { LoginRequest, UpdateUserRequest, User } from '../types/user'

export class UserApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request(credentials: LoginRequest, method = 'GET', body?: unknown, csrf?: string) {
  const bytes = new TextEncoder().encode(`${credentials.loginId}:${credentials.password}`)
  const headers: Record<string, string> = {
    Authorization: `Basic ${btoa(String.fromCharCode(...bytes))}`,
    'X-Requested-With': 'XMLHttpRequest',
  }
  if (body) headers['Content-Type'] = 'application/json'
  if (csrf) headers['X-CSRF-TOKEN'] = csrf

  let response: Response
  try {
    response = await fetch('/api/users/me', {
      method,
      headers,
      credentials: 'same-origin',
      cache: 'no-store',
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new UserApiError(0, '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.')
  }
  if (!response.ok) {
    const messages: Record<number, string> = {
      400: '입력값을 확인하세요.',
      401: '아이디 또는 비밀번호를 확인하고 다시 로그인해 주세요.',
      403: '본인 확인에 실패했습니다. 비밀번호를 확인하거나 다시 로그인해 주세요.',
      404: '회원을 찾을 수 없습니다. 다시 로그인해 주세요.',
      409: '이미 가입된 이메일입니다.',
    }
    throw new UserApiError(response.status, messages[response.status] ?? '요청에 실패했습니다. 다시 시도해 주세요.')
  }
  return response
}

export async function getMe(credentials: LoginRequest): Promise<User> {
  return (await request(credentials)).json()
}

async function getCsrf(credentials: LoginRequest) {
  const response = await request(credentials)
  const csrf = response.headers.get('X-CSRF-TOKEN')
  if (!csrf) throw new UserApiError(0, '요청을 준비하지 못했습니다. 다시 로그인해 주세요.')
  return csrf
}

export async function updateMe(credentials: LoginRequest, changes: UpdateUserRequest): Promise<User> {
  const csrf = await getCsrf(credentials)
  return (await request(credentials, 'PATCH', changes, csrf)).json()
}

export async function deleteMe(credentials: LoginRequest, id: number, password: string): Promise<void> {
  const csrf = await getCsrf(credentials)
  await request(credentials, 'DELETE', { id, password }, csrf)
}
