import { useEffect, useRef, useState, type ReactNode } from 'react'
import { clsx } from 'clsx'
import { DropdownContext } from './DropdownContext'

interface DropdownProps {
  children: ReactNode
  className?: string
  placement?: 'left' | 'right'
}

export function Dropdown({ children, className, placement = 'left' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current || containerRef.current.contains(event.target as Node)) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggle = () => setIsOpen((prev) => !prev)
  const close = () => setIsOpen(false)

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div ref={containerRef} className={clsx('relative inline-block text-left', className)} data-placement={placement}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}
