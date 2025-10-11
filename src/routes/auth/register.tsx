import { createFileRoute } from '@tanstack/react-router'
import { RegisterPage } from '../../features/auth/presentation/pages'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})