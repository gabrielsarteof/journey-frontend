import { NavigationButtons } from './NavigationButtons'

export function DashboardFooter() {
  return (
    <footer className="lg:hidden fixed bottom-0 left-0 right-0 h-20 border-t border-t-duoGrayBorder bg-duoBackground px-6">
      <div className="w-full h-full flex items-center justify-between">
        <NavigationButtons />
      </div>
    </footer>
  )
}
