import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div>
        <label className="inline-flex items-center cursor-pointer">
          <input
            ref={ref}
            type="radio"
            className={clsx(
              'w-4 h-4 border-gray-300',
              'text-primary-600',
              'focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
              'transition-colors duration-normal',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-error-500',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          {label && (
            <span className="ml-2 text-sm text-gray-700">{label}</span>
          )}
        </label>
        {error && (
          <p className="mt-1 text-sm text-error-600">{error}</p>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'
