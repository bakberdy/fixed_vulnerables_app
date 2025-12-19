import type { ImgHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: '16/9' | '4/3' | '1/1'
}

const aspectRatioClasses = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
}

export function CardImage({ 
  aspectRatio = '16/9', 
  className, 
  alt,
  ...props 
}: CardImageProps) {
  return (
    <div className={clsx('overflow-hidden', aspectRatioClasses[aspectRatio])}>
      <img
        className={clsx('w-full h-full object-cover', className)}
        alt={alt}
        {...props}
      />
    </div>
  )
}
