import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  noPadding?: boolean
}

export function ModalBody({ 
  children, 
  noPadding = false, 
  className, 
  ...props 
}: ModalBodyProps) {
  return (
    <div
      className={clsx(
        !noPadding && 'px-6 py-4',
        'max-h-[calc(100vh-200px)] overflow-y-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
