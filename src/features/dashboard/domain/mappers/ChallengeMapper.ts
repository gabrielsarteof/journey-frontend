import { Challenge } from '../entities/Challenge'
import { ChallengeType} from '../value-objects/ChallengeType'
import { ChallengeStatus } from '../value-objects/ChallengeStatus'
import { PlanetAsset } from '../value-objects/PlanetAsset'
import { PlanetAssetCatalog, type AssetId } from '../../infrastructure/repositories/PlanetAssetCatalog'

export interface ChallengeDTO {
  id: string
  slug: string
  title: string
  description: string
  orderInModule: number
  difficulty: string
  category: string
  estimatedMinutes: number
  languages: string[]
  assetId: string | null
  visualTheme?: {
    color?: string
    variant?: number
  }
  baseXp: number
  bonusXp: number
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  completedStars: number
  lastAttempt?: {
    score: number
    completedAt: string
  }
}

export class ChallengeMapper {
  static toDomain(dto: ChallengeDTO): Challenge {
    const assetId = this.resolveAssetId(dto.assetId)

    return Challenge.create({
      id: dto.id,
      title: dto.title,
      type: this.mapType(dto.category, dto.difficulty),
      status: ChallengeStatus.create(dto.status),
      planetAsset: this.resolvePlanetAsset(assetId),
      assetId: assetId,
      orderIndex: dto.orderInModule,
      points: dto.baseXp,
      completedStars: dto.completedStars,
      maxStars: 3,
    })
  }

  static toDomainList(dtos: ChallengeDTO[]): Challenge[] {
    return dtos.map(dto => this.toDomain(dto))
  }

  private static mapType(category: string, difficulty: string): ChallengeType {
    if (difficulty === 'EASY') return ChallengeType.lesson()
    if (difficulty === 'MEDIUM') return ChallengeType.practice()
    if (difficulty === 'HARD') return ChallengeType.debug()
    if (difficulty === 'EXPERT') return ChallengeType.refactor()
    return ChallengeType.lesson()
  }

  private static resolveAssetId(assetId: string | null): AssetId {
    if (!assetId || !this.isValidAssetId(assetId)) {
      return 'planet-01'
    }
    return assetId as AssetId
  }

  private static isValidAssetId(assetId: string): boolean {
    return /^planet-(0[1-9]|10)$/.test(assetId)
  }

  private static resolvePlanetAsset(assetId: AssetId): PlanetAsset {
    return PlanetAssetCatalog.getAsset(assetId)
  }
}
