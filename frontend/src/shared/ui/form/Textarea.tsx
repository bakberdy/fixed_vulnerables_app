import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  fullWidth?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, fullWidth = true, required, className, ...props }, ref) => {
    return (
      <div className={clsx(fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-error-600 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'w-full px-3 py-2 border rounded-lg',
            'transition-colors duration-normal',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            'resize-y',
            error ? 'border-error-500 focus:ring-error-500' : 'border-gray-300',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? 'error' : hint ? 'hint' : undefined}
          {...props}
        />
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

Textarea.displayName = 'Textarea'
