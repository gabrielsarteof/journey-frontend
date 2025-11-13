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
  themeColor: string
  themeGradient?: string[]
  isSticky?: boolean
}

const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  backend: BackendIcon,
  frontend: FrontendIcon,
  devops: DevOpsIcon,
  mobile: MobileIcon,
  data: DataIcon,
  fullstack: FullStackIcon
}

export function UnitBanner({
  unitNumber,
  title,
  description,
  moduleSlug,
  themeColor,
  themeGradient,
  isSticky = false
}: UnitBannerProps) {
  const [isActive, setIsActive] = useState(false)
  const IconComponent = moduleIcons[moduleSlug] || BackendIcon

  const backgroundStyle = themeGradient && themeGradient.length > 0
    ? { background: `linear-gradient(135deg, ${themeGradient.join(', ')})` }
    : { backgroundColor: themeColor }

  return (
    <div
      className={`
        w-full overflow-hidden cursor-pointer hover:brightness-110
        focus:outline-none focus-visible:outline-none
        ${isSticky ? 'sticky top-0 lg:top-0 z-30 rounded-none shadow-lg' : 'max-w-xl rounded-2xl'}
      `}
      style={{
        ...backgroundStyle,
        transition: 'all 0.3s ease',
        transform: isActive && !isSticky ? 'translateY(8px)' : 'translateY(0)'
      }}
      onMouseDown={() => !isSticky && setIsActive(true)}
      onMouseUp={() => !isSticky && setIsActive(false)}
      onMouseLeave={() => !isSticky && setIsActive(false)}
    >
      <div className={`flex items-center px-4 lg:px-6 ${isSticky ? 'h-16 lg:h-20' : 'h-28'}`}>
        <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
          {isSticky && (
            <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 flex-shrink-0">
              <IconComponent className="w-6 h-6 lg:w-7 lg:h-7 text-primary-button" />
            </div>
          )}
          <div className="flex-1">
            <p className={`font-bold uppercase tracking-wider text-primary-button opacity-60 ${isSticky ? 'text-xs lg:text-sm mb-0 truncate' : 'text-md mb-1'}`}>
              SEÇÃO {unitNumber} • {description || title}
            </p>
            <p className={`font-bold text-primary-button ${isSticky ? 'text-base lg:text-xl truncate' : 'text-2xl'}`}>
              {title}
            </p>
          </div>
        </div>
        {!isSticky && (
          <div className="flex items-center justify-center w-20 h-20 border-l-2 border-white/20">
            <IconComponent className="w-12 h-12 text-primary-button opacity-90" />
          </div>
        )}
      </div>
    </div>
  )
}