import type { ReactNode } from 'react'
import { DashboardLeftSidebar } from '../components/DashboardLeftSidebar'
import { DashboardRightSidebar } from '../components/DashboardRightSidebar'
import { DashboardFooter } from '../components/DashboardFooter'
import { UserStats } from '../components/UserStats'
import { useAuthRedirect } from '@/features/auth/presentation/hooks/useAuthRedirect'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  useAuthRedirect()

  return (
    <div className="min-h-screen h-screen bg-background scrollbar-journeyBlack max-h-screen lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] overflow-y-auto overscroll-none transition-colors">
      {/* Mobile Header - visible only on mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-border-secondary bg-surface px-4 z-40 transition-colors">
        <div className="w-full h-full flex items-center">
          <UserStats />
        </div>
      </header>

      {/* Left Sidebar - visible only on desktop */}
      <DashboardLeftSidebar />

      {/* Main Content */}
      <div className="flex flex-col lg:px-6 lg:items-end min-w-0 pt-16 pb-20 lg:pt-0 lg:pb-0">
        {children}
      </div>

      {/* Right Sidebar - visible only on desktop */}
      <DashboardRightSidebar />

      {/* Mobile Footer - visible only on mobile */}
      <DashboardFooter />
    </div>
  )
}
