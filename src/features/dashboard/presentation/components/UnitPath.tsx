import { LessonButton } from './LessonButton'
import { Challenge } from '../../domain/entities/Challenge'

interface UnitPathProps {
  unitNumber: number
  title: string
  moduleSlug: string
  lessons: Challenge[]
  showBreak?: boolean
}

export function UnitPath({ unitNumber, title, moduleSlug, lessons, showBreak = true }: UnitPathProps) {
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

      <div className="flex flex-col w-full max-w-2xl items-center space-y-12 relative py-8">
        {lessons.map((challenge, idx) => {
          const offset = idx % 2 === 0 ? 'translate-x-16' : '-translate-x-16'

          return (
            <div className={`w-auto transform ${offset}`} key={challenge.id}>
              <LessonButton
                challenge={challenge}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}