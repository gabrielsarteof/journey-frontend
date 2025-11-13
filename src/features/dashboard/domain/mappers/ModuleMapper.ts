import { Module } from '../entities/Module'
import { Category } from '../value-objects/Category'
import { ModuleTheme } from '../value-objects/ModuleTheme'
import { Challenge } from '../entities/Challenge'
import type { ModuleWithProgressDTO } from '../types/module.types'

export class ModuleMapper {
  static toDomain(dto: ModuleWithProgressDTO, challenges: Challenge[]): Module {
    return Module.create({
      id: dto.id,
      orderIndex: dto.orderIndex,
      category: Category.create(dto.slug.toUpperCase()),
      theme: ModuleTheme.create({
        color: dto.theme.color,
        gradient: dto.theme.gradient
      }),
      challenges,
      isLocked: dto.isLocked || dto.progress?.status === 'LOCKED',
    })
  }

  static toDomainList(
    modules: ModuleWithProgressDTO[],
    challengesByModule: Map<string, Challenge[]>
  ): Module[] {
    return modules.map(module =>
      this.toDomain(module, challengesByModule.get(module.id) || [])
    )
  }
}
