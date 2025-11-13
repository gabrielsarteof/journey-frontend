/**
 * FormErrorMessage - Componente de Erro de Formulário
 *
 * Componente minimalista para exibir mensagens de erro em formulários
 * Segue princípios de design limpo e focado
 *
 * @pattern Presentation Component
 * @layer Shared/UI
 */

interface FormErrorMessageProps {
  message: string
  className?: string
}

export function FormErrorMessage({ message, className = '' }: FormErrorMessageProps) {
  if (!message) return null

  return (
    <p className={`text-base text-error transition-colors ${className}`}>
      {message}
    </p>
  )
}
