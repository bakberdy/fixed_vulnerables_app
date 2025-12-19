import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import { useDropdownContext } from './DropdownContext'

interface DropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function DropdownTrigger({ children, className, ...props }: DropdownTriggerProps) {
  const { toggle } = useDropdownContext()

  return (
    <button
      type="button"
      className={clsx('inline-flex items-center gap-2 focus:outline-none', className)}
      onClick={(event) => {
        props.onClick?.(event)
        toggle()
      }}
      {...props}
    >
      {children}
    </button>
  )
}
