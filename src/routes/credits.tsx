import { createFileRoute } from '@tanstack/react-router'
import { CreditsPage } from '../shared/presentation/pages/CreditsPage'

export const Route = createFileRoute('/credits')({
  component: CreditsPage,
})
