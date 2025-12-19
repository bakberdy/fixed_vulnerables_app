import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

type InputSize = 'sm' | 'md' | 'lg'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  size?: InputSize
  fullWidth?: boolean
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-base',
  lg: 'h-12 text-lg',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      size = 'md',
      fullWidth = true,
      required,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={clsx(fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-error-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full px-3 border rounded-lg',
              'transition-colors duration-normal',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              error
                ? 'border-error-500 focus:ring-error-500'
                : 'border-gray-300',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              sizeClasses[size],
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? 'error' : hint ? 'hint' : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id="error" className="mt-1 text-sm text-error-600">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id="hint" className="mt-1 text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
