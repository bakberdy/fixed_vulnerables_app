import { clsx } from 'clsx'
import { Avatar } from './Avatar'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface AvatarData {
  src?: string
  alt: string
}

interface AvatarGroupProps {
  avatars: AvatarData[]
  max?: number
  size?: AvatarSize
  className?: string
}

export function AvatarGroup({ 
  avatars, 
  max = 3, 
  size = 'md',
  className 
}: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max)
  const remainingCount = Math.max(0, avatars.length - max)

  return (
    <div className={clsx('flex items-center -space-x-2', className)}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          {...avatar}
          size={size}
          border
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={clsx(
            'flex items-center justify-center rounded-full',
            'bg-gray-200 text-gray-700 font-medium ring-2 ring-white',
            size === 'xs' && 'w-6 h-6 text-xs',
            size === 'sm' && 'w-8 h-8 text-sm',
            size === 'md' && 'w-10 h-10 text-base',
            size === 'lg' && 'w-12 h-12 text-lg',
            size === 'xl' && 'w-16 h-16 text-xl',
            size === '2xl' && 'w-24 h-24 text-3xl'
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
