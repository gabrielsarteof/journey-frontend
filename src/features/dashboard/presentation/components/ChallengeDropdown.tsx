import { motion, type Variants } from 'framer-motion'
import { Challenge } from '../../domain/entities/Challenge'
import { Button } from '@/shared/components/ui/Button'

interface ChallengeDropdownProps {
  challenge: Challenge
  onStart: () => void
}

export function ChallengeDropdown({ challenge, onStart }: ChallengeDropdownProps) {
  const dropdownVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.3,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1],
      }
    },
    exit: {
      opacity: 0,
      scale: 0.3,
      transition: {
        duration: 0.25,
        ease: [0.6, 0, 0.8, 0.4],
      }
    }
  }

  if (challenge.isLocked()) {
    return (
      <motion.div
        className="w-72 relative mt-2"
        variants={dropdownVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ originY: 0 }}
      >
        <div
          className="speech-bubble rounded-2xl p-5 transition-colors border-2 border-border-secondary"
          style={{
            backgroundColor: 'var(--color-surface)',
            '--arrow-size': '10px',
            '--border-color': 'var(--color-border-secondary)',
            '--bg-color': 'var(--color-surface)'
          } as React.CSSProperties}
        >
          <h3 className="text-secondary font-bold text-xl mb-3 text-left">
            {challenge.title}
          </h3>

          <p className="text-secondary text-xl text-left mb-4">
            Complete todos os desafios acima para desbloquear esse
          </p>

          <Button
            onClick={() => {}}
            variant="secondary"
            size="lg"
            disabled={true}
          >
            BLOQUEADO
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="w-72 relative mt-2"
      variants={dropdownVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ originY: 0 }}
    >
      <div
        className="speech-bubble rounded-2xl p-5 transition-colors"
        style={{
          backgroundColor: 'var(--color-primary-button-bg)',
          '--arrow-size': '10px',
          '--border-color': 'var(--color-primary-button-bg)',
          '--bg-color': 'var(--color-primary-button-bg)'
        } as React.CSSProperties}
      >
        <h3 className="text-primary-button font-bold text-xl mb-3 text-left">
          {challenge.title}
        </h3>

        {challenge.isCompleted() && (
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-primary-button" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-primary-button text-sm font-bold">Completo</span>
            <div className="flex items-center gap-1 ml-2">
              <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gold font-bold">
                {challenge.completedStars}/{challenge.maxStars}
              </span>
            </div>
          </div>
        )}

        {challenge.type.isReview() && (
          <div className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 mb-4">
            <p className="text-primary-button text-xs font-bold uppercase text-left">Review</p>
          </div>
        )}

        <Button
          onClick={onStart}
          variant="secondary"
          size="lg"
        >
          {challenge.isCompleted()
            ? 'PRATICAR NOVAMENTE'
            : challenge.status.isInProgress()
            ? 'CONTINUAR'
            : 'COMEÇAR +10 XP'}
        </Button>
      </div>
    </motion.div>
  )
}