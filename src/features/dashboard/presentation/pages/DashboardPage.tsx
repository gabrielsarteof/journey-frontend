import { useMemo } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { UnitBanner } from '../components/UnitBanner'
import { UnitPath } from '../components/UnitPath'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import { Challenge } from '../../domain/entities/Challenge'
import { ChallengeStatus } from '../../domain/value-objects/ChallengeStatus'
import { ChallengeType } from '../../domain/value-objects/ChallengeType'
import { PlanetAssetCatalog } from '../../infrastructure/repositories/PlanetAssetCatalog'
import { useModules } from '../hooks/useModules'

export function DashboardPage() {
  const { modules, isLoading, error } = useModules()

  const startChallenge = useMemo(
    () =>
      Challenge.create({
        id: 'start',
        title: 'Iniciar Jornada',
        type: ChallengeType.lesson(),
        status: ChallengeStatus.available(),
        planetAsset: PlanetAssetCatalog.getAsset('earth'),
        orderIndex: 0,
        points: 0,
      }),
    []
  )

  const handleChallengeClick = (challenge: Challenge) => {
    if (challenge.canBeStarted()) {
      // Navegação para challenge será implementada
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    )
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
        <div className="w-full flex justify-center py-8 lg:py-12 px-4">
          <UnitBanner
            unitNumber={currentModule.orderIndex}
            title={currentModule.title}
            description={currentModule.description}
            moduleSlug={currentModule.slug}
          />
        </div>

        <div className="flex flex-col items-center mb-12 lg:mb-16">
          <p className="text-primary font-bold text-sm uppercase tracking-wider mb-4">COMEÇAR</p>
          <button
            onClick={() => handleChallengeClick(startChallenge)}
            className="w-24 h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center overflow-hidden hover:brightness-110 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:outline-none relative"
          >
            <img
              src={startChallenge.planetAsset.path}
              alt={startChallenge.planetAsset.altText}
              className="w-full h-full object-cover"
            />
          </button>
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
