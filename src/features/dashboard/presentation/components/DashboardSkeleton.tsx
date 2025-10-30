import { Skeleton } from '@/shared/components/ui/Skeleton'

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen h-screen bg-background max-h-screen lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] overflow-y-auto transition-colors">
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-border-secondary bg-surface px-4 z-40 transition-colors">
        <div className="w-full h-full flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </header>

      <aside className="hidden lg:block border-r border-border-secondary bg-surface w-80 transition-colors">
        <div className="sticky top-0 p-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </aside>

      <div className="flex flex-col lg:px-6 lg:items-end min-w-0 pt-16 pb-20 lg:pt-0 lg:pb-0">
        <div className="w-full h-full bg-background overflow-y-auto transition-colors">
          <div className="w-full flex justify-center py-8 lg:py-12 px-4">
            <div className="w-full max-w-2xl rounded-2xl overflow-hidden bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 animate-pulse" style={{ boxShadow: '0 8px 0 rgba(0, 0, 0, 0.15)' }}>
              <div className="flex items-center h-28 px-6">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24 bg-white/30" />
                  <Skeleton className="h-7 w-48 bg-white/30" />
                  <Skeleton className="h-4 w-64 bg-white/30" />
                </div>
                <div className="flex items-center justify-center w-20 h-20 border-l-2 border-white/20">
                  <Skeleton className="w-12 h-12 rounded bg-white/30" />
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
      </div>

      <aside className="hidden lg:flex border-l border-border-secondary flex-col bg-surface w-96 px-6 transition-colors">
        <div className="flex py-8 gap-8 sticky top-0 flex-col w-full">
          <div className="w-full flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="rounded-2xl border-2 border-border-secondary bg-surface-elevated overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b-2 border-border-secondary transition-colors">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="px-6 py-6 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-surface-elevated rounded-2xl border-2 border-border-secondary transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </aside>

      <footer className="lg:hidden fixed bottom-0 left-0 right-0 h-20 border-t border-border-secondary bg-surface z-40 transition-colors">
        <div className="h-full flex items-center justify-around px-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </footer>
    </div>
  )
}
