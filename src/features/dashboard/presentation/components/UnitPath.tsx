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
