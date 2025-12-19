import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  gap?: 1 | 2 | 3 | 4 | 6 | 8
  wrap?: boolean
  children: ReactNode
}

const directionClasses = {
  row: 'flex-row',
  col: 'flex-col',
}

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
}

const gapClasses = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
}

export function Flex({ 
  direction = 'row',
  align,
  justify,
  gap,
  wrap = false,
  className,
  children,
  ...props
}: FlexProps) {
  return (
    <div
      className={clsx(
        'flex',
        directionClasses[direction],
        align && alignClasses[align],
        justify && justifyClasses[justify],
        gap && gapClasses[gap],
        wrap && 'flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
