interface StickyUnitHeaderProps {
  unitNumber: number
  title: string
  color: string
  isVisible: boolean
}

export function StickyUnitHeader({ unitNumber, title, color, isVisible }: StickyUnitHeaderProps) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center h-16 w-full px-6 shadow-lg">
        <div className="flex-1 flex items-center gap-4">
          {/* Ícone do escudo */}
          <div className="flex items-center justify-center">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="white"
              opacity="0.9"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
          </div>

          {/* Informações da unidade */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold text-duoSubText">
              SECTION 1, UNIT {unitNumber}
            </p>
            <p className="text-white text-base font-bold leading-tight">
              {title}
            </p>
          </div>
        </div>

        {/* Indicador de progresso (opcional) */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="white"
              opacity="0.8"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
