import { createRootRouteWithContext, Outlet, Link, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { NotificationContainer } from '../shared/components/ui/NotificationContainer'
import { ThemeToggle } from '../shared/components/ui/ThemeToggle'
import type { RouterContext } from '../shared/types/router'

function RootComponent() {
  const router = useRouterState()
  const currentPath = router.location.pathname

  // Páginas que não devem mostrar o header (páginas de autenticação e landing)
  const hideHeaderPaths = ['/', '/auth/login', '/auth/register']
  const shouldHideHeader = hideHeaderPaths.includes(currentPath)

  return (
    <>
      <div className="min-h-screen bg-background transition-colors flex flex-col">
        {/* Header - Escondido em páginas de auth e landing */}
        {!shouldHideHeader && (
          <header className="p-4 border-b border-border-light bg-surface transition-colors flex-shrink-0">
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
        )}

        {/* Main - Ocupa todo o espaço restante e centraliza verticalmente quando header está escondido */}
        <main className={shouldHideHeader ? "flex-1 flex items-center justify-center overflow-auto" : ""}>
          <Outlet />
        </main>
      </div>

      {/* Global UI Components */}
      <NotificationContainer />

      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})