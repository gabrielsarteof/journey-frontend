import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { NotificationContainer } from '../shared/components/ui/NotificationContainer'
import { ThemeToggle } from '../shared/components/ui/ThemeToggle'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen bg-journeyBackground dark:bg-journeyDarkBlack transition-colors">
        {/* Header com navegação e theme toggle */}
        <header className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-journeyBlack dark:text-white">
                Journey Frontend
              </h1>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/middleware-demo"
                  className="text-journeyGrayText dark:text-gray-300 hover:text-journeyBlack dark:hover:text-white transition-colors"
                >
                  Middleware Demo
                </Link>
                <Link
                  to="/performance-demo"
                  className="text-journeyGrayText dark:text-gray-300 hover:text-journeyBlack dark:hover:text-white transition-colors"
                >
                  Performance Demo
                </Link>
              </nav>
            </div>

            <ThemeToggle />
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>

      {/* Global UI Components */}
      <NotificationContainer />

      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
})