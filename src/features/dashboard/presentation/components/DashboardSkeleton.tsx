import { Skeleton } from '@/shared/components/ui/Skeleton'

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen h-screen bg-background scrollbar-journeyBlack max-h-screen lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] overflow-y-auto overscroll-none transition-colors">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-border-secondary bg-surface px-4 z-40 transition-colors">
        <div className="w-full h-full flex items-center">
          <div className="flex w-full justify-between items-center gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Skeleton className="w-6 h-6" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-5 w-12" />
                  {i === 3 && <Skeleton className="h-3 w-16" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Left Sidebar - Desktop */}
      <aside className="hidden border-r border-border-secondary lg:flex flex-col bg-surface w-64 px-4 transition-colors">
        <div className="flex py-8 gap-2 sticky top-0 flex-col w-full">
          <div className="mb-8">
            <Skeleton className="h-12 w-32" />
          </div>
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all ${
                  i === 0 ? 'bg-surface-elevated' : ''
                }`}
              >
                <Skeleton className="w-8 h-8" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col lg:px-6 lg:items-end min-w-0 pt-16 pb-20 lg:pt-0 lg:pb-0">
        <div className="w-full h-full bg-background overflow-y-auto transition-colors">
          {/* Unit Banner */}
          <div className="w-full flex justify-center py-6 lg:py-8 px-4">
            <div className="w-full max-w-xl rounded-2xl overflow-hidden bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600">
              <div className="flex items-center h-28 px-6">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 bg-white/30" />
                  <Skeleton className="h-7 w-40 bg-white/30" />
                </div>
                <div className="flex items-center justify-center w-20 h-20 border-l-2 border-white/20">
                  <Skeleton className="w-12 h-12 rounded bg-white/30" />
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Path */}
          <div className="w-full flex flex-col items-center px-4 lg:px-0">
            {/* First Module */}
            <div className="flex flex-col w-full max-w-2xl items-center space-y-6 py-6 pt-16">
              {[...Array(5)].map((_, idx) => {
                const offsetStyle = idx === 0
                  ? {}
                  : idx % 2 === 1
                  ? { marginLeft: '4rem' }
                  : { marginRight: '4rem' }

                return (
                  <div key={idx} className="relative w-full" style={offsetStyle}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <Skeleton className="w-24 h-24 rounded-full" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Module Break */}
            <div className="flex items-center justify-center my-12 w-full max-w-2xl">
              <div className="flex-1 border-t-2 border-border-secondary transition-colors"></div>
              <div className="px-8 py-3 bg-surface-elevated rounded-full border-2 border-border-secondary transition-colors">
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex-1 border-t-2 border-border-secondary transition-colors"></div>
            </div>

            {/* Second Module */}
            <div className="flex flex-col w-full max-w-2xl items-center space-y-6 py-6 pt-16">
              {[...Array(5)].map((_, idx) => {
                const offsetStyle = idx === 0
                  ? {}
                  : idx % 2 === 1
                  ? { marginLeft: '4rem' }
                  : { marginRight: '4rem' }

                return (
                  <div key={idx} className="relative w-full" style={offsetStyle}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <Skeleton className="w-24 h-24 rounded-full" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col bg-surface w-96 px-6 transition-colors">
        <div className="flex py-8 gap-8 sticky top-0 flex-col w-full">
          {/* UserStats */}
          <div className="w-full flex justify-between">
            <div className="flex w-full justify-between items-center gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Skeleton className="w-6 h-6" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-5 w-12" />
                    {i === 3 && <Skeleton className="h-3 w-16" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Quests */}
          <div className="rounded-2xl border-2 border-border-secondary overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b-2 border-border-secondary transition-colors">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="px-6 py-6">
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-32" />
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="w-4 h-4" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leagues Widget */}
          <div className="p-6 bg-surface-elevated rounded-2xl border-2 border-border-secondary transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-border-secondary rounded-full flex items-center justify-center transition-colors">
                <Skeleton className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-2" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </aside>

      {/* Mobile Footer */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 h-20 border-t border-border-secondary bg-surface z-40 transition-colors">
        <div className="w-full grid grid-cols-5 gap-1 h-full">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-2">
              <Skeleton className="w-6 h-6" />
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}
