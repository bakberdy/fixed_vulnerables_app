import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

export function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody className={clsx('divide-y divide-gray-200', className)} {...props}>
      {children}
    </tbody>
  )
}
