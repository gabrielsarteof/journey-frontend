import { Link } from '@tanstack/react-router'
import { NavigationButtons } from './NavigationButtons'

export function DashboardFooter() {
  return (
    <footer className="lg:hidden fixed bottom-0 left-0 right-0 h-20 border-t border-border-secondary bg-surface px-4 z-40 transition-colors">
      <div className="w-full h-full flex items-center justify-center">
        <NavigationButtons variant="mobile" />
      </div>
      <div className="absolute bottom-1 right-2 text-xs">
        <Link
          to="/credits"
          className="text-muted hover:text-muted-foreground transition-colors"
        >
          Credits
        </Link>
      </div>
    </footer>
  )
}
