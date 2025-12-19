import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error'
  children: ReactNode
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const colorClasses = {
  primary: 'text-gray-900',
  secondary: 'text-gray-700',
  muted: 'text-gray-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  error: 'text-error-600',
}

export function Text({ 
  size = 'base',
  weight = 'normal',
  color = 'primary',
  className,
  children,
  ...props
}: TextProps) {
  return (
    <p
      className={clsx(
        sizeClasses[size],
        weightClasses[weight],
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}
