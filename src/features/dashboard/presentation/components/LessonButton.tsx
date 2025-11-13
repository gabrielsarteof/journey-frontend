import { Challenge } from '../../domain/entities/Challenge'
import { LockIcon } from '@/shared/assets/icons'
import { ChallengeProgressIndicator } from './ChallengeProgressIndicator'

interface LessonButtonProps {
  challenge: Challenge
  onClick?: () => void
}

export function LessonButton({ challenge, onClick }: LessonButtonProps) {
  if (!challenge) {
    console.error('LessonButton: challenge is undefined!')
    return null
  }

  const getButtonStyle = () => {
    if (challenge.isLocked()) {
      return {
        text: 'text-disabled',
        cursor: 'cursor-pointer',
        hover: 'hover:brightness-110 hover:scale-105',
        opacity: 'opacity-50'
      }
    }

    if (challenge.isCompleted()) {
      return {
        text: 'text-primary',
        cursor: 'cursor-pointer',
        hover: 'hover:brightness-110 hover:scale-105',
        opacity: ''
      }
    }

    return {
      text: 'text-primary',
      cursor: 'cursor-pointer',
      hover: 'hover:brightness-110 hover:scale-105',
      opacity: ''
    }
  }

  const style = getButtonStyle()
  const planetAsset = challenge.planetAsset

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {challenge.status.isInProgress() && (
          <ChallengeProgressIndicator onNavigate={handleClick} />
        )}

        <button
          onClick={handleClick}
          className={`
            w-24 h-24 rounded-full ${style.cursor} ${style.hover} ${style.opacity}
            flex items-center justify-center
            transition-all duration-300 focus:outline-none focus-visible:outline-none
            ${!challenge.isLocked() ? 'active:scale-95' : ''}
            relative group
          `}
          aria-label={challenge.title}
          aria-disabled={challenge.isLocked()}
        >
        {/* Planeta - sempre exibe, mas com filtros diferentes por estado */}
        <img
          src={planetAsset.path}
          alt={planetAsset.altText}
          className={`
            w-full h-full object-cover transition-all duration-300 rounded-full
            ${challenge.isLocked() ? 'grayscale-75' : ''}
            ${challenge.isCompleted() ? 'brightness-110 saturate-150' : ''}
          `}
          loading="lazy"
        />
      </button>

        {/* Badges - fora do botão para não serem cortados */}
        {/* Badge de completado */}
        {challenge.isCompleted() && (
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)' }}>
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Indicador de "em progresso" */}
        {challenge.status.isInProgress() && (
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
          </div>
        )}
      </div>
    </div>
  )
}
