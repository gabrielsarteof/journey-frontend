import { Level } from '../../domain/entities/Level'
import { LevelService } from '../services/LevelService'
import { LevelMapper } from '../../domain/mappers/LevelMapper'
import { ChallengeMapper } from '../../domain/mappers/ChallengeMapper'

/**
 * LevelRepository
 *
 * Repositório para operações com Levels
 * Coordena LevelService e mappers
 */

export interface LevelRepositoryInterface {
  findByUnitId(unitId: string): Promise<Level[]>
  findById(levelId: string): Promise<Level | null>
  findByIdWithChallenges(levelId: string): Promise<Level | null>
}

export class LevelRepository implements LevelRepositoryInterface {
  constructor(private readonly levelService: LevelService) {}

  /**
   * Busca todos os levels de uma unit (sem challenges)
   */
  async findByUnitId(unitId: string): Promise<Level[]> {
    const levelDTOs = await this.levelService.getUnitLevels(unitId)
    return LevelMapper.toDomainList(levelDTOs)
  }

  /**
   * Busca um level pelo ID (sem challenges)
   */
  async findById(levelId: string): Promise<Level | null> {
    try {
      const levelDto = await this.levelService.getLevelDetails(levelId)
      return LevelMapper.toDomain(levelDto, [])
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return null
      }
      throw error
    }
  }

  /**
   * Busca um level pelo ID com todos os challenges
   */
  async findByIdWithChallenges(levelId: string): Promise<Level | null> {
    try {
      const levelDto = await this.levelService.getLevelDetails(levelId)

      const challenges = levelDto.challenges
        ? ChallengeMapper.toDomainList(levelDto.challenges)
        : []

      return LevelMapper.toDomain(levelDto, challenges)
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return null
      }
      throw error
    }
  }
}
