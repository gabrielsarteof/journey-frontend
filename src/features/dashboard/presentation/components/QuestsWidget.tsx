// Dados estáticos de quests mockadas
const mockQuests = [
  { id: 1, title: 'Complete 3 lessons', progress: 2, total: 3, reward: 50 },
  { id: 2, title: 'Practice for 10 minutes', progress: 7, total: 10, reward: 20 },
  { id: 3, title: 'Get 100% on a lesson', progress: 0, total: 1, reward: 100 },
]

export function QuestsWidget() {
  return (
    <div className="py-4 space-y-4">
      {mockQuests.map((quest) => {
        const progressPercent = (quest.progress / quest.total) * 100

        return (
          <div key={quest.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-white text-sm">{quest.title}</p>
              <div className="flex items-center gap-1">
                <span className="text-duoGold text-sm">+{quest.reward}</span>
                <span className="text-duoGold">💎</span>
              </div>
            </div>

            <div className="w-full bg-duoGrayBorder rounded-full h-3">
              <div
                className="bg-duoGreen h-3 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-duoGrayText text-xs">
              {quest.progress}/{quest.total} completed
            </p>
          </div>
        )
      })}
    </div>
  )
}
