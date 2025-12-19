import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

export function TableHeader({ children, className, ...props }: TableHeaderProps) {
  return (
    <thead className={clsx('bg-gray-50', className)} {...props}>
      {children}
    </thead>
  )
}
