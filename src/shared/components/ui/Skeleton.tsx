import { cn } from '@/shared/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Skeleton component para loading states.
 * Baseado em shadcn/ui - usa animate-pulse do Tailwind.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-border-secondary', className)}
      {...props}
    />
  )
}
