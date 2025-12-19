import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel
  children: ReactNode
}

const headingClasses = {
  1: 'text-4xl font-bold',
  2: 'text-3xl font-bold',
  3: 'text-2xl font-bold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-semibold',
  6: 'text-base font-semibold',
}

export function Heading({ level, className, children, ...props }: HeadingProps) {
  const Tag = `h${level}` as const
  
  return (
    <Tag
      className={clsx(
        headingClasses[level],
        'text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
