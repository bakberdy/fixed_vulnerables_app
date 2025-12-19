import { clsx } from 'clsx'
import type { Toast, ToastProviderProps } from './types'
import { ToastItem } from './ToastItem'

interface ToastContainerProps {
  toasts: Toast[]
  position: NonNullable<ToastProviderProps['position']>
  onClose: (id: string) => void
}

const positionClasses: Record<NonNullable<ToastProviderProps['position']>, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
}

export function ToastContainer({ toasts, position, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      className={clsx(
        'fixed z-[var(--z-toast)] flex flex-col gap-3 pointer-events-none',
        positionClasses[position]
      )}
      style={{ maxWidth: '400px' }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}
