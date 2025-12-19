import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  align?: 'left' | 'center' | 'right' | 'between'
}

const alignClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between',
}

export function ModalFooter({ 
  children, 
  align = 'right', 
  className, 
  ...props 
}: ModalFooterProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50',
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
