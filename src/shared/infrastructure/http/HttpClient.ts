import { HttpClient } from '@/shared/http/HttpClient'
import { env } from '@/shared/config/env'
import { ZustandAuthTokenProvider } from '@/features/auth/infrastructure/services/ZustandAuthTokenProvider'
import { useAuthStore } from '@/features/auth/application/stores/authStore'

/**
 * Instância singleton do HttpClient configurada para toda aplicação.
 *
 * ZustandAuthTokenProvider é injetado para fornecer tokens diretamente do store,
 * evitando problemas de closure ao acessar localStorage no momento da criação do módulo.
 */
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`

const tokenProvider = new ZustandAuthTokenProvider(useAuthStore)

export const httpClient = new HttpClient({
  baseUrl: apiUrl,
  enableLogging: import.meta.env.VITE_DEBUG_MODE === 'true',
  tokenProvider,
})
