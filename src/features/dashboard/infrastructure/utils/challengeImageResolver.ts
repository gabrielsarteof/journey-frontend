import { PlanetAssetCatalog, type AssetId } from '../repositories/PlanetAssetCatalog'

export interface ChallengeVisuals {
  image: string
  color?: string
  altText: string
}

export interface ChallengeWithAsset {
  assetId?: string | null
  visualTheme?: {
    color?: string
  }
  title: string
}

export function resolvePlanetImage(challenge: ChallengeWithAsset): string {
  if (!challenge.assetId) {
    console.warn(`No assetId for challenge: ${challenge.title}, using fallback`)
    return PlanetAssetCatalog.getAsset('planet-01').path
  }

  return PlanetAssetCatalog.getAsset(challenge.assetId as AssetId).path
}

export function resolvePlanetColor(challenge: ChallengeWithAsset): string | undefined {
  return challenge.visualTheme?.color
}

export function getChallengeVisuals(challenge: ChallengeWithAsset): ChallengeVisuals {
  const image = resolvePlanetImage(challenge)
  const color = resolvePlanetColor(challenge)

  return {
    image,
    color,
    altText: `${challenge.title} planet`
  }
}
