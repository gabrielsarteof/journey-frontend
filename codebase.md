# src\features\dashboard\presentation\components\DashboardFooter.tsx

```tsx
import { NavigationButtons } from './NavigationButtons'

export function DashboardFooter() {
  return (
    <footer className="lg:hidden fixed bottom-0 left-0 right-0 h-20 border-t border-t-duoGrayBorder bg-duoBackground px-6">
      <div className="w-full h-full flex items-center justify-between">
        <NavigationButtons />
      </div>
    </footer>
  )
}

```

# src\features\dashboard\presentation\components\DashboardLeftSidebar.tsx

```tsx
import { NavigationButtons } from './NavigationButtons'

export function DashboardLeftSidebar() {
  return (
    <aside className="hidden border-r border-duoGrayBorder lg:flex flex-col bg-duoBackground xl:w-80 lg:w-60 2xl:w-85">
      <div className="flex p-6 gap-4 sticky top-0 flex-col w-full">
        <NavigationButtons />
      </div>
    </aside>
  )
}

```

# src\features\dashboard\presentation\components\DashboardRightSidebar.tsx

```tsx
import { UserStats } from './UserStats'
import { QuestsWidget } from './QuestsWidget'

export function DashboardRightSidebar() {
  return (
    <aside className="hidden border-l border-duoGrayBorder lg:flex flex-col bg-duoBackground w-90 xl:w-110 2xl:w-180">
      <div className="flex py-6 px-8 gap-8 sticky top-0 flex-col w-full">
        <div className="w-full flex justify-between">
          <UserStats />
        </div>
        <div className="rounded-2xl border-2 border-duoGrayBorder bg-duoDarkGray">
          <div className="p-4 border-b-2 border-duoGrayBorder">
            <h3 className="text-white font-bold text-lg">Daily Quests</h3>
          </div>
          <div className="pl-4 pr-6">
            <QuestsWidget />
          </div>
        </div>
      </div>
    </aside>
  )
}

```

# src\features\dashboard\presentation\components\icons\index.tsx

```tsx
interface IconProps {
  className?: string
}

interface FlagIconProps {
  flag: string
}

export function HomeIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  )
}

export function TrophyIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 3h12c1.1 0 2 .9 2 2v2c0 1.66-1.34 3-3 3h-.09c-.5 2.24-2.23 4-4.41 4.34V16h2c.55 0 1 .45 1 1v2h-8v-2c0-.55.45-1 1-1h2v-1.66C6.32 14 4.5 12.24 4 10H3.5C2.34 10 1 9.66 1 7V5c0-1.1.9-2 2-2h3z"/>
    </svg>
  )
}

export function StarIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 7h-5V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 4h6v3H9V4zm9 16H6v-9h12v9z"/>
    </svg>
  )
}

export function UserIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
    </svg>
  )
}

export function FlameIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
    </svg>
  )
}

export function GemIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5L2 9l10 12L22 9l-3-6zM9.62 8l1.5-3h1.76l1.5 3h-4.76zM11 10v6.68L5.44 10H11zm2 0h5.56L13 16.68V10z"/>
    </svg>
  )
}

export function HeartIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}

export function FlagIcon({ flag }: FlagIconProps) {
  return (
    <div className="h-8 w-8 rounded-full bg-duoGrayBorder flex items-center justify-center text-2xl">
      {flag}
    </div>
  )
}

```

# src\features\dashboard\presentation\components\LessonButton.tsx

```tsx
interface Lesson {
  id: number
  title: string
  type: 'lesson' | 'practice' | 'story' | 'review'
  status: 'locked' | 'available' | 'completed'
}

interface LessonButtonProps {
  lesson: Lesson
  color: string
  index: number
}

export function LessonButton({ lesson, color, index }: LessonButtonProps) {
  const getIcon = () => {
    switch (lesson.type) {
      case 'story':
        return '📖'
      case 'practice':
        return '💪'
      case 'review':
        return '👑'
      default:
        return '⭐'
    }
  }

  const getButtonStyle = () => {
    if (lesson.status === 'locked') {
      return {
        bg: 'bg-duoGrayLocked',
        shadow: 'shadow-duoGrayLockedCircleShadow',
        text: 'text-duoGrayText',
        cursor: 'cursor-not-allowed',
      }
    }

    if (lesson.status === 'completed') {
      return {
        bg: 'bg-duoGold',
        shadow: 'shadow-duoGreenCircleShadow',
        text: 'text-white',
        cursor: 'cursor-pointer hover:brightness-110',
      }
    }

    return {
      bg: lesson.type === 'review' ? 'bg-duoPink' : 'bg-duoGreen',
      shadow: lesson.type === 'review' ? 'shadow-duoPinkCircleShadow' : 'shadow-duoGreenCircleShadow',
      text: 'text-white',
      cursor: 'cursor-pointer hover:brightness-110',
    }
  }

  const style = getButtonStyle()

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        disabled={lesson.status === 'locked'}
        className={`
          w-20 h-20 rounded-full ${style.bg} ${style.shadow} ${style.cursor}
          flex items-center justify-center text-3xl
          transition-all duration-200
          border-b-8 border-opacity-50
          ${lesson.status === 'locked' ? '' : 'hover:scale-105 active:scale-95'}
        `}
        style={{
          backgroundColor: lesson.status === 'available' && lesson.type === 'lesson' ? color : undefined
        }}
      >
        {lesson.status === 'locked' ? '🔒' : getIcon()}
      </button>

      <p className={`text-sm font-bold ${style.text}`}>
        {lesson.title}
      </p>

      {lesson.status === 'completed' && (
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-duoGold" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs text-duoGold font-bold">3/3</span>
        </div>
      )}
    </div>
  )
}

```

# src\features\dashboard\presentation\components\NavigationButtons.tsx

```tsx
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

```

# src\features\dashboard\presentation\components\QuestsWidget.tsx

```tsx
// Dados estáticos de quests mockadas
const mockQuests = [
  { id: 1, title: 'Complete 3 lessons', progress: 2, total: 3, reward: 50 },
  { id: 2, title: 'Practice for 10 minutes', progress: 7, total: 10, reward: 20 },
  { id: 3, title: 'Get 100% on a lesson', progress: 0, total: 1, reward: 100 },
]

export function QuestsWidget() {
  return (
    <div className="py-4 space-y-4">
      {mockQuests.map((quest) => {
        const progressPercent = (quest.progress / quest.total) * 100

        return (
          <div key={quest.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-white text-sm">{quest.title}</p>
              <div className="flex items-center gap-1">
                <span className="text-duoGold text-sm">+{quest.reward}</span>
                <span className="text-duoGold">💎</span>
              </div>
            </div>

            <div className="w-full bg-duoGrayBorder rounded-full h-3">
              <div
                className="bg-duoGreen h-3 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-duoGrayText text-xs">
              {quest.progress}/{quest.total} completed
            </p>
          </div>
        )
      })}
    </div>
  )
}

```

# src\features\dashboard\presentation\components\UnitBanner.tsx

```tsx
interface UnitBannerProps {
  unitNumber: number
  title: string
  color: string
}

export function UnitBanner({ unitNumber, title, color }: UnitBannerProps) {
  return (
    <div
      className="w-full 2xl:w-3/4 rounded-2xl overflow-hidden shadow-duoGreenShadow cursor-pointer hover:brightness-110 transition-all"
      style={{ backgroundColor: color }}
    >
      <div className="flex rounded-2xl h-20 w-full">
        <div className="w-5/6 h-full px-4 pb-3 flex flex-col">
          <div className="mt-3 text-duoSubText">
            <p className="text-sm font-bold">SECTION 1, UNIT {unitNumber}</p>
          </div>
          <div className="text-white text-xl">
            <p className="font-bold">{title}</p>
          </div>
        </div>
        <div className="h-full w-1/6 border-l border-white/20 flex justify-center items-center">
          <svg
            className="w-10 h-10"
            viewBox="0 0 24 24"
            fill="white"
            opacity="0.8"
          >
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

```

# src\features\dashboard\presentation\components\UnitPath.tsx

```tsx
import { LessonButton } from './LessonButton'

interface Lesson {
  id: number
  title: string
  type: 'lesson' | 'practice' | 'story' | 'review'
  status: 'locked' | 'available' | 'completed'
}

interface UnitPathProps {
  unitNumber: number
  title: string
  color: string
  lessons: Lesson[]
  showBreak?: boolean
}

export function UnitPath({ unitNumber, title, color, lessons, showBreak = true }: UnitPathProps) {
  return (
    <>
      {showBreak && unitNumber !== 1 && (
        <div className="flex items-center justify-center my-8 w-full max-w-md">
          <div className="flex-1 border-t-2 border-duoGrayBorder"></div>
          <div className="px-6 py-2 bg-duoDarkGray rounded-full border-2 border-duoGrayBorder">
            <p className="text-white font-bold text-sm">{title}</p>
          </div>
          <div className="flex-1 border-t-2 border-duoGrayBorder"></div>
        </div>
      )}

      <div className="flex flex-col w-full items-center lg:mb-0 mt-20 lg:mt-10 space-y-6 relative">
        {lessons.map((lesson, idx) => {
          // Alterna posição esquerda/direita
          const offset = idx % 2 === 0 ? 'lg:mr-40' : 'lg:ml-40'

          return (
            <div className={`w-auto py-1 ${offset}`} key={lesson.id}>
              <LessonButton
                lesson={lesson}
                color={color}
                index={idx}
              />
            </div>
          )
        })}

        {/* Animação decorativa */}
        <div className={`absolute mt-30 ${unitNumber % 2 === 0 ? 'mr-60' : 'ml-60'}`}>
          <div className="w-40 h-40 opacity-50">
            <svg viewBox="0 0 100 100" className="animate-bounce">
              <circle cx="50" cy="50" r="40" fill={color} opacity="0.3" />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}

```

# src\features\dashboard\presentation\components\UserStats.tsx

```tsx
import { FlameIcon, GemIcon, HeartIcon, FlagIcon } from './icons'

// Dados estáticos mockados
const mockUserStats = {
  language: 'JavaScript',
  languageFlag: '🇺🇸',
  completedLessons: 12,
  streakLength: 7,
  points: 350,
  hearts: Infinity,
}

export function UserStats() {
  return (
    <div className="flex w-full justify-between">
      <div className="flex gap-3 items-center">
        <div className="hover:cursor-pointer">
          <FlagIcon flag={mockUserStats.languageFlag} />
        </div>
        <p className="text-xl text-white">{mockUserStats.completedLessons}</p>
      </div>

      <div className="flex gap-2 items-center">
        <FlameIcon />
        <p className="text-xl text-duoOrange">{mockUserStats.streakLength}</p>
      </div>

      <div className="flex gap-1 items-center">
        <GemIcon />
        <p className="text-xl text-duoBlue">{mockUserStats.points}</p>
      </div>

      <div className="flex gap-1 items-center">
        <HeartIcon />
        <p className="text-2xl text-duoRed">∞</p>
      </div>
    </div>
  )
}

```

# src\features\dashboard\presentation\layouts\DashboardLayout.tsx

```tsx
import type { ReactNode } from 'react'
import { DashboardLeftSidebar } from '../components/DashboardLeftSidebar'
import { DashboardRightSidebar } from '../components/DashboardRightSidebar'
import { DashboardFooter } from '../components/DashboardFooter'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen h-screen bg-duoBackground scrollbar-journeyBlack max-h-screen lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] overflow-y-auto overscroll-none">
      <DashboardLeftSidebar />

      <div className="flex flex-col lg:px-6 lg:items-end min-w-0">
        {children}
      </div>

      <DashboardFooter />
      <DashboardRightSidebar />
    </div>
  )
}

```

# src\features\dashboard\presentation\pages\DashboardPage.tsx

```tsx
import { useState } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { UnitBanner } from '../components/UnitBanner'
import { UnitPath } from '../components/UnitPath'

// Dados mockados estáticos
const mockUnits = [
  {
    id: 1,
    orderIndex: 1,
    title: 'Get Started with JavaScript',
    color: '#58cc04',
    lessons: [
      { id: 1, title: 'Intro', type: 'lesson' as const, status: 'completed' as const },
      { id: 2, title: 'Variables', type: 'lesson' as const, status: 'completed' as const },
      { id: 3, title: 'Practice', type: 'practice' as const, status: 'available' as const },
      { id: 4, title: 'Functions', type: 'lesson' as const, status: 'available' as const },
      { id: 5, title: 'Review', type: 'review' as const, status: 'locked' as const },
    ],
  },
  {
    id: 2,
    orderIndex: 2,
    title: 'Control Flow',
    color: '#4bb0f6',
    lessons: [
      { id: 6, title: 'If/Else', type: 'lesson' as const, status: 'locked' as const },
      { id: 7, title: 'Loops', type: 'lesson' as const, status: 'locked' as const },
      { id: 8, title: 'Story', type: 'story' as const, status: 'locked' as const },
      { id: 9, title: 'Practice', type: 'practice' as const, status: 'locked' as const },
    ],
  },
  {
    id: 3,
    orderIndex: 3,
    title: 'Data Structures',
    color: '#f886d0',
    lessons: [
      { id: 10, title: 'Arrays', type: 'lesson' as const, status: 'locked' as const },
      { id: 11, title: 'Objects', type: 'lesson' as const, status: 'locked' as const },
      { id: 12, title: 'Practice', type: 'practice' as const, status: 'locked' as const },
      { id: 13, title: 'Story', type: 'story' as const, status: 'locked' as const },
      { id: 14, title: 'Review', type: 'review' as const, status: 'locked' as const },
    ],
  },
]

export function DashboardPage() {
  const [currentUnit] = useState(mockUnits[0])

  return (
    <DashboardLayout>
      <div className="w-full h-full pb-20 lg:pb-0 bg-duoBackground overflow-y-auto">
        {/* Banner da unidade atual */}
        <div className="w-full flex justify-center py-6">
          <UnitBanner
            unitNumber={currentUnit.orderIndex}
            title={currentUnit.title}
            color={currentUnit.color}
          />
        </div>

        {/* Caminho de unidades e lições */}
        <div className="w-full flex flex-col items-center">
          {mockUnits.map((unit, index) => (
            <UnitPath
              key={unit.id}
              unitNumber={unit.orderIndex}
              title={unit.title}
              color={unit.color}
              lessons={unit.lessons}
              showBreak={index > 0}
            />
          ))}
        </div>

        {/* Mensagem motivacional */}
        <div className="flex justify-center mt-16 mb-8">
          <div className="max-w-md text-center p-6 bg-duoDarkGray rounded-2xl border-2 border-duoGrayBorder">
            <p className="text-white text-lg font-bold mb-2">
              Keep going! 🚀
            </p>
            <p className="text-duoGrayText">
              You're making great progress in your learning journey.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

```

# src\features\dashboard\presentation\pages\index.ts

```ts
export { DashboardPage } from './DashboardPage'

```

# src\globals.css

```css
/* Tailwind v4: @custom-variant permite customizar o comportamento do variant 'dark:' */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
@import "tailwindcss";

/* DIN Next Rounded - Fonte principal do projeto */
@font-face {
  font-family: "DIN";
  src: url("/fonts/DIN Next Rounded LT W04 Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "DIN";
  src: url("/fonts/DIN Next Rounded LT W04 Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@layer utilities {
  .scrollbar-journeyBlack {
    scrollbar-width: thin;
    scrollbar-color: var(--color-journeyBlack) transparent;
  }

  .scrollbar-blue::-webkit-scrollbar {
    width: 4px;
    height: 8px;
  }

  .scrollbar-blue::-webkit-scrollbar-thumb {
    background-color: var(--color-journeyBlack);
    border-radius: 4px;
  }

  .scrollbar-blue::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-none {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }

  /* Shadows de botões - seguindo o padrão do shadow-md */
  .shadow-button-primary {
    box-shadow: var(--shadow-button-primary);
  }

  .shadow-button-secondary {
    box-shadow: var(--shadow-button-secondary);
  }

  /* Classes que precisam reagir ao tema */
  .text-button-secondary{
    color: var(--color-text-button-secondary);
  }

  .border-border-secondary {
    border-color: var(--color-border-secondary);
  }

  .bg-surface-hover {
    background-color: var(--color-surface-hover);
  }

  /* Classes do botão primary */
  .bg-primary-button {
    background-color: var(--color-primary-button-bg);
  }

  .hover\:bg-primary-button-hover:hover {
    background-color: var(--color-primary-button-hover);
  }

  .text-primary-button {
    color: var(--color-primary-button-text);
  }

  .bg-input {
    background-color: var(--color-input-bg);
  }

  .border-input {
    border-color: var(--color-input-border);
  }

  .focus\:border-input-focus:focus {
    border-color: var(--color-input-border-focus);
  }

  .text-input {
    color: var(--color-input-text);
  }

  .placeholder-input::placeholder {
    color: var(--color-input-placeholder);
    font-size: 1rem;
  }

  .text-auth-heading {
    color: var(--color-auth-heading);
  }

  .bg-divider {
    background-color: var(--color-divider);
  }

  .text-divider {
    color: var(--color-divider-text);
  }

  .text-link {
    color: var(--color-link);
  }

  .text-error {
    color: var(--color-error-text);
  }

  .placeholder-error::placeholder {
    color: var(--color-error-text);
  }
}

/* CSS @property: permite transições suaves e type-safety para custom properties */
@property --color-background {
  syntax: '<color>';
  inherits: true;
  initial-value: #f2f0ef;
}

@property --color-surface {
  syntax: '<color>';
  inherits: true;
  initial-value: #ffffff;
}

@property --color-text-primary {
  syntax: '<color>';
  inherits: true;
  initial-value: #0f0f0f;
}

@property --color-text-button-secondary {
  syntax: '<color>';
  inherits: true;
  initial-value: #0f0f0f;
}

@property --color-border-secondary {
  syntax: '<color>';
  inherits: true;
  initial-value: #dddddd;
}

@property --color-surface-hover {
  syntax: '<color>';
  inherits: true;
  initial-value: #f9f9f9;
}

@property --color-primary-button-bg {
  syntax: '<color>';
  inherits: true;
  initial-value: #0f0f0f;
}

@property --color-primary-button-hover {
  syntax: '<color>';
  inherits: true;
  initial-value: #333333;
}

@property --color-primary-button-text {
  syntax: '<color>';
  inherits: true;
  initial-value: #ffffff;
}

@property --shadow-button-primary {
  syntax: '*';
  inherits: true;
  initial-value: 0 5px 0 #000000;
}

@property --shadow-button-secondary {
  syntax: '*';
  inherits: true;
  initial-value: 0 5px 0 #dddddd;
}

@property --color-input-bg {
  syntax: '<color>';
  inherits: true;
  initial-value: #f3f4f6;
}

@property --color-input-border {
  syntax: '<color>';
  inherits: true;
  initial-value: #d1d5db;
}

@property --color-input-border-focus {
  syntax: '<color>';
  inherits: true;
  initial-value: #000000;
}

@property --color-input-text {
  syntax: '<color>';
  inherits: true;
  initial-value: #4b5563;
}

@property --color-input-placeholder {
  syntax: '<color>';
  inherits: true;
  initial-value: #6b7280;
}

@property --color-auth-heading {
  syntax: '<color>';
  inherits: true;
  initial-value: #0f0f0f;
}

@property --color-divider {
  syntax: '<color>';
  inherits: true;
  initial-value: #d1d5db;
}

@property --color-divider-text {
  syntax: '<color>';
  inherits: true;
  initial-value: #6b7280;
}

@property --color-link {
  syntax: '<color>';
  inherits: true;
  initial-value: #6b7280;
}

@property --color-error-text {
  syntax: '<color>';
  inherits: true;
  initial-value: #dc2626;
}

/* Define as cores base no :root para serem referenciadas */
:root {
  --base-background: #ffffff;
  --base-surface: #ffffff;
  --base-surface-elevated: #f5f5f5;
  --base-surface-hover: #f9f9f9;
  --base-text-primary: #0f0f0f;
  --base-text-secondary: #52656d;
  --base-border-light: #dddddd;
  --base-text-button-secondary: #0f0f0f;
  --base-border-secondary: #c7c4bf;
  --base-primary-button-bg: #0f0f0f;
  --base-primary-button-hover: #333333;
  --base-primary-button-text: #ffffff;
  --base-shadow-button-primary: 0 5px 0 #000000;
  --base-shadow-button-secondary: 0 5px 0 #c7c4bf;
  --base-input-bg: #fefefe;
  --base-input-border: #d1d5db;
  --base-input-border-focus: #000000;
  --base-input-text: #4b5563;
  --base-input-placeholder: #6b7280;
  --base-auth-heading: #0f0f0f;
  --base-divider: #d1d5db;
  --base-divider-text: #6b7280;
  --base-link: #6b7280;
  --base-error-text: #dc2626;
}

/* Theme variables referenciando as cores base */
@theme inline {
  --color-background: var(--base-background);
  --color-surface: var(--base-surface);
  --color-surface-elevated: var(--base-surface-elevated);
  --color-surface-hover: var(--base-surface-hover);
  --color-text-primary: var(--base-text-primary);
  --color-text-secondary: var(--base-text-secondary);
  --color-text-button-secondary: var(--base-text-button-secondary);
  --color-border-light: var(--base-border-light);
  --color-border-secondary: var(--base-border-secondary);
  --color-primary-button-bg: var(--base-primary-button-bg);
  --color-primary-button-hover: var(--base-primary-button-hover);
  --color-primary-button-text: var(--base-primary-button-text);
  --shadow-button-primary: var(--base-shadow-button-primary);
  --shadow-button-secondary: var(--base-shadow-button-secondary);
  --color-input-bg: var(--base-input-bg);
  --color-input-border: var(--base-input-border);
  --color-input-border-focus: var(--base-input-border-focus);
  --color-input-text: var(--base-input-text);
  --color-input-placeholder: var(--base-input-placeholder);
  --color-auth-heading: var(--base-auth-heading);
  --color-divider: var(--base-divider);
  --color-divider-text: var(--base-divider-text);
  --color-link: var(--base-link);
  --color-error-text: var(--base-error-text);
}

@theme {
  /* Cores que não mudam com o tema */
  --color-surface-dark: #202f36;
  --color-surface-darker: #121f25;
  --color-text-muted: #adaeae;
  --color-text-inverse: #ffffff;
  --color-text-button: #53656d;
  --color-text-subtle: #e8e8e8;
  --color-border: #37464f;
  --color-border-muted: #e5e7eb;
  --color-border-strong: #2b383f;

  /* Brand/Primárias - cor principal do projeto é #0f0f0f (preto) */
  --color-primary: #0f0f0f;
  --color-primary-hover: #333333;
  --color-primary-active: #1a1a1a;
  --color-secondary: #4bb0f6;
  --color-secondary-hover: #3a9fd8;
  --color-secondary-active: #4099d6;

  /* Estados */
  --color-success: #0f0f0f;
  --color-success-shadow: #000000;
  --color-error: #ff4c4b;
  --color-error-alt: #ee5555;
  --color-warning: #f5a632;
  --color-info: #4bb0f6;

  /* Cores de destaque */
  --color-gold: #ffd401;
  --color-pink: #f886d0;
  --color-pink-dark: #cc6ba7;
  --color-orange: #f5a632;
  --color-red: #ff4c4b;

  /* Bloqueado/Desabilitado */
  --color-locked: #37464f;
  --color-disabled: #adaeae;

  /* Sombras - Padrão: --shadow-{component}-{variant} */

  /* Sombras genéricas */
  --shadow-sm: 0 3px #37464f;
  --shadow-md: 0 5px 0 #000000;
  --shadow-lg: 0 8px #333333;

  /* Sombras de botões */
  --shadow-button-secondary-sm: 0 3px 0 #dddddd;

  /* Sombras de círculos/badges */
  --shadow-circle-sm: 0 5px 0 #2b383f;
  --shadow-circle-md: 0 8px 0 #000000;
  --shadow-circle-primary: 0 8px #4099d6;
  --shadow-circle-pink: 0 8px #cc6ba7;
  --shadow-circle-locked: 0 5px 0 #2b383f;

  /* Sombras de badges (retangulares) */
  --shadow-badge-primary: 0 5px 0 #4099d6;
  --shadow-badge-pink: 0 5px 0 #cc6ba7;
  --shadow-badge-locked: 0 8px 0 #2b383f;

  /* Tipografia */
  --font-family-sans: DIN, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-family-din: DIN, sans-serif;
}

/* Dark mode: atualiza as variáveis base no :root */
[data-theme="dark"] {
  --base-background: #0F0E09;
  --base-surface: #0F0E09;
  --base-surface-elevated: #121212;
  --base-surface-hover: #121212;
  --base-text-primary: #fafafa;
  --base-text-secondary: #adaeae;
  --base-text-button-secondary: #adaeae;
  --base-border-light: #242027;
  --base-border-secondary: #242027;
  --base-primary-button-bg: #fafafa;
  --base-primary-button-hover: #e0e0e0;
  --base-primary-button-text: #0f0f0f;
  --base-shadow-button-primary: 0 5px 0 #c7c4bf;
  --base-shadow-button-secondary: 0 5px 0 #242027;
  --base-input-bg: #121212;
  --base-input-border: #242027;
  --base-input-border-focus: #fafafa;
  --base-input-text: #e5e5e5;
  --base-input-placeholder: #9ca3af;
  --base-auth-heading: #ffffff;
  --base-divider: #333333;
  --base-divider-text: #9ca3af;
  --base-link: #9ca3af;
  --base-error-text: #f87171;
}

[data-theme="dark"] {
  @theme {
    --color-surface-dark: #0f1419;
    --color-surface-darker: #121f25;
    --color-text-muted: #52656d;
    --color-text-inverse: #0f0f0f;
    --color-text-button: #adaeae;
    --color-text-subtle: #d0f0c1;
    --color-border: #37464f;
    --color-border-muted: #2b383f;
    --color-border-strong: #4a5a64;

    /* Brand/Primárias */
    --color-primary: #0f0f0f;
    --color-primary-hover: #333333;
    --color-primary-active: #1a1a1a;
    --color-secondary: #4bb0f6;
    --color-secondary-hover: #5dc0ff;
    --color-secondary-active: #4099d6;

    /* Estados */
    --color-success: #0f0f0f;
    --color-success-shadow: #000000;
    --color-error: #ee5555;
    --color-error-alt: #ff6b6b;
    --color-warning: #f5a632;
    --color-info: #4bb0f6;

    /* Cores de destaque */
    --color-gold: #ffd401;
    --color-pink: #f886d0;
    --color-pink-dark: #cc6ba7;
    --color-orange: #f5a632;
    --color-red: #ff4c4b;

    /* Bloqueado/Desabilitado */
    --color-locked: #37464f;
    --color-disabled: #52656d;

    /* Sombras ajustadas para contraste em dark mode */
    --shadow-sm: 0 3px #1a2730;
    --shadow-md: 0 5px 0 #000000;
    --shadow-lg: 0 8px #0a0a0a;

    --shadow-button-secondary-sm: 0 3px 0 #4a5a64;

    --shadow-circle-sm: 0 5px 0 #1a2730;
    --shadow-circle-md: 0 8px 0 #000000;
    --shadow-circle-primary: 0 8px #357ab8;
    --shadow-circle-pink: 0 8px #a5548a;
    --shadow-circle-locked: 0 5px 0 #1a2730;

    --shadow-badge-primary: 0 5px 0 #357ab8;
    --shadow-badge-pink: 0 5px 0 #a5548a;
    --shadow-badge-locked: 0 8px 0 #1a2730;
  }
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
.bob {
  animation: bob 3s ease-in-out infinite;
  will-change: transform;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(1deg);
  }
  50% {
    transform: translateY(-5px) rotate(-0.5deg);
  }
  75% {
    transform: translateY(-12px) rotate(1.5deg);
  }
}

.float-space {
  animation: float 6s ease-in-out infinite;
  will-change: transform;
}

:root {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 1920px;
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);
  --color-avocado-400: oklch(0.92 0.19 114.08);
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --color-avocado-600: oklch(0.53 0.12 118.34);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}

html {
  /* Transição suave entre temas usando @property para animação de custom properties */
  transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1),
              color 0.2s cubic-bezier(0.2, 0, 0, 1);
}

html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  background: var(--color-background);
  font-family: DIN, system-ui, -apple-system, sans-serif;
  font-weight: 400;
}

#root {
  min-height: 100vh;
  width: 100%;
}

/* Screen reader only: oculta visualmente mas mantém acessível para leitores de tela */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Remove outline azul padrão do browser em todos os elementos */
*:focus,
*:focus-visible {
  outline: none;
}

/* Remove box-shadow azul do browser em inputs e buttons */
button:focus:not([class*="shadow-"]),
input:focus,
textarea:focus,
select:focus {
  outline: none;
  box-shadow: none;
}

/* Aplica peso bold em todos os botões */
button {
  font-weight: 700;
}

/* Reduz padding dos inputs */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="search"],
input[type="tel"],
input[type="url"],
textarea {
  padding-top: calc(0.75rem);
  padding-bottom: calc(0.75rem);
  padding-left: calc(0.75rem);
  padding-right: calc(0.75rem);
}

```

# src\routes\_authenticated.dashboard.tsx

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '../features/dashboard/presentation/pages'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

```

# src\shared\components\ui\Button.tsx

```tsx
import React, { useCallback, useMemo } from 'react';
import { usePerformanceOptimization } from '../../performance/presentation/hooks/usePerformanceOptimization'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  // Performance optimization props
  enableThrottle?: boolean;
  throttleDelay?: number;
}

// Componente de loading spinner simples
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
  type = 'button',
  enableThrottle = false,
  throttleDelay = 1000
}: ButtonProps) {
  // Estabiliza callback com useCallback
  const stableOnClick = useCallback(() => {
    onClick()
  }, [onClick])

  // Cria opções de otimização de forma estável com useMemo
  const optimizationOptions = useMemo(() => ({
    strategy: 'throttle' as const,
    delay: throttleDelay
  }), [throttleDelay])

  // Hook de otimização de performance
  const { optimizedFn: throttledOnClick } = usePerformanceOptimization(
    stableOnClick,
    optimizationOptions
  )

  // Classes base do botão
  const baseClasses = 'w-full rounded-2xl font-medium flex items-center justify-center gap-2 focus:outline-none focus-visible:outline-none';

  // Classes de variantes (cores e estilos básicos)
  const variantClasses = {
    primary: 'bg-primary-button text-primary-button hover:bg-primary-button-hover transition-colors shadow-button-primary',
    secondary: 'bg-surface border-2 border-border-secondary text-button-secondaryhover:bg-surface-hover transition-colors shadow-button-secondary',
    ghost: 'bg-transparent text-secondary hover:bg-surface-elevated active:bg-surface transition-colors',
    danger: 'bg-error text-white hover:bg-error-alt transition-colors shadow-button-primary'
  };

  // Classes de tamanho
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14'
  };

  // Classes de estado (disabled/loading)
  const stateClasses = (disabled || loading)
    ? 'opacity-50 cursor-not-allowed'
    : '';

  const loadingClasses = loading ? 'cursor-wait' : '';

  // Combina todas as classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses,
    loadingClasses,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && !loading) {
      if (enableThrottle) {
        throttledOnClick();
      } else {
        onClick();
      }
    }
  };

  // Controla o estado de clique para animação 3D
  const [isActive, setIsActive] = React.useState(false);

  // Estilos inline apenas para animação do clique
  const getButtonStyle = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      transition: 'all 0.2s ease',
      transform: isActive && !disabled && !loading ? 'translateY(5px)' : 'translateY(0)',
    };

    // Apenas define boxShadow quando está ativo para não sobrescrever as classes CSS
    if (isActive && !disabled && !loading) {
      styles.boxShadow = 'none';
    }

    return styles;
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={buttonClasses}
      style={getButtonStyle()}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
    >
      {loading && <LoadingSpinner />}
      {icon && !loading && icon}
      {children}
    </button>
  );
}
```

# src\shared\components\ui\ErrorMessage.tsx

```tsx
import { clsx } from 'clsx'

interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
  className?: string
}

export function ErrorMessage({ message, onDismiss, className }: ErrorMessageProps) {
  return (
    <div className={clsx(
      'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between',
      className
    )}>
      <div className="flex items-center">
        <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 ml-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
```

# src\shared\components\ui\FormErrorMessage.tsx

```tsx
/**
 * FormErrorMessage - Componente de Erro de Formulário
 *
 * Componente minimalista para exibir mensagens de erro em formulários
 * Segue princípios de design limpo e focado
 *
 * @pattern Presentation Component
 * @layer Shared/UI
 */

interface FormErrorMessageProps {
  message: string
  className?: string
}

export function FormErrorMessage({ message, className = '' }: FormErrorMessageProps) {
  if (!message) return null

  return (
    <p className={`text-base text-error transition-colors ${className}`}>
      {message}
    </p>
  )
}

```

# src\shared\components\ui\Input.tsx

```tsx
import { useState, useCallback } from 'react'
import { clsx } from 'clsx'
import { usePerformanceOptimization } from '../../performance/presentation/hooks/usePerformanceOptimization'
import { PerformanceConfig } from '../../performance/domain/value-objects/PerformanceConfig'
import { PerformanceStrategy } from '../../performance/domain/entities/PerformanceStrategy'

interface InputProps {
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  hasError?: boolean
  required?: boolean
  className?: string
  showForgotPassword?: boolean
  onForgotPassword?: () => void
  helperText?: string
  // Performance optimization props
  enableDebouncedValidation?: boolean
  validationDelay?: number
  onDebouncedChange?: (value: string) => void
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  hasError = false,
  required = false,
  className,
  showForgotPassword = false,
  onForgotPassword,
  helperText,
  enableDebouncedValidation = false,
  validationDelay = 300,
  onDebouncedChange
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === 'password' && showPassword ? 'text' : type

  // Strategy Pattern para validação debounced opcional
  const debouncedValidation = useCallback((inputValue: string) => {
    if (onDebouncedChange) {
      onDebouncedChange(inputValue)
    }
  }, [onDebouncedChange])

  const validationConfig = PerformanceConfig.create({ delay: validationDelay })
  const validationStrategy = PerformanceStrategy.createDebounce('input-validation', validationConfig)

  const { optimizedFn: debouncedValidateInput } = usePerformanceOptimization(
    debouncedValidation,
    {
      strategy: validationStrategy.type,
      delay: validationStrategy.config.delay
    }
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange(e)

    // Aplicação condicional do debounce para validação
    if (enableDebouncedValidation) {
      debouncedValidateInput(inputValue)
    }
  }

  const baseClasses = clsx(
    'w-full bg-input border-2 rounded-2xl px-4 py-3 sm:px-5 sm:py-4',
    'text-sm sm:text-base',
    'focus:outline-none transition-all duration-200',
    {
      // Estado normal
      'border-input text-input placeholder-input': !hasError,
      'focus:border-input-focus': !hasError,
      // Estado de erro - apenas borda e texto mudam (usando variáveis CSS do tema)
      'border-journeyIncorrectRed focus:border-journeyIncorrectRed': hasError,
      'text-error placeholder-error': hasError,
    }
  )

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onBlur={onBlur}
          required={required}
          className={clsx(baseClasses, className)}
        />

        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {showForgotPassword && type === 'password' && (
        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-link hover:underline uppercase transition-colors"
          >
            Esqueceu a senha?
          </button>
        </div>
      )}

      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
```

# src\shared\components\ui\NotificationContainer.tsx

```tsx
import { useNotifications } from '../../contexts/NotificationContext'
import { Notification } from '../../domain/entities/Notification'

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onClose: () => void
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }[notification.type]

  const iconColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }[notification.type]

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }[notification.type]

  return (
    <div className={`${bgColor} border rounded-lg p-4 shadow-lg transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-start gap-3">
        <span className={`${iconColor} text-lg`}>{icon}</span>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {notification.message}
          </p>

          {notification.action && (
            <button
              onClick={notification.action.handler}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-2"
            >
              {notification.action.label}
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}
```

# src\shared\components\ui\PasswordInput.tsx

```tsx
import { useState, useMemo } from 'react'
import { FormErrorMessage } from './FormErrorMessage'

/**
 * Wrapper inteligente para input de senha com indicadores de força
 *
 * Benefícios:
 * - Feedback visual em tempo real sobre requisitos de senha
 * - Reutilizável em formulários de registro e alteração de senha
 * - Performance otimizada com useMemo para cálculos
 * - Segue mesmo padrão de composição do ValidatedInput
 *
 * Princípios SOLID:
 * - SRP: Responsável apenas por composição visual de senha + feedback
 * - OCP: Extensível via props sem modificar o componente
 * - LSP: Pode substituir Input de senha sem quebrar código
 */

interface PasswordInputProps {
  value: string
  onChange: (eventOrValue: React.ChangeEvent<HTMLInputElement> | string) => void
  onBlur?: () => void
  placeholder?: string
  error?: string
  showStrengthIndicator?: boolean
  required?: boolean
  className?: string
}

interface PasswordCriterion {
  id: string
  label: string
  test: (pwd: string) => boolean
}

export function PasswordInput({
  value,
  onChange,
  onBlur,
  placeholder = 'Senha',
  error,
  showStrengthIndicator = true,
  required = false,
  className = ''
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Critérios de validação (estáveis, não causam re-render)
  const criteria: PasswordCriterion[] = useMemo(() => [
    { id: 'length', label: 'Mínimo 8 caracteres', test: (pwd: string) => pwd.length >= 8 },
    { id: 'uppercase', label: 'Uma letra maiúscula', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { id: 'lowercase', label: 'Uma letra minúscula', test: (pwd: string) => /[a-z]/.test(pwd) },
    { id: 'number', label: 'Um número', test: (pwd: string) => /\d/.test(pwd) },
    { id: 'special', label: 'Um caractere especial', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ], [])

  // Cálculos memoizados
  const validCriteria = useMemo(() =>
    criteria.filter(c => c.test(value)),
    [criteria, value]
  )

  const strengthPercentage = useMemo(() =>
    (validCriteria.length / criteria.length) * 100,
    [validCriteria.length, criteria.length]
  )

  const inputType = showPassword ? 'text' : 'password'

  // Classes com estado de erro
  const baseClasses = error
    ? 'w-full border-2 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 pr-12 text-sm sm:text-base focus:outline-none transition-all duration-200 bg-red-50 dark:bg-red-900/20 border-journeyIncorrectRed focus:border-journeyIncorrectRed text-journeyIncorrectRed placeholder-red-400 dark:placeholder-red-500'
    : 'w-full bg-input border-2 border-input rounded-2xl px-4 py-3 sm:px-5 sm:py-4 pr-12 text-sm sm:text-base focus:outline-none focus:border-input-focus transition-all duration-200 text-input placeholder-input'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Suporta tanto passar o evento completo quanto apenas o valor
    onChange(e)
  }

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150)
    onBlur?.()
  }

  return (
    <div className={className}>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => showStrengthIndicator && setShowDropdown(true)}
          onBlur={handleBlur}
          className={baseClasses}
          required={required}
        />

        {/* Botão toggle de visibilidade */}
        <button
          type="button"
          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>

        {/* Dropdown de indicadores de força */}
        {showStrengthIndicator && showDropdown && (
          <div
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2.5 sm:p-3 animate-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Sua senha deve conter:</p>
              <div className="flex items-center space-x-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {validCriteria.length}/{criteria.length}
                </div>
                <div className="w-8 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                    style={{ width: `${strengthPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-0.5">
              {criteria.map((criterion) => {
                const isValid = criterion.test(value)
                return (
                  <div key={criterion.id} className="flex items-center space-x-2 py-0.5 px-1.5 -mx-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className={`flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isValid ? 'bg-green-500 scale-110' : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {isValid ? (
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-xs transition-all duration-300 ${
                      isValid ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {criterion.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {error && <FormErrorMessage message={error} />}
    </div>
  )
}

```

# src\shared\components\ui\ThemedImage.tsx

```tsx
import { useMemo } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface ThemedImageProps {
  lightSrc: string
  darkSrc: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  priority?: boolean
}

export function ThemedImage({
  lightSrc,
  darkSrc,
  alt,
  className = '',
  width,
  height,
  loading = 'eager',
  priority = false
}: ThemedImageProps) {
  const { resolvedTheme } = useTheme()

  const currentSrc = useMemo(() => {
    return resolvedTheme === 'dark' ? darkSrc : lightSrc
  }, [resolvedTheme, darkSrc, lightSrc])

  const imgProps = useMemo(() => {
    const props: React.ImgHTMLAttributes<HTMLImageElement> = {
      src: currentSrc,
      alt,
      className,
      loading: priority ? 'eager' : loading
    }

    if (width) props.width = width
    if (height) props.height = height

    return props
  }, [currentSrc, alt, className, width, height, loading, priority])

  return (
    <img
      {...imgProps}
      style={{
        transition: 'opacity 0.2s ease-in-out'
      }}
    />
  )
}

```

# src\shared\components\ui\ThemeToggle.tsx

```tsx
import { useTheme } from '../../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border-light text-primary transition-all duration-200"
        title={`Tema atual: ${resolvedTheme === 'dark' ? 'escuro' : 'claro'}`}
        aria-label={`Alternar tema. Tema atual: ${resolvedTheme === 'dark' ? 'escuro' : 'claro'}`}
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="text-sm bg-surface text-primary border border-border-light rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer hover:bg-surface-elevated"
        aria-label="Selecionar modo de tema"
      >
        <option value="light">Claro</option>
        <option value="dark">Escuro</option>
        <option value="system">Sistema</option>
      </select>
    </div>
  )
}
```

