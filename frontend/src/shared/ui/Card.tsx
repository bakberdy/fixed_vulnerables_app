import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

type CardVariant = 'default' | 'elevated' | 'outlined'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  hoverable?: boolean
  clickable?: boolean
  padding?: CardPadding
  children: ReactNode
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white shadow-md',
  elevated: 'bg-white shadow-lg',
  outlined: 'bg-white border border-gray-200',
}

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  variant = 'default',
  hoverable = false,
  clickable = false,
  padding = 'md',
  className,
  children,
  onClick,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg transition-all duration-normal',
        variantClasses[variant],
        paddingClasses[padding],
        hoverable && 'hover:shadow-xl hover:-translate-y-1',
        clickable && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  )
}
