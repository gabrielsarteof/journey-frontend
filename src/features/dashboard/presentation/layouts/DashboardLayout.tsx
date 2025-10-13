import type { ReactNode } from 'react'
import { DashboardLeftSidebar } from '../components/DashboardLeftSidebar'
import { DashboardRightSidebar } from '../components/DashboardRightSidebar'
import { DashboardFooter } from '../components/DashboardFooter'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen h-screen bg-duoBackground scrollbar-journeyBlack max-h-screen lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] overflow-y-auto overscroll-none">
      <DashboardLeftSidebar />

      <div className="flex flex-col lg:px-6 lg:items-end min-w-0">
        {children}
      </div>

      <DashboardFooter />
      <DashboardRightSidebar />
    </div>
  )
}
