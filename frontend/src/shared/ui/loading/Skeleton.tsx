import type { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

type SkeletonVariant = 'text' | 'circular' | 'rectangular'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  width?: string | number
  height?: string | number
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: 'h-4 rounded',
  circular: 'rounded-full',
  rectangular: 'rounded',
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  const inlineStyles = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div
      className={clsx(
        'bg-gray-200 animate-pulse',
        variantClasses[variant],
        !width && variant !== 'circular' && 'w-full',
        className
      )}
      style={inlineStyles}
      aria-hidden="true"
      {...props}
    />
  )
}
