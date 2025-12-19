import { Skeleton } from './Skeleton'

export function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <Skeleton variant="rectangular" height={200} />
      <Skeleton width="80%" />
      <Skeleton width="60%" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton width={100} />
        <Skeleton width={80} />
      </div>
    </div>
  )
}
