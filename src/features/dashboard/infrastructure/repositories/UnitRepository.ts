import { Unit } from '../../domain/entities/Unit'
import { UnitService } from '../services/UnitService'
import { LevelService } from '../services/LevelService'
import { UnitMapper } from '../../domain/mappers/UnitMapper'
import { LevelMapper } from '../../domain/mappers/LevelMapper'
import { ChallengeMapper } from '../../domain/mappers/ChallengeMapper'

/**
 * UnitRepository
 *
 * Repositório para operações com Units
 * Coordena UnitService, LevelService e mappers
 */

export interface UnitRepositoryInterface {
  findByModuleId(moduleId: string): Promise<Unit[]>
  findById(unitId: string): Promise<Unit | null>
  findByIdWithLevels(unitId: string): Promise<Unit | null>
}

export class UnitRepository implements UnitRepositoryInterface {
  constructor(
    private readonly unitService: UnitService,
    private readonly levelService: LevelService
  ) {}

  /**
   * Busca todas as units de um módulo com seus levels populados
   */
  async findByModuleId(moduleId: string): Promise<Unit[]> {
    const unitDTOs = await this.unitService.getModuleUnits(moduleId)

    const levelsByUnit = new Map()

    // Busca levels para cada unit em paralelo
    await Promise.all(
      unitDTOs.map(async (unitDto) => {
        const levelDTOs = await this.levelService.getUnitLevels(unitDto.id)
        const levels = LevelMapper.toDomainList(levelDTOs)
        levelsByUnit.set(unitDto.id, levels)
      })
    )

    return UnitMapper.toDomainList(unitDTOs, levelsByUnit)
  }

  /**
   * Busca uma unit pelo ID (sem levels)
   */
  async findById(unitId: string): Promise<Unit | null> {
    try {
      const unitDto = await this.unitService.getUnitDetails(unitId)
      return UnitMapper.toDomain(unitDto, [])
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return null
      }
      throw error
    }
  }

  /**
   * Busca uma unit pelo ID com todos os levels e seus challenges
   */
  async findByIdWithLevels(unitId: string): Promise<Unit | null> {
    try {
      const [unitDto, levelDTOs] = await Promise.all([
        this.unitService.getUnitDetails(unitId),
        this.levelService.getUnitLevels(unitId)
      ])

      // Para cada level, buscar seus detalhes com challenges
      const challengesByLevel = new Map()

      await Promise.all(
        levelDTOs.map(async (levelDto) => {
          const levelDetails = await this.levelService.getLevelDetails(levelDto.id)
          if (levelDetails.challenges) {
            const challenges = ChallengeMapper.toDomainList(levelDetails.challenges)
            challengesByLevel.set(levelDto.id, challenges)
          }
        })
      )

      const levels = LevelMapper.toDomainList(levelDTOs, challengesByLevel)

      return UnitMapper.toDomain(unitDto, levels)
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return null
      }
      throw error
    }
  }
}
