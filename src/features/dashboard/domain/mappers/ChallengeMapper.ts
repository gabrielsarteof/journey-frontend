import { Challenge } from '../entities/Challenge'
import { ChallengeType} from '../value-objects/ChallengeType'
import { ChallengeStatus } from '../value-objects/ChallengeStatus'
import { PlanetAsset } from '../value-objects/PlanetAsset'
import { PlanetAssetCatalog } from '../../infrastructure/repositories/PlanetAssetCatalog'

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
  planetImage: string | null
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
    return Challenge.create({
      id: dto.id,
      title: dto.title,
      type: this.mapType(dto.category, dto.difficulty),
      status: ChallengeStatus.create(dto.status),
      planetAsset: this.resolvePlanetAsset(dto.planetImage, dto.visualTheme),
      orderIndex: dto.orderInModule,
      points: dto.baseXp,
      completedStars: dto.completedStars,
      maxStars: 3,
    })
  }

  static toDomainList(dtos: ChallengeDTO[]): Challenge[] {
    return dtos.map(dto => this.toDomain(dto))
  }

  // Maps difficulty to ChallengeType: EASY->lesson, MEDIUM->practice, HARD->debug, EXPERT->refactor
  private static mapType(category: string, difficulty: string): ChallengeType {
    if (difficulty === 'EASY') return ChallengeType.lesson()
    if (difficulty === 'MEDIUM') return ChallengeType.practice()
    if (difficulty === 'HARD') return ChallengeType.debug()
    if (difficulty === 'EXPERT') return ChallengeType.refactor()
    return ChallengeType.lesson()
  }

  // Resolves planetImage: URL -> custom asset, filename -> local catalog, null -> unknown
  private static resolvePlanetAsset(
    planetImage: string | null,
    visualTheme?: { color?: string; variant?: number }
  ): PlanetAsset {
    if (!planetImage) {
      return PlanetAssetCatalog.getAsset('unknown', 1)
    }

    if (planetImage.startsWith('http')) {
      return PlanetAsset.create({
        name: 'custom',
        path: planetImage,
        variant: visualTheme?.variant,
        altText: 'Challenge planet',
      })
    }

    const planetName = planetImage.replace('.png', '').replace('.jpg', '')
    return PlanetAssetCatalog.getAsset(planetName, visualTheme?.variant || 1)
  }
}
