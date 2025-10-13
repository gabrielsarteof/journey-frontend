import { UserStats } from './UserStats'
import { QuestsWidget } from './QuestsWidget'

export function DashboardRightSidebar() {
  return (
    <aside className="hidden border-l border-duoGrayBorder lg:flex flex-col bg-duoBackground w-90 xl:w-110 2xl:w-180">
      <div className="flex py-6 px-8 gap-8 sticky top-0 flex-col w-full">
        <div className="w-full flex justify-between">
          <UserStats />
        </div>
        <div className="rounded-2xl border-2 border-duoGrayBorder bg-duoDarkGray">
          <div className="p-4 border-b-2 border-duoGrayBorder">
            <h3 className="text-white font-bold text-lg">Daily Quests</h3>
          </div>
          <div className="pl-4 pr-6">
            <QuestsWidget />
          </div>
        </div>
      </div>
    </aside>
  )
}
