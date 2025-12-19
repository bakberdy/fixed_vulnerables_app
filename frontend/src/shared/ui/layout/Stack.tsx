import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  spacing?: 1 | 2 | 3 | 4 | 6 | 8
  children: ReactNode
}

const spacingClasses = {
  1: 'space-y-1',
  2: 'space-y-2',
  3: 'space-y-3',
  4: 'space-y-4',
  6: 'space-y-6',
  8: 'space-y-8',
}

export function Stack({ 
  spacing = 4, 
  className, 
  children, 
  ...props 
}: StackProps) {
  return (
    <div
      className={clsx(
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
