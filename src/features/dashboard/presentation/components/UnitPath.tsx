import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LessonButton } from './LessonButton'
import { ChallengeDropdown } from './ChallengeDropdown'
import { StartHint } from './StartHint'
import { Challenge } from '../../domain/entities/Challenge'

interface UnitPathProps {
  unitNumber: number
  title: string
  moduleSlug: string
  lessons: Challenge[]
  showBreak?: boolean
}

export function UnitPath({ unitNumber, title, moduleSlug, lessons, showBreak = true }: UnitPathProps) {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null)

  const handleChallengeClick = (challengeId: string) => {
    setSelectedChallengeId(prev => prev === challengeId ? null : challengeId)
  }

  const handleStartChallenge = (challenge: Challenge) => {
    console.log('Starting challenge:', challenge.id)
  }

  return (
    <>
      {showBreak && unitNumber !== 1 && (
        <div className="flex items-center justify-center my-12 w-full max-w-2xl">
          <div className="flex-1 border-t-2 border-border-secondary transition-colors"></div>
          <div className="px-8 py-3 bg-surface-elevated rounded-full border-2 border-border-secondary transition-colors">
            <p className="text-auth-heading font-bold text-base uppercase tracking-wide transition-colors">{title}</p>
          </div>
          <div className="flex-1 border-t-2 border-border-secondary transition-colors"></div>
        </div>
      )}

      <div className="flex flex-col w-full max-w-2xl items-center space-y-6 py-6 pt-16">
        {lessons.map((challenge, idx) => {
          const isSelected = selectedChallengeId === challenge.id
          const isCurrentChallenge = !challenge.isCompleted() && !challenge.isLocked() &&
            lessons.slice(0, idx).every(c => c.isCompleted() || c.isLocked())

          const offsetStyle = idx === 0
            ? {}
            : idx % 2 === 1
            ? { marginLeft: '4rem' }
            : { marginRight: '4rem' }

          return (
            <div
              className="relative w-full"
              key={challenge.id}
              style={offsetStyle}
            >
              <AnimatePresence mode="wait">
                {isCurrentChallenge && !isSelected && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 z-[100]">
                    <StartHint key={`hint-${challenge.id}`} />
                  </div>
                )}
              </AnimatePresence>

              <LessonButton
                challenge={challenge}
                onClick={() => handleChallengeClick(challenge.id)}
              />

              <AnimatePresence mode="wait">
                {isSelected && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[100]">
                    <ChallengeDropdown
                      key={`dropdown-${challenge.id}`}
                      challenge={challenge}
                      onStart={() => handleStartChallenge(challenge)}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </>
  )
}