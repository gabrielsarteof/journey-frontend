import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { UnitBanner } from '../components/UnitBanner'
import { UnitPath } from '../components/UnitPath'
import { StickyUnitHeader } from '../components/StickyUnitHeader'

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
  const [visibleUnit, setVisibleUnit] = useState(mockUnits[0])
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const unitRefs = useRef<(HTMLDivElement | null)[]>([])
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -60% 0px', // Detecta quando está próximo ao topo
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const unitIndex = unitRefs.current.indexOf(entry.target as HTMLDivElement)
          if (unitIndex !== -1) {
            setVisibleUnit(mockUnits[unitIndex])
          }
        }
      })
    }, observerOptions)

    // Observa cada unidade
    unitRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    // Observer para o banner (para mostrar/esconder o sticky header)
    const bannerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShowStickyHeader(!entry.isIntersecting)
        })
      },
      { threshold: 0 }
    )

    if (bannerRef.current) {
      bannerObserver.observe(bannerRef.current)
    }

    return () => {
      observer.disconnect()
      bannerObserver.disconnect()
    }
  }, [])

  return (
    <DashboardLayout>
      {/* Header Sticky */}
      <StickyUnitHeader
        unitNumber={visibleUnit.orderIndex}
        title={visibleUnit.title}
        color={visibleUnit.color}
        isVisible={showStickyHeader}
      />

      <div className="w-full h-full pb-20 lg:pb-0 bg-duoBackground overflow-y-auto">
        {/* Banner da unidade atual */}
        <div ref={bannerRef} className="w-full flex justify-center py-6">
          <UnitBanner
            unitNumber={currentUnit.orderIndex}
            title={currentUnit.title}
            color={currentUnit.color}
          />
        </div>

        {/* Caminho de unidades e lições */}
        <div className="w-full flex flex-col items-center">
          {mockUnits.map((unit, index) => (
            <div
              key={unit.id}
              ref={(el) => (unitRefs.current[index] = el)}
            >
              <UnitPath
                unitNumber={unit.orderIndex}
                title={unit.title}
                color={unit.color}
                lessons={unit.lessons}
                showBreak={index > 0}
              />
            </div>
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
