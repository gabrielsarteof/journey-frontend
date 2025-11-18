import { Unit } from '../entities/Unit'
import { UnitStatus } from '../value-objects/UnitStatus'
import { Level } from '../entities/Level'
import type { UnitDTO, UnitDetailsDTO } from '../types/unit.types'

/**
 * UnitMapper
 *
 * Converte DTOs da API para entidades de domínio Unit
 */

export class UnitMapper {
  /**
   * Converte um UnitDTO para entidade Unit
   */
  static toDomain(dto: UnitDTO | UnitDetailsDTO, levels: Level[] = []): Unit {
    return Unit.create({
      id: dto.id,
      title: dto.title,
      description: dto.description,
      orderIndex: dto.orderIndex,
      status: this.mapStatus(dto),
      levels,
      learningObjectives: dto.learningObjectives || [],
      estimatedMinutes: dto.estimatedMinutes || 0,
      theoryContent: dto.theoryContent || '',
      resources: dto.resources || { articles: [], videos: [] },
      requiredScore: dto.requiredScore || 60
    })
  }

  /**
   * Converte uma lista de UnitDTOs para entidades Unit
   */
  static toDomainList(dtos: UnitDTO[], levelsByUnit: Map<string, Level[]> = new Map()): Unit[] {
    return dtos.map(dto =>
      this.toDomain(dto, levelsByUnit.get(dto.id) || [])
    )
  }

  /**
   * Mapeia o status do DTO considerando isLocked e progress.status
   */
  private static mapStatus(dto: UnitDTO | UnitDetailsDTO): UnitStatus {
    // Se está bloqueado no backend, sempre LOCKED
    if (dto.isLocked) {
      return UnitStatus.locked()
    }

    // Se tem progresso, usa o status do progresso
    if (dto.progress?.status) {
      return UnitStatus.create(dto.progress.status)
    }

    // Se não está bloqueado e não tem progresso, está AVAILABLE
    return UnitStatus.available()
  }
}
