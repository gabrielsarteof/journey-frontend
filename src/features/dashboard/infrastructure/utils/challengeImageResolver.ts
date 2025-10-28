import { PlanetAssetCatalog, type PlanetName } from '../repositories/PlanetAssetCatalog'
import type { PlanetAsset } from '../../domain/value-objects/PlanetAsset'

export interface ChallengeVisuals {
  image: string
  color?: string
  altText: string
}

export interface ChallengeWithPlanetImage {
  planetImage?: string
  visualTheme?: {
    color?: string
  }
  title: string
}

export function resolvePlanetImage(challenge: ChallengeWithPlanetImage): string {
  if (!challenge.planetImage) {
    console.warn(`No planetImage for challenge: ${challenge.title}, using fallback`)
    return PlanetAssetCatalog.getAsset('unknown', 1).path
  }

  const planetName = challenge.planetImage
    .replace('.png', '')
    .replace('.jpg', '')
    .replace('-01', '')
    .replace('-02', '')
    .replace('-03', '')
    .replace('-04', '') as PlanetName

  const variantMatch = challenge.planetImage.match(/-0?(\d)/)
  const variant = variantMatch ? parseInt(variantMatch[1], 10) : undefined

  return PlanetAssetCatalog.getAsset(planetName, variant).path
}

export function resolvePlanetColor(challenge: ChallengeWithPlanetImage): string | undefined {
  return challenge.visualTheme?.color
}

export function getChallengeVisuals(challenge: ChallengeWithPlanetImage): ChallengeVisuals {
  const image = resolvePlanetImage(challenge)
  const color = resolvePlanetColor(challenge)

  return {
    image,
    color,
    altText: `${challenge.title} planet`
  }
}
