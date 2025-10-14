import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Input } from '../../../../shared/components/ui/Input'
import { Button } from '../../../../shared/components/ui/Button'
import { FormErrorMessage } from '../../../../shared/components/ui/FormErrorMessage'
import { useAuth } from '../../application/hooks/useAuth'
import { LoginSchema } from '../../domain/schemas/AuthSchemas'
import type { LoginDTO } from '../../domain/schemas/AuthSchemas'
import { usePerformanceOptimization } from '../../../../shared/performance/presentation/hooks/usePerformanceOptimization'
import { PerformanceConfig } from '../../../../shared/performance/domain/value-objects/PerformanceConfig'
import { PerformanceStrategy } from '../../../../shared/performance/domain/entities/PerformanceStrategy'
import { useDocumentTitle } from '../../../../shared/hooks/useDocumentTitle'

interface LoginFormData extends LoginDTO {}

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuth()

  useDocumentTitle('Login')

  // Limpa erros ao montar o componente
  useEffect(() => {
    clearError()
  }, [])

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})

  // Valida um campo específico apenas se foi tocado
  const validateField = useCallback((field: keyof LoginFormData, value: string, isTouched: boolean = true) => {
    // Não valida se o campo não foi tocado ainda
    if (!isTouched) {
      return
    }

    const partialData = { ...formData, [field]: value }

    // Se o campo está vazio e foi tocado, remove o erro (deixa o usuário digitar)
    if (!value || value.trim() === '') {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
      return
    }

    // Validação com schema principal
    const loginData: LoginDTO = {
      email: partialData.email,
      password: partialData.password
    }

    const validation = LoginSchema.safeParse(loginData)
    const fieldError = validation.error?.issues.find(issue => issue.path[0] === field)

    if (fieldError) {
      setValidationErrors(prev => ({ ...prev, [field]: fieldError.message }))
    } else {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
  }, [formData])

  // Strategy Pattern aplicado à validação com debounce
  const formValidationConfig = PerformanceConfig.create({ delay: 600 })
  const formValidationStrategy = PerformanceStrategy.createDebounce('login-validation', formValidationConfig)

  const { optimizedFn: debouncedValidateField } = usePerformanceOptimization(
    validateField,
    {
      strategy: formValidationStrategy.type,
      delay: formValidationStrategy.config.delay
    }
  )

  const handleChange = (field: keyof LoginFormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpa erro global do backend quando usuário interage
    if (error) {
      clearError()
    }

    // Validação com debounce apenas se o campo já foi tocado
    if (touchedFields[field]) {
      debouncedValidateField(field, value, true)
    }
  }

  const handleInputChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(field)(e.target.value)
  }

  const handleBlur = (field: keyof LoginFormData) => () => {
    // Marca o campo como tocado ao sair dele
    setTouchedFields(prev => ({ ...prev, [field]: true }))

    // Valida imediatamente ao sair do campo
    validateField(field, formData[field], true)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    const loginData: LoginDTO = {
      email: formData.email,
      password: formData.password
    }

    // Valida com o schema
    const validation = LoginSchema.safeParse(loginData)
    if (!validation.success) {
      validation.error.issues.forEach(issue => {
        const fieldName = issue.path[0] as string
        // Apenas adiciona o primeiro erro de cada campo
        if (fieldName && !errors[fieldName]) {
          errors[fieldName] = issue.message
        }
      })
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Marca todos os campos como tocados ao tentar submeter
    setTouchedFields({
      email: true,
      password: true
    })

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      const loginData: LoginDTO = {
        email: formData.email,
        password: formData.password
      }

      await login(loginData)
      navigate({ to: '/' })
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  const handleButtonClick = async () => {
    // Marca todos os campos como tocados ao tentar submeter
    setTouchedFields({
      email: true,
      password: true
    })

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      const loginData: LoginDTO = {
        email: formData.email,
        password: formData.password
      }

      await login(loginData)
      navigate({ to: '/' })
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  const handleClose = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer z-50"
        aria-label="Fechar"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-4 h-4 sm:w-5 sm:h-5">
          <path d="M2 2L14 14M14 2L2 14" stroke="#B1B1B1" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Header */}
      <header className="mb-8 sm:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-auth-heading text-center leading-tight transition-colors">
          Continue de onde você parou
        </h1>
      </header>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mb-5">
        <Input
          type="email"
          placeholder="Email ou nome de usuário"
          value={formData.email}
          onChange={handleInputChange('email')}
          onBlur={handleBlur('email')}
          hasError={!!validationErrors.email}
          required
        />
        {validationErrors.email && (
          <FormErrorMessage message={validationErrors.email} />
        )}

        <Input
          type="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleInputChange('password')}
          onBlur={handleBlur('password')}
          hasError={!!validationErrors.password}
          required
        />
        {validationErrors.password && (
          <FormErrorMessage message={validationErrors.password} />
        )}

        <Button
          onClick={handleButtonClick}
          variant="primary"
          size="lg"
          loading={isLoading}
          type="submit"
          className="!mt-4"
          enableThrottle={true}
          throttleDelay={2000}
        >
          {isLoading ? "ENTRANDO..." : "ENTRAR"}
        </Button>

        {error && (
          <FormErrorMessage message={error} />
        )}
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 sm:gap-4 my-4 sm:my-6">
        <div className="flex-1 h-px bg-divider transition-colors"></div>
        <span className="text-xs sm:text-sm font-medium text-divider uppercase tracking-wide transition-colors">OU</span>
        <div className="flex-1 h-px bg-divider transition-colors"></div>
      </div>

      {/* Register Button */}
      <div style={{ boxShadow: '0 5px 0 #d1d5db' }} className="rounded-2xl mb-4 sm:mb-6">
        <Button
          onClick={() => navigate({ to: '/auth/register' })}
          variant="secondary"
          size="lg"
        >
          CRIAR CONTA
        </Button>
      </div>

      {/* Terms Footer */}
      <footer className="text-center px-2">
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed transition-colors">
          Ao entrar no Journey, você concorda com nossos Termos e Política de Privacidade.
        </p>
      </footer>
    </div>
  )
}