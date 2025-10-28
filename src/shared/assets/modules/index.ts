export type ModuleIconName =
  | 'backend'
  | 'frontend'
  | 'devops'
  | 'mobile'
  | 'data'

interface ModuleIconMap {
  [key: string]: string
}

export const moduleIcons: ModuleIconMap = {}

export function getModuleIcon(iconName: string): string {
  const icon = moduleIcons[iconName]

  if (!icon) {
    console.warn(`Module icon not found: ${iconName}, using fallback`)
    return moduleIcons['backend'] || ''
  }

  return icon
}

export function hasModuleIcon(iconName: string): boolean {
  return iconName in moduleIcons
}
