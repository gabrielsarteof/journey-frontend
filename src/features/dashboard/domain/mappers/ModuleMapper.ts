import { Module } from '../entities/Module'
import { Category } from '../value-objects/Category'
import { Unit } from '../entities/Unit'
import type { ModuleWithProgressDTO } from '../types/module.types'

/**
 * ModuleMapper
 *
 * Converte DTOs da API para entidades de domínio Module
 * Refatorado para usar Units na hierarquia correta: Module → Unit → Level → Challenge
 */

export class ModuleMapper {
  static toDomain(dto: ModuleWithProgressDTO, units: Unit[] = []): Module {
    return Module.create({
      id: dto.id,
      orderIndex: dto.orderIndex,
      category: Category.create(dto.slug.toUpperCase()),
      units,
      isLocked: dto.isLocked || dto.progress?.status === 'LOCKED',
    })
  }

  static toDomainList(
    modules: ModuleWithProgressDTO[],
    unitsByModule: Map<string, Unit[]>
  ): Module[] {
    return modules.map(module =>
      this.toDomain(module, unitsByModule.get(module.id) || [])
    )
  }
}
