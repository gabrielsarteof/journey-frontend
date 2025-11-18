/**
 * Unit Types and DTOs
 *
 * Tipos alinhados com o backend API /api/units
 */

export interface UnitResourceDTO {
  articles: Array<{
    title: string
    url: string
    author?: string
  }>
  videos: Array<{
    title: string
    url: string
    duration?: number
    platform?: string
  }>
}

export interface UnitProgressDTO {
  status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED'
  levelsCompleted: number
  totalLevels: number
  completionPercentage: number
  totalXpEarned: number
  averageScore: number
  currentLevelId?: string
  lastAccessedAt?: string
}

export interface UnitDTO {
  id: string
  moduleId: string
  title: string
  description: string
  orderIndex: number
  learningObjectives: string[]
  estimatedMinutes: number
  theoryContent: string
  resources: UnitResourceDTO
  requiredScore: number
  isLocked: boolean
  progress?: UnitProgressDTO
}

export interface UnitDetailsDTO extends UnitDTO {
  totalLevels: number
}

export interface UpdateUnitProgressRequest {
  levelsCompleted: number
  currentLevelId?: string
  xpEarned?: number
  score?: number
}

export interface UpdateUnitProgressResponse {
  id: string
  status: string
  levelsCompleted: number
  totalLevels: number
  completionPercentage: number
  totalXpEarned: number
  averageScore: number
  currentLevelId?: string
}
