import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={clsx('flex items-start justify-between mb-4', className)}>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="ml-4 flex-shrink-0">{action}</div>
      )}
    </div>
  )
}
