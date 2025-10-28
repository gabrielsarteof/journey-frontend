import { NavigationButtons } from './NavigationButtons'
import { ThemedImage } from '../../../../shared/components/ui/ThemedImage'

export function DashboardLeftSidebar() {
  return (
    <aside className="hidden border-r border-border-secondary lg:flex flex-col bg-surface w-64 px-4 transition-colors">
      <div className="flex py-8 gap-2 sticky top-0 flex-col w-full">
        <div className="mb-8">
          <ThemedImage
            lightSrc="/brand/journey-text-light.svg"
            darkSrc="/brand/journey-text-dark.svg"
            alt="Journey"
            className="h-12"
          />
        </div>
        <NavigationButtons />
      </div>
    </aside>
  )
}