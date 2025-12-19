import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode
  hoverable?: boolean
}

export function TableRow({ children, className, hoverable = true, ...props }: TableRowProps) {
  return (
    <tr
      className={clsx(
        hoverable && 'hover:bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}
