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
