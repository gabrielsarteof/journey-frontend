import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { Button } from '../../../../shared/components/ui/Button'
import { useWindowEvents } from '../../../../shared/performance/presentation/hooks/useWindowEvents'
import { useDocumentTitle } from '../../../../shared/hooks/useDocumentTitle'
import { ThemedImage } from '../../../../shared/components/ui/ThemedImage'

interface LandingPageProps {
  heroImage?: string
}

export function LandingPage({ heroImage }: LandingPageProps) {
  const navigate = useNavigate()

  // Define o título da página como apenas "Journey"
  useDocumentTitle()

  // Performance optimization para resize events
  const handleResize = useCallback(() => {
    // Layout optimization on resize - pode ser usado para ajustes responsivos
  }, [])

  // Strategy Pattern aplicado a eventos de janela
  useWindowEvents({
    onResize: handleResize,
    enableResizeOptimization: true,
    resizeThrottle: 250
  })

  const handleGetStarted = () => {
    navigate({ to: '/auth/register' })
  }

  const handleAlreadyHaveAccount = () => {
    navigate({ to: '/auth/login' })
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
      <div
        className={`w-full grid grid-cols-1 gap-8 sm:gap-12 lg:gap-16 items-center ${
          heroImage ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
        }`}
      >
        {/* Coluna Esquerda - Hero Image (Condicional) */}
        {heroImage && (
          <div className="flex justify-center items-center lg:justify-end order-2 lg:order-1">
            <div className="relative w-full max-w-[240px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[480px] aspect-square flex items-center justify-center">
              <img
                src={heroImage}
                alt="Journey Hero"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Coluna Direita - Conteúdo */}
        <div className={`flex flex-col gap-6 sm:gap-8 order-1 lg:order-2 ${heroImage ? 'items-center lg:items-start' : 'items-center'}`}>
          {/* Brand Section */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <img
                src="/brand/journey-logo.svg"
                alt="Journey Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
              />
              <ThemedImage
                lightSrc="/brand/journey-text-light.svg"
                darkSrc="/brand/journey-text-dark.svg"
                alt="Journey"
                className="h-12 sm:h-16 lg:h-20"
                priority={true}
              />
            </div>
            <p className="text-center font-light text-lg sm:text-xl lg:text-2xl max-w-md text-secondary transition-colors px-4">
              O jeito ético, seguro e eficaz de aprender com IA
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-md space-y-4 sm:space-y-5 px-4 sm:px-0">
            <Button
              onClick={handleGetStarted}
              variant="primary"
              size="lg"
              enableThrottle={true}
              throttleDelay={1000}
            >
              COMECE AGORA
            </Button>

            <Button
              onClick={handleAlreadyHaveAccount}
              variant="secondary"
              size="lg"
              enableThrottle={true}
              throttleDelay={1000}
            >
              JÁ TENHO UMA CONTA
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}