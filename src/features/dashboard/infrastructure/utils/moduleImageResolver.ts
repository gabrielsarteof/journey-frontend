import { getModuleIcon } from '@/shared/assets/modules'
import type { ModuleWithProgressDTO } from '../../domain/types/module.types'

export interface ModuleVisuals {
  icon: string
  color: string
  gradient?: string
  altText: string
}

export function resolveModuleIcon(iconImage: string): string {
  if (!iconImage) {
    console.warn('Module iconImage not provided, using fallback')
    return getModuleIcon('backend')
  }

  const iconName = iconImage.replace('.png', '').replace('.jpg', '').replace('.svg', '')

  return getModuleIcon(iconName)
}

export function getModuleVisuals(module: ModuleWithProgressDTO): ModuleVisuals {
  const icon = resolveModuleIcon(module.iconImage)
  const color = module.theme.color
  const gradient = module.theme.gradient
    ? `linear-gradient(135deg, ${module.theme.gradient.join(', ')})`
    : undefined

  return {
    icon,
    color,
    gradient,
    altText: `${module.title} icon`
  }
}
