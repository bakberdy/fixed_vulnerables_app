import type { ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  closable?: boolean
}

export interface ToastContextValue {
  toasts: Toast[]
  showToast: (options: Omit<Toast, 'id'>) => string
  closeToast: (id: string) => void
  closeAllToasts: () => void
}

export interface ToastProviderProps {
  children: ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxToasts?: number
}
