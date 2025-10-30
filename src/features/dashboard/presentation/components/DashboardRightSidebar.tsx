import { UserStats } from './UserStats'
import { QuestsWidget } from './QuestsWidget'

export function DashboardRightSidebar() {
  return (
    <aside className="hidden lg:flex border-l border-border-secondary flex-col bg-surface w-96 px-6 transition-colors">
      <div className="flex py-8 gap-8 sticky top-0 flex-col w-full">
        {/* UserStats - visible only on desktop (mobile has it in header) */}
        <div className="w-full flex justify-between">
          <UserStats />
        </div>

        {/* Daily Quests - visible only on desktop */}
        <div className="rounded-2xl border-2 border-border-secondary bg-surface-elevated overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b-2 border-border-secondary transition-colors">
            <h3 className="text-auth-heading font-bold text-xl transition-colors">Missões do dia</h3>
          </div>
          <div className="px-6 py-6">
            <QuestsWidget />
          </div>
        </div>

        {/* Leagues Widget - visible only on desktop */}
        <div className="p-6 bg-surface-elevated rounded-2xl border-2 border-border-secondary transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-border-secondary rounded-full flex items-center justify-center transition-colors">
              <span className="text-2xl">🔒</span>
            </div>
            <div>
              <h4 className="text-auth-heading font-bold text-base transition-colors">Desbloqueie as Ligas!</h4>
            </div>
          </div>
          <p className="text-secondary text-sm transition-colors">
            Complete mais 10 lições pra começar a competir.
          </p>
        </div>
      </div>
    </aside>
  )
}