import { useState } from 'react'
import { FlameIcon, TargetIcon, GemIcon, TrophyIcon } from '@/shared/assets/icons'
import { useGamification } from '../hooks/useGamification'

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>
  value: string | number
  label?: string
  tooltip?: React.ReactNode
  color: string
  onClick?: () => void
}

function StatItem({ icon: Icon, value, label, tooltip, color, onClick }: StatItemProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className="relative flex gap-2 items-center group cursor-default"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={onClick}
    >
      <Icon className={`w-6 h-6 ${color} transition-transform group-hover:scale-110`} />
      <div className="flex flex-col">
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        {label && <p className="text-xs text-secondary">{label}</p>}
      </div>

      {tooltip && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-surface-elevated border-2 border-border-secondary rounded-lg shadow-lg z-50 min-w-max">
          <div className="text-sm text-primary whitespace-nowrap">
            {tooltip}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-8 border-transparent border-t-surface-elevated"></div>
          </div>
        </div>
      )}
    </div>
  )
}

function LoadingStats() {
  return (
    <div className="flex w-full justify-between items-center gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-2 items-center animate-pulse">
          <div className="w-6 h-6 bg-border-secondary rounded" />
          <div className="w-12 h-6 bg-border-secondary rounded" />
        </div>
      ))}
    </div>
  )
}

function ErrorStats({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex w-full justify-center items-center gap-2">
      <p className="text-sm text-secondary">Falha ao carregar estatísticas</p>
      <button
        onClick={onRetry}
        className="text-sm text-secondary hover:underline"
      >
        Tentar novamente
      </button>
    </div>
  )
}

export function UserStats() {
  const { stats, isLoading, error, refetch } = useGamification()

  if (isLoading) {
    return <LoadingStats />
  }

  if (error || !stats) {
    return <ErrorStats onRetry={refetch} />
  }

  const safePercentage = Math.min(Math.max(stats.dailyXPCompletionPercentage, 0), 100)
  const streakColor = stats.streakStatus === 'AT_RISK' ? 'text-error' : 'text-orange'

  return (
    <div className="flex w-full justify-between items-center gap-4">
      <StatItem
        icon={FlameIcon}
        value={stats.currentStreak}
        color={streakColor}
        tooltip={
          <div className="space-y-1">
            <p className="font-bold">
              {stats.streakStatus === 'ACTIVE' && `Sequência de ${stats.currentStreak} dias!`}
              {stats.streakStatus === 'AT_RISK' && 'Sequência em risco!'}
              {stats.streakStatus === 'BROKEN' && 'Sequência quebrada'}
            </p>
            <p className="text-secondary text-xs">Recorde: {stats.longestStreak} dias</p>
            <p className="text-secondary text-xs">
              Freezes: {stats.freezesAvailable}/2 disponíveis
            </p>
          </div>
        }
      />

      <StatItem
        icon={TargetIcon}
        value={`${Math.round(safePercentage)}%`}
        color={stats.dailyGoalCompleted ? 'text-success' : 'text-secondary'}
        tooltip={
          <div className="space-y-1">
            <p className="font-bold">Meta Diária</p>
            <p className="text-secondary text-xs">
              {stats.dailyXPEarned} / {stats.dailyXPTarget} XP
            </p>
            {stats.dailyGoalCompleted && (
              <p className="text-success text-xs">✓ Meta concluída!</p>
            )}
          </div>
        }
      />

      <StatItem
        icon={GemIcon}
        value={stats.totalXP.toLocaleString('pt-BR')}
        color="text-secondary"
        tooltip={
          <div className="space-y-1">
            <p className="font-bold">XP Total Acumulado</p>
            <p className="text-secondary text-xs">
              Ganho hoje: +{stats.xpGainedToday} XP
            </p>
          </div>
        }
      />

      <StatItem
        icon={TrophyIcon}
        value={`Nv ${stats.currentLevel}`}
        label={stats.levelTitle}
        color="text-gold"
        tooltip={
          <div className="space-y-2">
            <p className="font-bold">
              Nível {stats.currentLevel} - {stats.levelTitle}
            </p>
            <div className="space-y-1">
              <p className="text-secondary text-xs">
                Progresso para Nível {stats.currentLevel + 1}
              </p>
              <div className="w-40 h-2 bg-border-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all"
                  style={{ width: `${Math.min(stats.nextLevelProgress, 100)}%` }}
                />
              </div>
              <p className="text-secondary text-xs">
                {stats.totalXP.toLocaleString('pt-BR')} / {stats.nextLevelXP.toLocaleString('pt-BR')} XP ({Math.round(stats.nextLevelProgress)}%)
              </p>
            </div>
          </div>
        }
      />
    </div>
  )
}
