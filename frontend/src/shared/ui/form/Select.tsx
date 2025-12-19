import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
  fullWidth?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder,
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
        <select
          ref={ref}
          className={clsx(
            'w-full h-10 px-3 border rounded-lg',
            'transition-colors duration-normal',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            'appearance-none bg-white',
            'bg-[url("data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2216%22%20height=%2216%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22currentColor%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpolyline%20points=%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E")]',
            'bg-no-repeat bg-[right_0.75rem_center]',
            error ? 'border-error-500 focus:ring-error-500' : 'border-gray-300',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? 'error' : hint ? 'hint' : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select'
