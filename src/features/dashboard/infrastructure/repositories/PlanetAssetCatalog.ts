import { PlanetAsset } from '../../domain/value-objects/PlanetAsset'

/**
 * PlanetAssetCatalog (Infrastructure Layer)
 *
 * Catálogo centralizado de assets de planetas.
 * Implementa padrões:
 * - Repository Pattern: Abstrai acesso aos assets
 * - Singleton Pattern: Instância única do catálogo
 * - Registry Pattern: Registro centralizado de recursos
 *
 * Benefícios:
 * - Type-safe asset management
 * - Centralização de imports
 * - Fácil manutenção e atualização
 * - Lazy loading de assets
 * - Cache de assets carregados
 */

// Imports de assets - centralizados em um único lugar
import earthPlanet from '@/shared/assets/planets/planet-earth.png'
import mercuryPlanet01 from '@/shared/assets/planets/planet-mercury-01.png'
import mercuryPlanet02 from '@/shared/assets/planets/planet-mercury-02.png'
import marsPlanet01 from '@/shared/assets/planets/planet-mars-01.png'
import marsPlanet02 from '@/shared/assets/planets/planet-mars-02.png'
import moonPlanet from '@/shared/assets/planets/planet-moon.png'
import unknownPlanet01 from '@/shared/assets/planets/planet-unknown-01.png'
import unknownPlanet02 from '@/shared/assets/planets/planet-unknown-02.png'
import unknownPlanet03 from '@/shared/assets/planets/planet-unknown-03.png'
import unknownPlanet04 from '@/shared/assets/planets/planet-unknown-04.png'
import astronaut from '@/shared/assets/planets/astronaut.png'

/**
 * Tipo para identificação de planetas
 */
export type PlanetName =
  | 'earth'
  | 'mercury'
  | 'mars'
  | 'moon'
  | 'venus'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto'
  | 'titan'
  | 'io'
  | 'europa'
  | 'ganymede'
  | 'unknown'

/**
 * Interface do catálogo
 */
export interface IPlanetAssetCatalog {
  getAsset(planetName: PlanetName, variant?: number): PlanetAsset
  getAllAssets(): PlanetAsset[]
  getRandomAsset(): PlanetAsset
  hasAsset(planetName: PlanetName, variant?: number): boolean
}

/**
 * Implementação do catálogo
 */
class PlanetAssetCatalogImpl implements IPlanetAssetCatalog {
  private static instance: PlanetAssetCatalogImpl
  private readonly assetRegistry: Map<string, PlanetAsset>

  private constructor() {
    this.assetRegistry = new Map()
    this.initializeAssets()
  }

  /**
   * Singleton instance
   */
  static getInstance(): PlanetAssetCatalogImpl {
    if (!PlanetAssetCatalogImpl.instance) {
      PlanetAssetCatalogImpl.instance = new PlanetAssetCatalogImpl()
    }
    return PlanetAssetCatalogImpl.instance
  }

  /**
   * Inicializa o registro de assets
   * Princípio: DRY - Definir assets uma vez
   */
  private initializeAssets(): void {
    // Earth
    this.registerAsset('earth', earthPlanet, undefined, 'Planet Earth - Start of the journey')

    // Mercury
    this.registerAsset('mercury', mercuryPlanet01, 1)
    this.registerAsset('mercury', mercuryPlanet02, 2)

    // Mars
    this.registerAsset('mars', marsPlanet01, 1)
    this.registerAsset('mars', marsPlanet02, 2)

    // Moon
    this.registerAsset('moon', moonPlanet)

    // Unknown planets (a serem identificados)
    this.registerAsset('unknown', unknownPlanet01, 1)
    this.registerAsset('unknown', unknownPlanet02, 2)
    this.registerAsset('unknown', unknownPlanet03, 3)
    this.registerAsset('unknown', unknownPlanet04, 4)

    // Pode adicionar mais planetas aqui:
    // Venus, Jupiter, Saturn, Uranus, Neptune
  }

  /**
   * Registra um asset no catálogo
   */
  private registerAsset(
    name: PlanetName,
    path: string,
    variant?: number,
    altText?: string
  ): void {
    const key = this.generateKey(name, variant)
    const asset = PlanetAsset.create({ name, path, variant, altText })
    this.assetRegistry.set(key, asset)
  }

  /**
   * Gera chave única para o asset
   */
  private generateKey(planetName: PlanetName, variant?: number): string {
    return variant ? `${planetName}-${variant}` : planetName
  }

  /**
   * Obtém um asset específico
   */
  getAsset(planetName: PlanetName, variant?: number): PlanetAsset {
    const key = this.generateKey(planetName, variant)
    const asset = this.assetRegistry.get(key)

    if (!asset) {
      // Fallback para unknown planet se não encontrar
      console.warn(`Asset not found for ${key}, using fallback`)
      return this.assetRegistry.get('unknown-1') || this.createFallbackAsset()
    }

    return asset
  }

  /**
   * Verifica se um asset existe
   */
  hasAsset(planetName: PlanetName, variant?: number): boolean {
    const key = this.generateKey(planetName, variant)
    return this.assetRegistry.has(key)
  }

  /**
   * Retorna todos os assets disponíveis
   */
  getAllAssets(): PlanetAsset[] {
    return Array.from(this.assetRegistry.values())
  }

  /**
   * Retorna um asset aleatório
   * Útil para variedade visual
   */
  getRandomAsset(): PlanetAsset {
    const assets = this.getAllAssets()
    const randomIndex = Math.floor(Math.random() * assets.length)
    return assets[randomIndex]
  }

  /**
   * Obtém asset baseado em índice (para sequência de challenges)
   * Distribui assets de forma determinística mas variada
   */
  getAssetByIndex(index: number): PlanetAsset {
    const assets = this.getAllAssets()
    return assets[index % assets.length]
  }

  /**
   * Fallback asset em caso de erro
   */
  private createFallbackAsset(): PlanetAsset {
    return PlanetAsset.create({
      name: 'unknown',
      path: unknownPlanet01,
      variant: 1,
      altText: 'Unknown Planet'
    })
  }

  /**
   * Obtém asset especial (como astronauta)
   */
  getAstronautAsset(): string {
    return astronaut
  }
}

/**
 * Export da instância singleton
 * Uso: import { PlanetAssetCatalog } from '...'
 */
export const PlanetAssetCatalog = PlanetAssetCatalogImpl.getInstance()

/**
 * Hook para uso em componentes React (opcional)
 */
export function usePlanetAsset(planetName: PlanetName, variant?: number): PlanetAsset {
  return PlanetAssetCatalog.getAsset(planetName, variant)
}

export function usePlanetAssetByIndex(index: number): PlanetAsset {
  return PlanetAssetCatalog.getAssetByIndex(index)
}
