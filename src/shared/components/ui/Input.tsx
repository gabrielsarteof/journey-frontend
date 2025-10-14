import { useState, useCallback } from 'react'
import { clsx } from 'clsx'
import { usePerformanceOptimization } from '../../performance/presentation/hooks/usePerformanceOptimization'
import { PerformanceConfig } from '../../performance/domain/value-objects/PerformanceConfig'
import { PerformanceStrategy } from '../../performance/domain/entities/PerformanceStrategy'

interface InputProps {
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  hasError?: boolean
  required?: boolean
  className?: string
  showForgotPassword?: boolean
  onForgotPassword?: () => void
  helperText?: string
  // Performance optimization props
  enableDebouncedValidation?: boolean
  validationDelay?: number
  onDebouncedChange?: (value: string) => void
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  hasError = false,
  required = false,
  className,
  showForgotPassword = false,
  onForgotPassword,
  helperText,
  enableDebouncedValidation = false,
  validationDelay = 300,
  onDebouncedChange
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === 'password' && showPassword ? 'text' : type

  // Strategy Pattern para validação debounced opcional
  const debouncedValidation = useCallback((inputValue: string) => {
    if (onDebouncedChange) {
      onDebouncedChange(inputValue)
    }
  }, [onDebouncedChange])

  const validationConfig = PerformanceConfig.create({ delay: validationDelay })
  const validationStrategy = PerformanceStrategy.createDebounce('input-validation', validationConfig)

  const { optimizedFn: debouncedValidateInput } = usePerformanceOptimization(
    debouncedValidation,
    {
      strategy: validationStrategy.type,
      delay: validationStrategy.config.delay
    }
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange(e)

    // Aplicação condicional do debounce para validação
    if (enableDebouncedValidation) {
      debouncedValidateInput(inputValue)
    }
  }

  const baseClasses = clsx(
    'w-full bg-input border-2 rounded-2xl px-4 py-3 sm:px-5 sm:py-4',
    'text-sm sm:text-base',
    'focus:outline-none transition-all duration-200',
    {
      // Estado normal
      'border-input text-input placeholder-input': !hasError,
      'focus:border-input-focus': !hasError,
      // Estado de erro - apenas borda e texto mudam (usando variáveis CSS do tema)
      'border-journeyIncorrectRed focus:border-journeyIncorrectRed': hasError,
      'text-error placeholder-error': hasError,
    }
  )

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onBlur={onBlur}
          required={required}
          className={clsx(baseClasses, className)}
        />

        {type === 'password' && (
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
        )}
      </div>

      {showForgotPassword && type === 'password' && (
        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-link hover:underline uppercase transition-colors"
          >
            Esqueceu a senha?
          </button>
        </div>
      )}

      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  )
}