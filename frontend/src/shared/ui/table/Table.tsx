import type { TableHTMLAttributes } from 'react'
import { clsx } from 'clsx'

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table
        className={clsx('min-w-full divide-y divide-gray-200 bg-white', className)}
        {...props}
      />
    </div>
  )
}
