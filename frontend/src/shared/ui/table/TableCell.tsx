import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
  header?: boolean
}

export function TableCell({ children, className, align = 'left', header = false, ...props }: TableCellProps) {
  const Component = header ? 'th' : 'td'

  return (
    <Component
      className={clsx(
        'px-4 py-3 text-sm text-gray-700',
        header ? 'font-semibold text-gray-900' : 'font-normal',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
