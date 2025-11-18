import { Level } from '../entities/Level'
import { LevelType } from '../value-objects/LevelType'
import { LevelStatus } from '../value-objects/LevelStatus'
import { PlanetAsset } from '../value-objects/PlanetAsset'
import { Challenge } from '../entities/Challenge'
import { PlanetAssetCatalog, type AssetId } from '../../infrastructure/repositories/PlanetAssetCatalog'
import type { LevelDTO, LevelDetailsDTO } from '../types/level.types'

/**
 * LevelMapper
 *
 * Converte DTOs da API para entidades de domínio Level
 */

export class LevelMapper {
  /**
   * Converte um LevelDTO para entidade Level
   */
  static toDomain(dto: LevelDTO | LevelDetailsDTO, challenges: Challenge[] = []): Level {
    const assetId = this.resolveAssetId(dto.assetId)

    return Level.create({
      id: dto.id,
      title: dto.title,
      type: LevelType.create(dto.type),
      status: this.mapStatus(dto),
      planetAsset: this.resolvePlanetAsset(assetId),
      orderIndex: dto.orderIndex,
      challenges,
      score: dto.progress?.score ?? 0,
      timeSpent: dto.progress?.timeSpent ?? 0,
      completedAt: dto.progress?.completedAt ? new Date(dto.progress.completedAt) : undefined
    })
  }

  /**
   * Converte uma lista de LevelDTOs para entidades Level
   */
  static toDomainList(dtos: LevelDTO[], challengesByLevel: Map<string, Challenge[]> = new Map()): Level[] {
    return dtos.map(dto =>
      this.toDomain(dto, challengesByLevel.get(dto.id) || [])
    )
  }

  /**
   * Mapeia o status do DTO considerando isLocked e progress.status
   */
  private static mapStatus(dto: LevelDTO | LevelDetailsDTO): LevelStatus {
    // Se está bloqueado no backend, sempre LOCKED
    if (dto.isLocked) {
      return LevelStatus.locked()
    }

    // Se tem progresso, usa o status do progresso
    if (dto.progress?.status) {
      return LevelStatus.create(dto.progress.status)
    }

    // Se não está bloqueado e não tem progresso, está AVAILABLE
    return LevelStatus.available()
  }

  /**
   * Resolve o assetId para um AssetId válido
   */
  private static resolveAssetId(assetId?: string | null): AssetId {
    if (!assetId || !this.isValidAssetId(assetId)) {
      // Retorna asset padrão se não houver um válido
      return 'planet-01'
    }
    return assetId as AssetId
  }

  /**
   * Valida se o assetId está no formato correto
   */
  private static isValidAssetId(assetId: string): boolean {
    return /^planet-(0[1-9]|10)$/.test(assetId)
  }

  /**
   * Resolve o PlanetAsset do catálogo
   */
  private static resolvePlanetAsset(assetId: AssetId): PlanetAsset {
    return PlanetAssetCatalog.getAsset(assetId)
  }
}
