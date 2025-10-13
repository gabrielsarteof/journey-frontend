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
