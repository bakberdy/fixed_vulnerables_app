import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={clsx('text-gray-700', className)} {...props}>
      {children}
    </div>
  )
}
