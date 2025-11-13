import { DashboardLayout } from '../layouts/DashboardLayout'
import { UnitBanner } from '../components/UnitBanner'
import { UnitPath } from '../components/UnitPath'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import { useModules } from '../hooks/useModules'

export function DashboardPage() {
  const { modules, isLoading, error } = useModules()

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

  const currentModule = modules[0]

  return (
    <DashboardLayout>
      <div className="w-full h-full bg-background overflow-y-auto transition-colors">
        <div className="w-full flex justify-center py-6 lg:py-8 px-4">
          <UnitBanner
            unitNumber={currentModule.orderIndex}
            title={currentModule.title}
            description={currentModule.description}
            moduleSlug={currentModule.slug}
          />
        </div>

        <div className="w-full flex flex-col items-center px-4 lg:px-0">
          {modules.map((module, index) => (
            <UnitPath
              key={module.id}
              unitNumber={module.orderIndex}
              title={module.title}
              moduleSlug={module.slug}
              lessons={module.challenges}
              showBreak={index > 0}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
