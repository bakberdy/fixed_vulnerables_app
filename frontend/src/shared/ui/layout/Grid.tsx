import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 2 | 3 | 4 | 5 | 6 | 8
  children: ReactNode
}

const colsClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  12: 'grid-cols-12',
}

const gapClasses = {
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
}

export function Grid({ 
  cols = 1, 
  gap = 4, 
  className, 
  children, 
  ...props 
}: GridProps) {
  return (
    <div
      className={clsx(
        'grid',
        colsClasses[cols],
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
