import type { User } from '@/shared/types'

type AuthListener = (user: User | null) => void

const AUTH_USER_KEY = 'auth_user'

let currentUser: User | null = null
const listeners = new Set<AuthListener>()

export function setAuthUser(user: User | null): void {
  currentUser = user
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_USER_KEY)
    }
  }
  listeners.forEach((listener) => listener(user))
}

export function getAuthUser(): User | null {
  if (currentUser) {
    return currentUser
  }

  if (typeof window === 'undefined') {
    return null
  }

  const raw = localStorage.getItem(AUTH_USER_KEY)
  if (!raw) {
    return null
  }

  try {
    currentUser = JSON.parse(raw) as User
    return currentUser
  } catch {
    localStorage.removeItem(AUTH_USER_KEY)
    return null
  }
}

export function subscribeAuth(listener: AuthListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
