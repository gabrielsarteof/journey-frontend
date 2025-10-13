import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '../features/dashboard/presentation/pages'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})
