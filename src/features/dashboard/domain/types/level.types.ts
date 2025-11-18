/**
 * Level Types and DTOs
 *
 * Tipos alinhados com o backend API /api/levels
 */

export type LevelTypeDTO =
  | 'LESSON'
  | 'PRACTICE'
  | 'UNIT_REVIEW'
  | 'CODE_REVIEW'
  | 'SECURITY_AUDIT'
  | 'POLICY_CHECK'
  | 'DEBUG_SECURITY'
  | 'ADVANCED_CHALLENGE'

export type LevelStatusDTO = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'PERFECT'

export interface LevelProgressDTO {
  status: LevelStatusDTO
  score: number
  timeSpent: number
  completedAt?: string
  isPerfect: boolean
}

export interface LevelDTO {
  id: string
  unitId: string
  title: string
  description: string
  type: LevelTypeDTO
  orderIndex: number
  estimatedMinutes: number
  assetId?: string
  visualTheme?: {
    color?: string
    variant?: number
  }
  isLocked: boolean
  progress?: LevelProgressDTO
}

export interface LevelDetailsDTO extends LevelDTO {
  totalChallenges: number
  challenges?: any[] // ChallengeDTO[] quando implementado
}

export interface StartLevelRequest {
  levelId: string
}

export interface StartLevelResponse {
  id: string
  status: string
  startedAt: string
}

export interface CompleteLevelRequest {
  score: number
  timeSpent?: number
}

export interface CompleteLevelResponse {
  id: string
  status: LevelStatusDTO
  score: number
  timeSpent: number
  completedAt: string
  isPerfect: boolean
  xpEarned: number
}
