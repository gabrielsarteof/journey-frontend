/**
 * PlanetAssetCatalog (Infrastructure Layer)
 *
 * Catálogo centralizado de assets de planetas usando IDs abstratos.
 * Implementa padrões:
 * - Repository Pattern: Abstrai acesso aos assets
 * - Singleton Pattern: Instância única do catálogo
 * - Registry Pattern: Registro centralizado de recursos
 * - Design Tokens Pattern: Nomes abstratos desacoplados do conteúdo
 *
 * Benefícios:
 * - Flexibilidade total para trocar imagens sem refatoração
 * - IDs abstratos não acoplam ao conteúdo visual
 * - Metadata descritiva separada dos identificadores
 * - Type-safe asset management
 * - Centralização de imports
 * - Fácil manutenção e atualização
 */

/**
 * Tipo para identificação abstrata de assets
 * IDs numéricos não vinculados ao conteúdo visual
 */
export type AssetId =
  | 'planet-01'
  | 'planet-02'
  | 'planet-03'
  | 'planet-04'
  | 'planet-05'
  | 'planet-06'
  | 'planet-07'
  | 'planet-08'
  | 'planet-09'
  | 'planet-10'

import { PlanetAsset } from '../../domain/value-objects/PlanetAsset'
import planet01 from '@/shared/assets/planets/planet-01.png'
import planet02 from '@/shared/assets/planets/planet-02.png'
import planet03 from '@/shared/assets/planets/planet-03.png'
import planet04 from '@/shared/assets/planets/planet-04.png'
import planet05 from '@/shared/assets/planets/planet-05.png'
import planet06 from '@/shared/assets/planets/planet-06.png'
import planet07 from '@/shared/assets/planets/planet-07.png'
import planet08 from '@/shared/assets/planets/planet-08.png'
import planet09 from '@/shared/assets/planets/planet-09.png'
import planet10 from '@/shared/assets/planets/planet-10.png'
import astronaut from '@/shared/assets/planets/astronaut.png'

/**
 * Metadata descritiva para cada asset
 * Separada do identificador para máxima flexibilidade
 */
interface AssetMetadata {
  description: string
  tags: string[]
  suggestedFor?: 'beginner' | 'intermediate' | 'advanced'
}

/**
 * Interface do catálogo
 */
export interface IPlanetAssetCatalog {
  getAsset(assetId: AssetId): PlanetAsset
  getAllAssets(): PlanetAsset[]
  getRandomAsset(): PlanetAsset
  hasAsset(assetId: AssetId): boolean
  getMetadata(assetId: AssetId): AssetMetadata | undefined
}

/**
 * Implementação do catálogo
 */
class PlanetAssetCatalogImpl implements IPlanetAssetCatalog {
  private static instance: PlanetAssetCatalogImpl
  private readonly assetRegistry: Map<AssetId, PlanetAsset>
  private readonly metadataRegistry: Map<AssetId, AssetMetadata>

  private constructor() {
    this.assetRegistry = new Map()
    this.metadataRegistry = new Map()
    this.initializeAssets()
  }

  static getInstance(): PlanetAssetCatalogImpl {
    if (!PlanetAssetCatalogImpl.instance) {
      PlanetAssetCatalogImpl.instance = new PlanetAssetCatalogImpl()
    }
    return PlanetAssetCatalogImpl.instance
  }

  private initializeAssets(): void {
    this.registerAsset('planet-01', planet01, {
      description: 'Small red rocky planet',
      tags: ['red', 'small', 'rocky'],
      suggestedFor: 'beginner'
    })

    this.registerAsset('planet-02', planet02, {
      description: 'Red planet with craters',
      tags: ['red', 'craters', 'medium'],
      suggestedFor: 'beginner'
    })

    this.registerAsset('planet-03', planet03, {
      description: 'Large red planet',
      tags: ['red', 'large'],
      suggestedFor: 'intermediate'
    })

    this.registerAsset('planet-04', planet04, {
      description: 'Small gray moon',
      tags: ['gray', 'small', 'moon'],
      suggestedFor: 'beginner'
    })

    this.registerAsset('planet-05', planet05, {
      description: 'Purple unknown planet',
      tags: ['purple', 'mysterious'],
      suggestedFor: 'intermediate'
    })

    this.registerAsset('planet-06', planet06, {
      description: 'Blue gas planet',
      tags: ['blue', 'gas-giant'],
      suggestedFor: 'advanced'
    })

    this.registerAsset('planet-07', planet07, {
      description: 'Orange planet',
      tags: ['orange', 'medium'],
      suggestedFor: 'intermediate'
    })

    this.registerAsset('planet-08', planet08, {
      description: 'Green mysterious planet',
      tags: ['green', 'mysterious'],
      suggestedFor: 'advanced'
    })

    this.registerAsset('planet-09', planet09, {
      description: 'Small purple planet',
      tags: ['purple', 'small'],
      suggestedFor: 'beginner'
    })

    this.registerAsset('planet-10', planet10, {
      description: 'Large mysterious planet',
      tags: ['mysterious', 'large'],
      suggestedFor: 'advanced'
    })
  }

  private registerAsset(
    id: AssetId,
    path: string,
    metadata: AssetMetadata
  ): void {
    const asset = PlanetAsset.create({
      name: id,
      path,
      altText: metadata.description
    })
    this.assetRegistry.set(id, asset)
    this.metadataRegistry.set(id, metadata)
  }

  getAsset(assetId: AssetId): PlanetAsset {
    const asset = this.assetRegistry.get(assetId)

    if (!asset) {
      console.warn(`Asset not found for ${assetId}, using fallback`)
      return this.assetRegistry.get('planet-01') || this.createFallbackAsset()
    }

    return asset
  }

  hasAsset(assetId: AssetId): boolean {
    return this.assetRegistry.has(assetId)
  }

  getAllAssets(): PlanetAsset[] {
    return Array.from(this.assetRegistry.values())
  }

  getRandomAsset(): PlanetAsset {
    const assets = this.getAllAssets()
    const randomIndex = Math.floor(Math.random() * assets.length)
    return assets[randomIndex]
  }

  getMetadata(assetId: AssetId): AssetMetadata | undefined {
    return this.metadataRegistry.get(assetId)
  }

  getAssetByIndex(index: number): PlanetAsset {
    const assets = this.getAllAssets()
    return assets[index % assets.length]
  }

  private createFallbackAsset(): PlanetAsset {
    return PlanetAsset.create({
      name: 'planet-01',
      path: planet01,
      altText: 'Unknown Planet'
    })
  }

  getAstronautAsset(): string {
    return astronaut
  }
}

export const PlanetAssetCatalog = PlanetAssetCatalogImpl.getInstance()

export function usePlanetAsset(assetId: AssetId): PlanetAsset {
  return PlanetAssetCatalog.getAsset(assetId)
}

export function usePlanetAssetByIndex(index: number): PlanetAsset {
  return PlanetAssetCatalog.getAssetByIndex(index)
}
