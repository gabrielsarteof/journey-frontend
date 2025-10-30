import { Link, useLocation } from '@tanstack/react-router'
import {
  HomeIcon,
  TargetIcon,
  FlagIcon,
  TrophyIcon,
  MenuIcon
} from '@/shared/assets/icons'

interface NavigationButtonsProps {
  variant?: 'desktop' | 'mobile'
}

export function NavigationButtons({ variant = 'desktop' }: NavigationButtonsProps) {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'APRENDER' },
    { path: '/metrics', icon: TargetIcon, label: 'MÉTRICAS' },
    { path: '/quests', icon: FlagIcon, label: 'MISSÕES' },
    { path: '/certificates', icon: TrophyIcon, label: 'CERTIFICADOS' },
    { path: '/profile', icon: MenuIcon, label: 'CONFIGURAÇÕES' },
  ]

  if (variant === 'mobile') {
    return (
      <div className="w-full grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center py-2"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-primary' : 'text-primary'
                }`}
              />
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        const Icon = item.icon

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center gap-4 px-4 py-3 rounded-md transition-all
              ${isActive
                ? 'bg-surface-elevated'
                : 'hover:bg-surface-hover'
              }
            `}
          >
            <Icon className={`w-auto h-6 transition-colors ${isActive ? 'text-primary' : 'text-primary'}`} />
            <p className={`text-sm font-bold uppercase tracking-wide transition-colors ${isActive ? 'text-primary' : 'text-primary'}`}>
              {item.label}
            </p>
          </Link>
        )
      })}
    </div>
  )
}