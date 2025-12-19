import { createContext, useState, useCallback } from 'react'
import type { Toast, ToastContextValue, ToastProviderProps } from './types'
import { ToastContainer } from './ToastContainer'

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

let toastIdCounter = 0

export function ToastProvider({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((options: Omit<Toast, 'id'>): string => {
    const id = `toast-${++toastIdCounter}`
    const toast: Toast = {
      id,
      duration: 5000,
      closable: true,
      ...options,
    }

    setToasts((prev) => {
      const newToasts = [...prev, toast]
      return newToasts.slice(-maxToasts)
    })

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        closeToast(id)
      }, toast.duration)
    }

    return id
  }, [maxToasts])

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const closeAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, closeToast, closeAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} position={position} onClose={closeToast} />
    </ToastContext.Provider>
  )
}
