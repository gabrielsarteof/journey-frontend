import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '../../features/auth/presentation/pages'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})