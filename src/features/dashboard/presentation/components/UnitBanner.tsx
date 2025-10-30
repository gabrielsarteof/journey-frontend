import { useState } from 'react'
import {
  BackendIcon,
  FrontendIcon,
  DevOpsIcon,
  MobileIcon,
  DataIcon,
  FullStackIcon
} from '@/shared/assets/icons/modules'

interface UnitBannerProps {
  unitNumber: number
  title: string
  description?: string
  moduleSlug: string
}

const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  backend: BackendIcon,
  frontend: FrontendIcon,
  devops: DevOpsIcon,
  mobile: MobileIcon,
  data: DataIcon,
  fullstack: FullStackIcon
}

export function UnitBanner({ unitNumber, title, description, moduleSlug }: UnitBannerProps) {
  const [isActive, setIsActive] = useState(false)
  const IconComponent = moduleIcons[moduleSlug] || BackendIcon

  return (
    <div
      className={`w-full max-w-2xl rounded-2xl overflow-hidden cursor-pointer hover:brightness-110 focus:outline-none focus-visible:outline-none module-${moduleSlug} ${isActive ? 'module-active' : ''}`}
      style={{ transition: 'all 0.2s ease' }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
    >
      <div className="flex items-center h-28 px-6">
        <div className="flex-1">
          <p className="text-sm font-bold uppercase tracking-wider mb-1 text-primary opacity-80">
            MÓDULO {unitNumber}
          </p>
          <p className="text-2xl font-bold text-primary mb-1">
            {title}
          </p>
          {description && (
            <p className="text-sm text-primary opacity-70 font-medium">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center w-20 h-20 border-l-2 border-white/20">
          <IconComponent className="w-12 h-12 text-primary opacity-90" />
        </div>
      </div>
    </div>
  )
}