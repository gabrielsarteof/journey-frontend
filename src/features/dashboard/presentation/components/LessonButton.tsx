import { Challenge } from '../../domain/entities/Challenge'
import { LockIcon } from '@/shared/assets/icons'

/**
 * LessonButton Component (Refatorado com DDD)
 *
 * Componente de apresentação que recebe uma entidade de domínio Challenge.
 * Segue princípios:
 * - SRP: Responsável apenas pela renderização
 * - DIP: Depende de abstrações (Challenge entity)
 * - Clean Architecture: Camada de apresentação usa domínio
 *
 * Benefícios:
 * - Type-safe: TypeScript garante que Challenge é válido
 * - Domain-driven: Usa lógica de negócio encapsulada
 * - Testável: Fácil de mockar entidades
 * - Manutenível: Mudanças no domínio refletem automaticamente
 */

interface LessonButtonProps {
  challenge: Challenge
  onClick?: () => void
}

export function LessonButton({ challenge, onClick }: LessonButtonProps) {
  // Proteção contra undefined
  if (!challenge) {
    console.error('LessonButton: challenge is undefined!')
    return null
  }

  /**
   * Estilos baseados no status do challenge
   * Usa métodos de domínio ao invés de comparações diretas
   */
  const getButtonStyle = () => {
    if (challenge.isLocked()) {
      return {
        text: 'text-disabled',
        cursor: 'cursor-not-allowed',
        hover: '',
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

  /**
   * Handler de click que respeita regras de domínio
   */
  const handleClick = () => {
    if (challenge.isLocked()) {
      return
    }

    if (onClick) {
      onClick()
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Container do botão com badges */}
      <div className="relative">
        {/* Botão do planeta */}
        <button
          disabled={challenge.isLocked()}
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
            ${challenge.isLocked() ? 'grayscale brightness-[0.6] saturate-0' : ''}
            ${challenge.isCompleted() ? 'brightness-110 saturate-150' : ''}
          `}
          loading="lazy"
        />

        {/* Overlay de bloqueio */}
        {challenge.isLocked() && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
            <LockIcon className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
        )}
      </button>

        {/* Badges - fora do botão para não serem cortados */}
        {/* Badge de completado */}
        {challenge.isCompleted() && (
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center z-10" style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)' }}>
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Indicador de "em progresso" */}
        {challenge.status.isInProgress() && (
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-3 border-white flex items-center justify-center shadow-lg z-10">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
          </div>
        )}
      </div>

      {/* Título do challenge */}
      <p className={`text-sm font-bold ${style.text} transition-colors text-center`}>
        {challenge.title}
      </p>

      {/* Progresso de estrelas (se completado) */}
      {challenge.isCompleted() && (
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs text-gold font-bold">
            {challenge.completedStars}/{challenge.maxStars}
          </span>
        </div>
      )}

      {/* Indicador de tipo de challenge (opcional) */}
      {challenge.type.isReview() && (
        <span className="text-xs text-pink font-semibold uppercase">Review</span>
      )}
    </div>
  )
}
