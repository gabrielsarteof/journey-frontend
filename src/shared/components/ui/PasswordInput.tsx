import { useState, useMemo } from 'react'
import { FormErrorMessage } from './FormErrorMessage'

/**
 * Wrapper inteligente para input de senha com indicadores de força
 *
 * Benefícios:
 * - Feedback visual em tempo real sobre requisitos de senha
 * - Reutilizável em formulários de registro e alteração de senha
 * - Performance otimizada com useMemo para cálculos
 * - Segue mesmo padrão de composição do ValidatedInput
 *
 * Princípios SOLID:
 * - SRP: Responsável apenas por composição visual de senha + feedback
 * - OCP: Extensível via props sem modificar o componente
 * - LSP: Pode substituir Input de senha sem quebrar código
 */

interface PasswordInputProps {
  value: string
  onChange: (eventOrValue: React.ChangeEvent<HTMLInputElement> | string) => void
  onBlur?: () => void
  placeholder?: string
  error?: string
  showStrengthIndicator?: boolean
  required?: boolean
  className?: string
}

interface PasswordCriterion {
  id: string
  label: string
  test: (pwd: string) => boolean
}

export function PasswordInput({
  value,
  onChange,
  onBlur,
  placeholder = 'Senha',
  error,
  showStrengthIndicator = true,
  required = false,
  className = ''
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Critérios de validação (estáveis, não causam re-render)
  const criteria: PasswordCriterion[] = useMemo(() => [
    { id: 'length', label: 'Mínimo 8 caracteres', test: (pwd: string) => pwd.length >= 8 },
    { id: 'uppercase', label: 'Uma letra maiúscula', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { id: 'lowercase', label: 'Uma letra minúscula', test: (pwd: string) => /[a-z]/.test(pwd) },
    { id: 'number', label: 'Um número', test: (pwd: string) => /\d/.test(pwd) },
    { id: 'special', label: 'Um caractere especial', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ], [])

  // Cálculos memoizados
  const validCriteria = useMemo(() =>
    criteria.filter(c => c.test(value)),
    [criteria, value]
  )

  const strengthPercentage = useMemo(() =>
    (validCriteria.length / criteria.length) * 100,
    [validCriteria.length, criteria.length]
  )

  const inputType = showPassword ? 'text' : 'password'

  // Classes com estado de erro
  const baseClasses = error
    ? 'w-full border-2 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 pr-12 text-sm sm:text-base focus:outline-none transition-all duration-200 bg-red-50 dark:bg-red-900/20 border-journeyIncorrectRed focus:border-journeyIncorrectRed text-journeyIncorrectRed placeholder-red-400 dark:placeholder-red-500'
    : 'w-full bg-input border-2 border-input rounded-2xl px-4 py-3 sm:px-5 sm:py-4 pr-12 text-sm sm:text-base focus:outline-none focus:border-input-focus transition-all duration-200 text-input placeholder-input'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Suporta tanto passar o evento completo quanto apenas o valor
    onChange(e)
  }

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150)
    onBlur?.()
  }

  return (
    <div className={className}>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => showStrengthIndicator && setShowDropdown(true)}
          onBlur={handleBlur}
          className={baseClasses}
          required={required}
        />

        {/* Botão toggle de visibilidade */}
        <button
          type="button"
          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
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

        {/* Dropdown de indicadores de força */}
        {showStrengthIndicator && showDropdown && (
          <div
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2.5 sm:p-3 animate-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Sua senha deve conter:</p>
              <div className="flex items-center space-x-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {validCriteria.length}/{criteria.length}
                </div>
                <div className="w-8 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
                  <div key={criterion.id} className="flex items-center space-x-2 py-0.5 px-1.5 -mx-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className={`flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isValid ? 'bg-green-500 scale-110' : 'bg-gray-300 dark:bg-gray-600'
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
                      isValid ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'
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

      {error && <FormErrorMessage message={error} />}
    </div>
  )
}
