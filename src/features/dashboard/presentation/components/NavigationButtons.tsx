import { Link, useLocation } from '@tanstack/react-router'
import {
  HomeIcon,
  TrophyIcon,
  StarIcon,
  UserIcon
} from './icons'

export function NavigationButtons() {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Learn' },
    { path: '/leaderboard', icon: TrophyIcon, label: 'Leaderboard' },
    { path: '/quests', icon: StarIcon, label: 'Quests' },
    { path: '/profile', icon: UserIcon, label: 'Profile' },
  ]

  return (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        const Icon = item.icon

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center gap-4 p-3 rounded-xl transition-colors
              ${isActive
                ? 'bg-duoGrayBorder border-2 border-duoBlue'
                : 'hover:bg-duoGrayBorder'
              }
            `}
          >
            <Icon className={isActive ? 'text-duoBlue' : 'text-duoGrayText'} />
            <p className={`hidden lg:flex text-xl ${isActive ? 'text-duoBlue' : 'text-white'}`}>
              {item.label}
            </p>
          </Link>
        )
      })}
    </>
  )
}
