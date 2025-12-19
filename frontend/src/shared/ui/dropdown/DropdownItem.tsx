import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import { useDropdownContext } from './DropdownContext'

interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function DropdownItem({ children, leftIcon, rightIcon, className, disabled, onClick, ...props }: DropdownItemProps) {
  const { close } = useDropdownContext()

  return (
    <button
      type="button"
      className={clsx(
        'flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700',
        'hover:bg-gray-50 focus:bg-gray-50 focus:outline-none',
        'disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent',
        className
      )}
      onClick={(event) => {
        if (disabled) return
        onClick?.(event)
        close()
      }}
      disabled={disabled}
      role="menuitem"
      {...props}
    >
      {leftIcon && <span className="text-gray-500">{leftIcon}</span>}
      <span className="flex-1 text-left truncate">{children}</span>
      {rightIcon && <span className="text-gray-400">{rightIcon}</span>}
    </button>
  )
}
