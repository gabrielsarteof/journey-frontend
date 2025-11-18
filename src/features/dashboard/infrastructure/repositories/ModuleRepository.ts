import { Module } from '../../domain/entities/Module'
import { ModuleService } from '../services/ModuleService'
import { UnitRepository } from './UnitRepository'
import { ModuleMapper } from '../../domain/mappers/ModuleMapper'

/**
 * ModuleRepository
 *
 * Repositório para operações com Modules
 * Refatorado para buscar Units com a hierarquia completa: Module → Unit → Level → Challenge
 */

export interface ModuleRepositoryInterface {
  findAllWithProgress(): Promise<Module[]>
  findBySlug(slug: string): Promise<Module | null>
}

export class ModuleRepository implements ModuleRepositoryInterface {
  constructor(
    private readonly moduleService: ModuleService,
    private readonly unitRepository: UnitRepository
  ) {}

  /**
   * Busca todos os módulos com progresso e suas units completas
   */
  async findAllWithProgress(): Promise<Module[]> {
    const moduleDTOs = await this.moduleService.getModulesWithProgress()

    const unitsByModule = new Map()

    // Busca units (com levels) para cada módulo em paralelo
    await Promise.all(
      moduleDTOs.map(async (moduleDto) => {
        const units = await this.unitRepository.findByModuleId(moduleDto.id)
        unitsByModule.set(moduleDto.id, units)
      })
    )

    return ModuleMapper.toDomainList(moduleDTOs, unitsByModule)
  }

  /**
   * Busca um módulo pelo slug com todas as units e levels
   */
  async findBySlug(slug: string): Promise<Module | null> {
    try {
      const moduleDto = await this.moduleService.getModuleDetails(slug)
      const units = await this.unitRepository.findByModuleId(moduleDto.id)

      return ModuleMapper.toDomain(moduleDto, units)
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return null
      }
      throw error
    }
  }
}
