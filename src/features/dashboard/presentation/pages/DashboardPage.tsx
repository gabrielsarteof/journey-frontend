import { useRef, useMemo } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { UnitBanner } from '../components/UnitBanner'
import { UnitPath } from '../components/UnitPath'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import { useModules } from '../hooks/useModules'
import { useModuleVisibility } from '../hooks/useModuleVisibility'

export function DashboardPage() {
  const { modules, isLoading, error } = useModules()

  // Create refs for each module
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([])

  // Initialize refs array based on modules length
  useMemo(() => {
    moduleRefs.current = moduleRefs.current.slice(0, modules.length)
  }, [modules.length])

  // Convert to RefObjects for the hook
  const refObjects = useMemo(() => {
    return modules.map((_, index) => ({
      current: moduleRefs.current[index]
    }))
  }, [modules])

  const { visibleModuleIndex } = useModuleVisibility(refObjects)

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">Erro ao carregar módulos</p>
            <p className="text-sm text-muted">{error.message}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (modules.length === 0) {
    return (
      <DashboardLayout>
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted">Nenhum módulo disponível</p>
        </div>
      </DashboardLayout>
    )
  }

  const visibleModule = modules[visibleModuleIndex] || modules[0]

  return (
    <DashboardLayout>
      <div className="w-full h-full bg-background overflow-y-auto transition-colors">
        {/* Sticky Module Banner - muda conforme módulo visível */}
        <div className="w-full flex justify-center py-6 lg:py-8 px-4">
          <UnitBanner
            unitNumber={visibleModule.orderIndex}
            title={visibleModule.title}
            description={visibleModule.description}
            moduleSlug={visibleModule.slug}
            themeColor={visibleModule.theme.getColor()}
            themeGradient={visibleModule.theme.getGradient()}
            isSticky
          />
        </div>

        {/* Module Paths */}
        <div className="w-full flex flex-col items-center px-4 lg:px-0">
          {modules.map((module, index) => (
            <div
              key={module.id}
              ref={(el) => (moduleRefs.current[index] = el)}
            >
              <UnitPath
                unitNumber={module.orderIndex}
                title={module.title}
                moduleSlug={module.slug}
                lessons={module.challenges}
                showBreak={index > 0}
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
