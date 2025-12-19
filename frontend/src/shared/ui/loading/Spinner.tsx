import type { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'
type SpinnerColor = 'primary' | 'white' | 'current'

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
  color?: SpinnerColor
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

const colorClasses: Record<SpinnerColor, string> = {
  primary: 'text-primary-600',
  white: 'text-white',
  current: 'text-current',
}

export function Spinner({ 
  size = 'md', 
  color = 'primary', 
  className,
  ...props 
}: SpinnerProps) {
  return (
    <div
      className={clsx('inline-block', className)}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <svg
        className={clsx('animate-spin', sizeClasses[size], colorClasses[color])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}
