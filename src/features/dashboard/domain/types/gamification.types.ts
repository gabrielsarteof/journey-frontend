export interface DashboardResponseDTO {
  user: {
    currentXP: number
    level: number
    levelTitle: string
    nextLevelXP: number
    nextLevelProgress: number
    levelPerks: string[]
  }
  streak: {
    current: number
    longest: number
    status: 'ACTIVE' | 'AT_RISK' | 'BROKEN'
    nextMilestone: number
    daysUntilMilestone: number
    freezesAvailable: number
    willExpireAt: string | null
  }
  badges: {
    recent: BadgeDTO[]
    total: number
    unlocked: number
  }
  ranking: {
    global: number
    company: number | null
    weeklyChange: number
  }
  dailyGoal: {
    xpTarget: number
    xpEarned: number
    completed: boolean
    completionPercentage: number
  }
  notifications: {
    unreadCount: number
  }
}

export interface BadgeDTO {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  unlockedAt: string
}

export interface UserStatsData {
  currentStreak: number
  longestStreak: number
  streakStatus: 'ACTIVE' | 'AT_RISK' | 'BROKEN'
  freezesAvailable: number

  dailyXPTarget: number
  dailyXPEarned: number
  dailyXPCompletionPercentage: number
  dailyGoalCompleted: boolean

  totalXP: number
  xpGainedToday: number

  currentLevel: number
  levelTitle: string
  currentLevelXP: number
  nextLevelXP: number
  nextLevelProgress: number
  levelPerks: string[]
}
