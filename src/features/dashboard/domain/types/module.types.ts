export interface ModuleThemeDTO {
  color: string
  gradient?: string[]
}

export interface ModuleProgressDTO {
  status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED'
  challengesCompleted: number
  totalChallenges: number
  completionPercentage: number
  totalXpEarned: number
  averageScore: number
  lastAccessedAt?: string
}

export interface ModuleWithProgressDTO {
  id: string
  slug: string
  title: string
  description: string
  orderIndex: number
  iconImage: string
  theme: ModuleThemeDTO
  requiredXp: number
  requiredLevel: number
  isLocked: boolean
  isNew: boolean
  progress: ModuleProgressDTO | null
}

export interface ModuleDetailsDTO extends ModuleWithProgressDTO {
  totalChallenges: number
}

export interface UpdateModuleProgressRequest {
  challengesCompleted: number
  xpEarned: number
  score: number
}

export interface UpdateModuleProgressResponse {
  id: string
  status: string
  challengesCompleted: number
  totalChallenges: number
  completionPercentage: number
  totalXpEarned: number
  averageScore: number
}
