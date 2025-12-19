import type { ImgHTMLAttributes } from 'react'
import { clsx } from 'clsx'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy'

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string
  alt: string
  size?: AvatarSize
  fallback?: string
  status?: AvatarStatus
  border?: boolean
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-3xl',
}

const statusColors: Record<AvatarStatus, string> = {
  online: 'bg-success-500',
  offline: 'bg-gray-400',
  away: 'bg-warning-500',
  busy: 'bg-error-500',
}

const statusSizes: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function Avatar({
  src,
  alt,
  size = 'md',
  fallback,
  status,
  border = false,
  className,
  onClick,
  ...props
}: AvatarProps) {
  const displayFallback = fallback || getInitials(alt)

  return (
    <div className="relative inline-block">
      <div
        className={clsx(
          'relative flex items-center justify-center rounded-full overflow-hidden',
          'bg-gray-200 text-gray-700 font-medium',
          sizeClasses[size],
          border && 'ring-2 ring-white',
          onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            {...props}
          />
        ) : (
          <span>{displayFallback}</span>
        )}
      </div>
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            statusColors[status],
            statusSizes[size]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  )
}
