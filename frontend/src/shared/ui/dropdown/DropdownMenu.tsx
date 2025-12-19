import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import { useDropdownContext } from './DropdownContext'

interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  width?: 'sm' | 'md' | 'lg'
}

const widthClasses = {
  sm: 'w-40',
  md: 'w-56',
  lg: 'w-72',
}

export function DropdownMenu({ children, className, width = 'md', ...props }: DropdownMenuProps) {
  const { isOpen } = useDropdownContext()

  if (!isOpen) return null

  return (
    <div
      className={clsx(
        'absolute z-50 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none',
        'origin-top-left left-0',
        '[data-placement="right"]:origin-top-right [data-placement="right"]:left-auto [data-placement="right"]:right-0',
        widthClasses[width],
        className
      )}
      role="menu"
      {...props}
    >
      <div className="py-2" role="none">
        {children}
      </div>
    </div>
  )
}
