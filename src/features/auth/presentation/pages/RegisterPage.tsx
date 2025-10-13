import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
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
  const baseClasses = `
    w-full bg-input border-2 border-input rounded-2xl px-4 py-3 sm:px-5 sm:py-4 pr-12
    text-sm sm:text-base
    focus:outline-none focus:border-input-focus transition-all duration-200
    text-input placeholder-input
    ${hasError
      ? 'border-journeyIncorrectRed focus:border-journeyIncorrectRed text-journeyIncorrectRed placeholder-journeyIncorrectRed'
      : ''}
  `

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
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 sm:p-4 animate-in slide-in-from-top-2 duration-200"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Sua senha deve conter:</p>
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
          <div className="space-y-1 sm:space-y-2">
            {criteria.map((criterion) => {
              const isValid = criterion.test(value)
              return (
                <div key={criterion.id} className="flex items-center space-x-2 py-1 px-2 -mx-2 rounded hover:bg-gray-50 transition-colors">
                  <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isValid ? 'bg-green-500 scale-110' : 'bg-gray-300'
                  }`}>
                    {isValid ? (
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-xs sm:text-sm transition-all duration-300 ${
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
  const { register, isLoading, error } = useAuth()

  // Define o título da página como "Cadastro | Journey"
  useDocumentTitle('Cadastro')

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Validação debounced para campos do formulário
  const validateField = useCallback((field: keyof RegisterFormData, value: string | boolean) => {
    const partialData = { ...formData, [field]: value }

    // Validação específica para confirmPassword
    if (field === 'confirmPassword' && partialData.password !== value) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: 'As senhas não coincidem' }))
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
    if (validation.success) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    } else {
      const fieldError = validation.error.issues.find(issue => issue.path[0] === field)
      if (fieldError) {
        setValidationErrors(prev => ({ ...prev, [field]: fieldError.message }))
      }
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

    // Aplicação do Strategy Pattern com debounce otimizado
    debouncedValidateField(field, value)
  }

  const handleInputChange = (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'acceptTerms' ? e.target.checked : e.target.value
    handleChange(field)(value)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem'
    }

    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      acceptTerms: formData.acceptTerms
    }

    const validation = RegisterSchema.safeParse(registerData)
    if (!validation.success) {
      validation.error.issues.forEach(issue => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message
        }
      })
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      navigate({ to: '/' })
    } catch (err) {
      console.error('Register error:', err)
    }
  }

  const handleButtonClick = async () => {
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
      navigate({ to: '/' })
    } catch (err) {
      console.error('Register error:', err)
    }
  }

  const handleClose = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer z-10"
        aria-label="Fechar"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 2L14 14M14 2L2 14" stroke="#B1B1B1" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Main Content Container */}
      <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-auth-heading text-center leading-tight transition-colors">
            Crie sua conta
          </h1>
        </header>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <Input
            type="text"
            placeholder="Nome completo"
            value={formData.name}
            onChange={handleInputChange('name')}
            hasError={!!validationErrors.name}
            required
          />

          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange('email')}
            hasError={!!validationErrors.email}
            required
          />

          <PasswordInput
            value={formData.password}
            onChange={handleChange('password')}
            onBlur={() => {}}
            hasError={!!validationErrors.password}
          />

          <Input
            type="password"
            placeholder="Confirmar senha"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            hasError={!!validationErrors.confirmPassword}
            required
          />

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange('acceptTerms')}
              className="mt-0.5 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-600 leading-relaxed">
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
            <p className="text-xs text-red-600 ml-7">
              {validationErrors.acceptTerms}
            </p>
          )}

          {error && <FormErrorMessage message={error} />}

          <Button
            onClick={handleButtonClick}
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={!formData.acceptTerms}
            type="submit"
            className="!mt-6"
            enableThrottle={true}
            throttleDelay={2000}
          >
            {isLoading ? "CRIANDO CONTA..." : "CRIAR CONTA"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-divider transition-colors"></div>
          <span className="text-sm font-medium text-divider uppercase tracking-wide transition-colors">OU</span>
          <div className="flex-1 h-px bg-divider transition-colors"></div>
        </div>

        {/* Login Button */}
        <div style={{ boxShadow: '0 5px 0 #d1d5db' }} className="rounded-2xl mb-6">
          <Button
            onClick={() => navigate({ to: '/auth/login' })}
            variant="secondary"
            size="lg"
          >
            FAZER LOGIN
          </Button>
        </div>

        {/* Terms Footer */}
        <footer className="text-center">
          <p className="text-sm text-gray-500 leading-relaxed">
            Ao se cadastrar no Journey, você concorda com nossos Termos e Política de Privacidade.
          </p>
        </footer>
      </div>
    </div>
  )
}