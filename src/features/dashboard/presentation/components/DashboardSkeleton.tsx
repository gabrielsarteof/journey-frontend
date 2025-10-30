import { Skeleton } from '@/shared/components/ui/Skeleton'

export function DashboardSkeleton() {
  return (
    <div className="w-full h-full bg-background overflow-y-auto transition-colors">
      <div className="w-full flex justify-center py-8 lg:py-12 px-4">
        <div className="w-full max-w-2xl rounded-2xl overflow-hidden">
          <div className="flex items-center h-28 px-6">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex items-center justify-center w-20 h-20">
              <Skeleton className="w-12 h-12 rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mb-12 lg:mb-16">
        <Skeleton className="h-4 w-20 mb-4" />
        <Skeleton className="w-24 h-24 lg:w-28 lg:h-28 rounded-full" />
      </div>

      <div className="w-full flex flex-col items-center px-4 lg:px-0">
        {[...Array(2)].map((_, moduleIndex) => (
          <div key={moduleIndex} className="w-full">
            {moduleIndex > 0 && (
              <div className="flex items-center justify-center my-12 w-full max-w-2xl mx-auto">
                <div className="flex-1 border-t-2 border-border-secondary"></div>
                <div className="px-8 py-3 bg-surface-elevated rounded-full border-2 border-border-secondary">
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex-1 border-t-2 border-border-secondary"></div>
              </div>
            )}

            <div className="flex flex-col w-full max-w-2xl items-center space-y-12 relative py-8 mx-auto">
              {[...Array(5)].map((_, lessonIndex) => {
                const offset = lessonIndex % 2 === 0 ? 'translate-x-16' : '-translate-x-16'

                return (
                  <div key={lessonIndex} className={`w-auto transform ${offset}`}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <Skeleton className="w-24 h-24 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
