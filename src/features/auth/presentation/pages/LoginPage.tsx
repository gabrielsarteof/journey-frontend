import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Input } from '../../../../shared/components/ui/Input'
import { Button } from '../../../../shared/components/ui/Button'
import { FormErrorMessage } from '../../../../shared/components/ui/FormErrorMessage'
import { useAuth } from '../../application/hooks/useAuth'
import { LoginSchema } from '../../domain/schemas/AuthSchemas'
import type { LoginDTO } from '../../domain/schemas/AuthSchemas'
import { useDocumentTitle } from '../../../../shared/hooks/useDocumentTitle'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuth()

  // Define o título da página como "Login | Journey"
  useDocumentTitle('Login')
  const [formData, setFormData] = useState<LoginDTO>({
    email: '',
    password: ''
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof LoginDTO) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = LoginSchema.safeParse(formData)
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.error.issues.forEach(issue => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message
        }
      })
      setValidationErrors(errors)
      return
    }

    try {
      await login(formData)
      navigate({ to: '/' })
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  const handleButtonClick = async () => {
    const validation = LoginSchema.safeParse(formData)
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.error.issues.forEach(issue => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message
        }
      })
      setValidationErrors(errors)
      return
    }

    try {
      await login(formData)
      navigate({ to: '/' })
    } catch (err) {
      console.error('Login error:', err)
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
            Continue de onde você parou
          </h1>
        </header>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <Input
            type="email"
            placeholder="Email ou nome de usuário"
            value={formData.email}
            onChange={handleChange('email')}
            required
          />

          <Input
            type="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange('password')}
            showForgotPassword={true}
            onForgotPassword={() => {}}
            required
          />

          {error && <FormErrorMessage message={error} />}

          <Button
            onClick={handleButtonClick}
            variant="primary"
            size="lg"
            loading={isLoading}
            type="submit"
            className="!mt-6"
            enableThrottle={true}
            throttleDelay={2000}
          >
            {isLoading ? "ENTRANDO..." : "ENTRAR"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-divider transition-colors"></div>
          <span className="text-sm font-medium text-divider uppercase tracking-wide transition-colors">OU</span>
          <div className="flex-1 h-px bg-divider transition-colors"></div>
        </div>

        {/* Register Button */}
        <div style={{ boxShadow: '0 5px 0 #d1d5db' }} className="rounded-2xl mb-6">
          <Button
            onClick={() => navigate({ to: '/auth/register' })}
            variant="secondary"
            size="lg"
          >
            CRIAR CONTA
          </Button>
        </div>

        {/* Terms Footer */}
        <footer className="text-center">
          <p className="text-sm text-gray-500 leading-relaxed">
            Ao entrar no Journey, você concorda com nossos Termos e Política de Privacidade.
          </p>
        </footer>
      </div>
    </div>
  )
}