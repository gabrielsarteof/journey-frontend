import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { Button } from '../../../../shared/components/ui/Button'
import { useWindowEvents } from '../../../../shared/performance/presentation/hooks/useWindowEvents'

export function LandingPage() {
  const navigate = useNavigate()

  // Performance optimization para resize events
  const handleResize = useCallback(() => {
    // Layout optimization on resize - pode ser usado para ajustes responsivos
    console.log('Window resized with throttle optimization')
  }, [])

  // Strategy Pattern aplicado a eventos de janela
  useWindowEvents({
    onResize: handleResize,
    enableResizeOptimization: true,
    resizeThrottle: 250
  })

  const handleGetStarted = () => {
    navigate({ to: '/auth/login' })
  }

  const handleAlreadyHaveAccount = () => {
    navigate({ to: '/auth/login' })
  }

  return (
    <div className="min-h-screen h-full bg-white flex items-center justify-center px-4">
      <div className="container mx-auto py-12 px-4">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Coluna Esquerda - Hero Image */}
          <div className="flex justify-center items-center lg:justify-end">
            {/* Container com aspect ratio definido */}
            <div className="relative w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[400px] xl:max-w-[480px] aspect-square flex items-center justify-center">
              {/* Placeholder para hero image */}
              <div className="absolute w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-6xl">🚀</span>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Conteúdo */}
          <div className="flex flex-col gap-6 items-center lg:items-start">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl lg:text-3xl">🎯</span>
                </div>
                <h1 className="text-4xl lg:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Journey
                </h1>
              </div>
              <p className="text-center font-light py-2 text-xl lg:text-2xl max-w-md text-gray-700">
                O jeito ético, seguro e eficaz de aprender com IA
              </p>
            </div>

            <div className="w-full max-w-md space-y-4">
              <Button
                onClick={handleGetStarted}
                variant="primary"
                size="lg"
                enableThrottle={true}
                throttleDelay={1000}
              >
                COMECE AGORA
              </Button>

              <div style={{ boxShadow: '0 5px 0 #d1d5db' }} className="rounded-2xl">
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
      </div>
    </div>
  )
}