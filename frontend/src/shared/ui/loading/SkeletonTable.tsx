import { Skeleton } from './Skeleton'

interface SkeletonTableProps {
  rows?: number
}

export function SkeletonTable({ rows = 5 }: SkeletonTableProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton width="30%" />
          <Skeleton width="20%" />
          <Skeleton width="15%" />
          <Skeleton width="10%" className="ml-auto" />
        </div>
      ))}
    </div>
  )
}
