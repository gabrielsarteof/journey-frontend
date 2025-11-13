interface ChallengeProgressIndicatorProps {
  onNavigate: () => void
}

export function ChallengeProgressIndicator({ onNavigate }: ChallengeProgressIndicatorProps) {
  const handleClick = () => {
    onNavigate()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onNavigate()
    }
  }

  return (
    <div
      className="absolute -top-20 left-1/2 -translate-x-1/2 z-20 animate-float cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Continue current challenge"
    >
      <div className="relative">
        <div className="bg-primary px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
          <p className="text-white font-bold text-sm uppercase tracking-wide whitespace-nowrap select-none">
            Continuar
          </p>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary"></div>
      </div>
    </div>
  )
}
