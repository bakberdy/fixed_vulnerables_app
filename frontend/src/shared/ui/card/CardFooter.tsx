import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
}

const alignClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export function CardFooter({ 
  align = 'left', 
  className, 
  children, 
  ...props 
}: CardFooterProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 mt-4 pt-4 border-t border-gray-200',
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
