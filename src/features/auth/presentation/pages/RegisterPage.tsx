import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Input } from '../../../../shared/components/ui/Input'
import { Button } from '../../../../shared/components/ui/Button'
import { FormErrorMessage } from '../../../../shared/components/ui/FormErrorMessage'
import { useAuth } from '../../application/hooks/useAuth'
import { RegisterSchema } from '../../domain/schemas/AuthSchemas'
import type { RegisterDTO } from '../../domain/schemas/AuthSchemas'
import { usePerformanceOptimization } from '../../../../shared/performance/presentation/hooks/usePerformanceOptimization'
import { PerformanceConfig } from '../../../../shared/performance/domain/value-objects/PerformanceConfig'
import { PerformanceStrategy } from '../../../../shared/performance/domain/entities/PerformanceStrategy'
import { useDocumentTitle } from '../../../../shared/hooks/useDocumentTitle'

interface RegisterFormData extends RegisterDTO {
  confirmPassword: string
}

// Componente PasswordInput com otimizações de performance
const PasswordInput = ({ value, onChange, onBlur, hasError = false }: {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  hasError?: boolean
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Throttle para atualizações de UI intensivas (indicadores visuais)
  const uiConfig = PerformanceConfig.create({ delay: 100 })
  const uiStrategy = PerformanceStrategy.createThrottle('password-ui', uiConfig)

  const updatePasswordIndicators = useCallback(() => {
    // Force re-render for password strength indicators
    return value
  }, [value])

  const { optimizedFn: throttledUpdateIndicators } = usePerformanceOptimization(
    updatePasswordIndicators,
    {
      strategy: uiStrategy.type,
      delay: uiStrategy.config.delay
    }
  )

  // Memoização para cálculos pesados de critérios de senha
  const criteria = useMemo(() => [
    { id: 'length', label: 'Mínimo 8 caracteres', test: (pwd: string) => pwd.length >= 8 },
    { id: 'uppercase', label: 'Uma letra maiúscula', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { id: 'lowercase', label: 'Uma letra minúscula', test: (pwd: string) => /[a-z]/.test(pwd) },
    { id: 'number', label: 'Um número', test: (pwd: string) => /\d/.test(pwd) },
    { id: 'special', label: 'Um caractere especial', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ], [])

  // Memoização da validação de critérios para evitar recálculos
  const validCriteria = useMemo(() =>
    criteria.filter(c => c.test(value)),
    [criteria, value]
  )

  const strengthPercentage = useMemo(() =>
    (validCriteria.length / criteria.length) * 100,
    [validCriteria.length, criteria.length]
  )

  const inputType = showPassword ? 'text' : 'password'

  // Classes com estado de erro adaptadas para tema claro e escuro
  const baseClasses = hasError
    ? 'w-full border-2 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 pr-12 text-sm sm:text-base focus:outline-none transition-all duration-200 bg-red-50 dark:bg-red-900/20 border-journeyIncorrectRed focus:border-journeyIncorrectRed text-journeyIncorrectRed placeholder-red-400 dark:placeholder-red-500'
    : 'w-full bg-input border-2 border-input rounded-2xl px-4 py-3 sm:px-5 sm:py-4 pr-12 text-sm sm:text-base focus:outline-none focus:border-input-focus transition-all duration-200 text-input placeholder-input'

  return (
    <div className="relative">
      <div className="relative">
        <input
          type={inputType}
          placeholder="Senha"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            // Throttle nas atualizações visuais para performance
            throttledUpdateIndicators()
          }}
          onFocus={() => {
            setShowDropdown(true)
          }}
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 150)
            onBlur()
          }}
          className={baseClasses}
          required
        />

        <button
          type="button"
          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 sm:p-3 animate-in slide-in-from-top-2 duration-200"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-gray-700">Sua senha deve conter:</p>
            <div className="flex items-center space-x-1">
              <div className="text-xs text-gray-500">
                {validCriteria.length}/{criteria.length}
              </div>
              <div className="w-8 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                  style={{ width: `${strengthPercentage}%` }}
                />
              </div>
            </div>
          </div>
          <div className="space-y-0.5">
            {criteria.map((criterion) => {
              const isValid = criterion.test(value)
              return (
                <div key={criterion.id} className="flex items-center space-x-2 py-0.5 px-1.5 -mx-1.5 rounded hover:bg-gray-50 transition-colors">
                  <div className={`flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isValid ? 'bg-green-500 scale-110' : 'bg-gray-300'
                  }`}>
                    {isValid ? (
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-xs transition-all duration-300 ${
                    isValid ? 'text-green-600 font-medium' : 'text-gray-600'
                  }`}>
                    {criterion.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/auth/register' })
  const { register, isLoading, error, clearError } = useAuth()

  const redirectUrl = (search as any)?.redirect || '/dashboard'

  useDocumentTitle('Cadastro')

  useEffect(() => {
    clearError()
  }, [])

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})

  // Valida um campo específico apenas se foi tocado
  const validateField = useCallback((field: keyof RegisterFormData, value: string | boolean, isTouched: boolean = true) => {
    // Não valida se o campo não foi tocado ainda
    if (!isTouched) {
      return
    }

    const partialData = { ...formData, [field]: value }

    // Se o campo está vazio e foi tocado, remove o erro (deixa o usuário digitar)
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
      return
    }

    // Validação específica para confirmPassword
    if (field === 'confirmPassword') {
      if (partialData.password && partialData.password !== value) {
        setValidationErrors(prev => ({ ...prev, confirmPassword: 'As senhas não coincidem' }))
      } else {
        setValidationErrors(prev => ({ ...prev, confirmPassword: '' }))
      }
      return
    }

    // Validação com schema principal
    const registerData = {
      name: partialData.name,
      email: partialData.email,
      password: partialData.password,
      confirmPassword: partialData.confirmPassword,
      acceptTerms: partialData.acceptTerms
    }

    const validation = RegisterSchema.safeParse(registerData)
    const fieldError = validation.error?.issues.find(issue => issue.path[0] === field)

    if (fieldError) {
      setValidationErrors(prev => ({ ...prev, [field]: fieldError.message }))
    } else {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
  }, [formData])

  // Strategy Pattern aplicado à validação com debounce
  const formValidationConfig = PerformanceConfig.create({ delay: 600 })
  const formValidationStrategy = PerformanceStrategy.createDebounce('register-validation', formValidationConfig)

  const { optimizedFn: debouncedValidateField } = usePerformanceOptimization(
    validateField,
    {
      strategy: formValidationStrategy.type,
      delay: formValidationStrategy.config.delay
    }
  )

  const handleChange = (field: keyof RegisterFormData) => (value: string | boolean) => {
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

  const handleInputChange = (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'acceptTerms' ? e.target.checked : e.target.value
    handleChange(field)(value)
  }

  const handleBlur = (field: keyof RegisterFormData) => () => {
    // Marca o campo como tocado ao sair dele
    setTouchedFields(prev => ({ ...prev, [field]: true }))

    // Valida imediatamente ao sair do campo
    validateField(field, formData[field], true)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      acceptTerms: formData.acceptTerms
    }

    // Valida com o schema
    const validation = RegisterSchema.safeParse(registerData)
    if (!validation.success) {
      validation.error.issues.forEach(issue => {
        const fieldName = issue.path[0] as string
        // Apenas adiciona o primeiro erro de cada campo
        if (fieldName && !errors[fieldName]) {
          errors[fieldName] = issue.message
        }
      })
    }

    // Validação específica de confirmPassword (após validações do schema)
    if (!errors.confirmPassword && !errors.password) {
      if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem'
      }
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setTouchedFields({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true
    })

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      const registerData: RegisterDTO = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.acceptTerms
      }

      await register(registerData)

      // Aguarda persistência do estado no localStorage via Zustand middleware
      await new Promise(resolve => setTimeout(resolve, 100))

      navigate({ to: redirectUrl as any })
    } catch (err) {
      console.error('Register error:', err)
    }
  }

  const handleButtonClick = async () => {
    setTouchedFields({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true
    })

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      const registerData: RegisterDTO = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.acceptTerms
      }

      await register(registerData)

      // Aguarda persistência do estado no localStorage via Zustand middleware
      await new Promise(resolve => setTimeout(resolve, 100))

      navigate({ to: redirectUrl as any })
    } catch (err) {
      console.error('Register error:', err)
    }
  }

  const handleClose = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      {/* Close Button - Fixed position */}
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
      <header className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-auth-heading text-center leading-tight transition-colors">
          Crie sua conta
        </h1>
      </header>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mb-5">
        <Input
          type="text"
          placeholder="Nome completo"
          value={formData.name}
          onChange={handleInputChange('name')}
          onBlur={handleBlur('name')}
          hasError={!!validationErrors.name}
          required
        />
        {validationErrors.name && (
          <FormErrorMessage message={validationErrors.name} />
        )}

        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange('email')}
          onBlur={handleBlur('email')}
          hasError={!!validationErrors.email}
          required
        />
        {validationErrors.email && (
          <FormErrorMessage message={validationErrors.email} />
        )}

        <PasswordInput
          value={formData.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          hasError={!!validationErrors.password}
        />
        {validationErrors.password && (
          <FormErrorMessage message={validationErrors.password} />
        )}

        <Input
          type="password"
          placeholder="Confirmar senha"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          hasError={!!validationErrors.confirmPassword}
          required
        />
        {validationErrors.confirmPassword && (
          <FormErrorMessage message={validationErrors.confirmPassword} />
        )}

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange('acceptTerms')}
            className="mt-0.5 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
          />
          <label htmlFor="acceptTerms" className="text-xs sm:text-sm text-gray-600 leading-snug">
            Eu aceito os{' '}
            <a href="/terms" target="_blank" className="text-link hover:underline transition-colors">
              Termos de Uso
            </a>{' '}
            e a{' '}
            <a href="/privacy" target="_blank" className="text-link hover:underline transition-colors">
              Política de Privacidade
            </a>
            <span className="text-red-500 ml-1">*</span>
          </label>
        </div>
        {validationErrors.acceptTerms && (
          <FormErrorMessage message={validationErrors.acceptTerms} />
        )}

        <Button
          onClick={handleButtonClick}
          variant="primary"
          size="lg"
          loading={isLoading}
          disabled={!formData.acceptTerms}
          type="submit"
          className="!mt-4"
          enableThrottle={true}
          throttleDelay={2000}
        >
          {isLoading ? "CRIANDO CONTA..." : "CRIAR CONTA"}
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

      {/* Login Button */}
      <div style={{ boxShadow: '0 5px 0 #d1d5db' }} className="rounded-2xl mb-4 sm:mb-6">
        <Button
          onClick={() => navigate({ to: '/auth/login' })}
          variant="secondary"
          size="lg"
        >
          FAZER LOGIN
        </Button>
      </div>

      {/* Terms Footer */}
      <footer className="text-center px-2">
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed transition-colors">
          Ao se cadastrar no Journey, você concorda com nossos Termos e Política de Privacidade.
        </p>
      </footer>
    </div>
  )
}