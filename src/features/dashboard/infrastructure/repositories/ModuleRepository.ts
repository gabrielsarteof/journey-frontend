import { Module } from '../../domain/entities/Module'
import { ModuleService } from '../services/ModuleService'
import { ModuleMapper } from '../../domain/mappers/ModuleMapper'
import { ChallengeMapper } from '../../domain/mappers/ChallengeMapper'

export interface ModuleRepositoryInterface {
  findAllWithProgress(): Promise<Module[]>
  findBySlugWithChallenges(slug: string): Promise<Module | null>
}

export class ModuleRepository implements ModuleRepositoryInterface {
  constructor(private readonly service: ModuleService) {}

  async findAllWithProgress(): Promise<Module[]> {
    const moduleDTOs = await this.service.getModulesWithProgress()

    const challengesMap = new Map()

    // Fetch challenges for each module in parallel
    await Promise.all(
      moduleDTOs.map(async (moduleDto) => {
        const challengeDTOs = await this.service.getModuleChallenges(moduleDto.slug)
        const challenges = ChallengeMapper.toDomainList(challengeDTOs)
        challengesMap.set(moduleDto.id, challenges)
      })
    )

    return ModuleMapper.toDomainList(moduleDTOs, challengesMap)
  }

  async findBySlugWithChallenges(slug: string): Promise<Module | null> {
    try {
      const [moduleDto, challengeDTOs] = await Promise.all([
        this.service.getModuleDetails(slug),
        this.service.getModuleChallenges(slug),
      ])

      const challenges = ChallengeMapper.toDomainList(challengeDTOs)
      return ModuleMapper.toDomain(moduleDto, challenges)
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return null
      }
      throw error
    }
  }
}
