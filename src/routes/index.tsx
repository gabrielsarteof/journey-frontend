import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '../features/auth/presentation/pages'

export const Route = createFileRoute('/')({
  component: LandingPage,
})