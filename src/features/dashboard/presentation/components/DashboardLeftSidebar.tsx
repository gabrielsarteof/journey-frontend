import { NavigationButtons } from './NavigationButtons'

export function DashboardLeftSidebar() {
  return (
    <aside className="hidden border-r border-duoGrayBorder lg:flex flex-col bg-duoBackground xl:w-80 lg:w-60 2xl:w-85">
      <div className="flex p-6 gap-4 sticky top-0 flex-col w-full">
        <NavigationButtons />
      </div>
    </aside>
  )
}
