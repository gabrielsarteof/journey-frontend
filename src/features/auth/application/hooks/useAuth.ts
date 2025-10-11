import { useAuthStore } from '../stores/authStore'
import type { LoginDTO, RegisterDTO } from '../../domain/schemas/AuthSchemas'
import { useAuthWithCache } from '../../infrastructure/setup/AuthSetup'
import { DomainValidationServiceFactory } from '@/shared/domain/validation/DomainValidationService'
import { AuthErrorMapper } from '../../domain/mappers/AuthErrorMapper'

export const useAuth = () => {
  const {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    error,
    logout,
    getCurrentUser,
    setError,
    clearError,
  } = useAuthStore()

  const { loginWithCache, registerWithValidation, getCachedUser } = useAuthWithCache()

  // Validação local sem async checks para feedback em tempo real
  const validateFormData = async (data: LoginDTO | RegisterDTO) => {
    const validationService = DomainValidationServiceFactory.createLocal()

    if ('acceptTerms' in data) {
      // RegisterDTO
      return await validationService.validateUserRegistration(data as any)
    } else {
      // LoginDTO
      return await validationService.validateUserLogin(data as LoginDTO)
    }
  }

  const handleLogin = async (data: LoginDTO) => {
    try {
      // Validação local primeiro para feedback rápido
      const validation = await validateFormData(data)
      if (!validation.isValid) {
        const errorMessage = validation.errors.map(e => e.message).join(', ')
        setError(errorMessage)
        return
      }

      // Login com cache e rate limiting
      await loginWithCache(data)
    } catch (error) {
      console.error('Login error:', error)

      // Mapeia o erro usando AuthErrorMapper para obter mensagem em português
      const domainError = AuthErrorMapper.toDomain(error)
      const errorMessage = domainError.getDisplayMessage()

      setError(errorMessage)
      throw error
    }
  }

  const handleRegister = async (data: RegisterDTO) => {
    try {
      // Validação completa com async checks
      await registerWithValidation(data)
    } catch (error) {
      console.error('Register error:', error)

      // Mapeia o erro usando AuthErrorMapper para obter mensagem em português
      const domainError = AuthErrorMapper.toDomain(error)
      const errorMessage = domainError.getDisplayMessage()

      setError(errorMessage)
      throw error
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const refreshUserData = async () => {
    if (isAuthenticated && user) {
      // Tenta cache primeiro
      const cachedUser = await getCachedUser(user.id.getValue())
      if (cachedUser) {
        return cachedUser
      }

      // Fallback para API
      await getCurrentUser()
    }
  }

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUserData,
    setError,
    clearError,
    validateFormData, // Exposição da validação para uso em formulários
  }
}