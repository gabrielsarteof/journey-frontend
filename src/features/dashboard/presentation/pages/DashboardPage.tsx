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
