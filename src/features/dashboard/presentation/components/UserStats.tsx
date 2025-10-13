import { FlameIcon, GemIcon, HeartIcon, FlagIcon } from './icons'

// Dados estáticos mockados
const mockUserStats = {
  language: 'JavaScript',
  languageFlag: '🇺🇸',
  completedLessons: 12,
  streakLength: 7,
  points: 350,
  hearts: Infinity,
}

export function UserStats() {
  return (
    <div className="flex w-full justify-between">
      <div className="flex gap-3 items-center">
        <div className="hover:cursor-pointer">
          <FlagIcon flag={mockUserStats.languageFlag} />
        </div>
        <p className="text-xl text-white">{mockUserStats.completedLessons}</p>
      </div>

      <div className="flex gap-2 items-center">
        <FlameIcon />
        <p className="text-xl text-duoOrange">{mockUserStats.streakLength}</p>
      </div>

      <div className="flex gap-1 items-center">
        <GemIcon />
        <p className="text-xl text-duoBlue">{mockUserStats.points}</p>
      </div>

      <div className="flex gap-1 items-center">
        <HeartIcon />
        <p className="text-2xl text-duoRed">∞</p>
      </div>
    </div>
  )
}
