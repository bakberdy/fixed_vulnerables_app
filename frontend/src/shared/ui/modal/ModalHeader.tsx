import { clsx } from 'clsx'

interface ModalHeaderProps {
  title: string
  subtitle?: string
  onClose?: () => void
  className?: string
}

export function ModalHeader({ title, subtitle, className }: ModalHeaderProps) {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-200', className)}>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
      )}
    </div>
  )
}
