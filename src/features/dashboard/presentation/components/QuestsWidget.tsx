// Dados estáticos de quests mockadas
const mockQuests = [
  { id: 1, title: 'Complete 3 lições', progress: 2, total: 3, reward: 50 },
  { id: 2, title: 'Practice por 10 minutos', progress: 7, total: 10, reward: 20 },
  { id: 3, title: 'Consiga 100% em uma lição', progress: 0, total: 1, reward: 100 },
]

export function QuestsWidget() {
  return (
    <div className="space-y-6">
      {mockQuests.map((quest) => {
        const progressPercent = (quest.progress / quest.total) * 100

        return (
          <div key={quest.id} className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-auth-heading text-sm font-medium transition-colors">{quest.title}</p>
              <div className="flex items-center gap-1">
                <span className="text-gold text-sm font-bold">+{quest.reward}</span>
                <span className="text-gold">💎</span>
              </div>
            </div>

            <div className="w-full bg-border-secondary rounded-full h-4 overflow-hidden transition-colors">
              <div
                className="bg-primary-button h-4 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-text-secondary text-xs transition-colors">
              {quest.progress}/{quest.total} completed
            </p>
          </div>
        )
      })}
    </div>
  )
}