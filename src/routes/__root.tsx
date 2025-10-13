import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { NotificationContainer } from '../shared/components/ui/NotificationContainer'
import { ThemeToggle } from '../shared/components/ui/ThemeToggle'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen bg-background transition-colors">
        <header className="p-4 border-b border-border-light bg-surface transition-colors">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-text-primary">
                Journey Frontend
              </h1>

              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/middleware-demo"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Middleware Demo
                </Link>
                <Link
                  to="/performance-demo"
                  className="text-text-secondary hover:text-text-primary transition-colors"
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