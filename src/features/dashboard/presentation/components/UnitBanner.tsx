interface UnitBannerProps {
  unitNumber: number
  title: string
  color: string
}

export function UnitBanner({ unitNumber, title, color }: UnitBannerProps) {
  return (
    <div
      className="w-full 2xl:w-3/4 rounded-2xl overflow-hidden shadow-duoGreenShadow cursor-pointer hover:brightness-110 transition-all"
      style={{ backgroundColor: color }}
    >
      <div className="flex rounded-2xl h-20 w-full">
        <div className="w-5/6 h-full px-4 pb-3 flex flex-col">
          <div className="mt-3 text-duoSubText">
            <p className="text-sm font-bold">SECTION 1, UNIT {unitNumber}</p>
          </div>
          <div className="text-white text-xl">
            <p className="font-bold">{title}</p>
          </div>
        </div>
        <div className="h-full w-1/6 border-l border-white/20 flex justify-center items-center">
          <svg
            className="w-10 h-10"
            viewBox="0 0 24 24"
            fill="white"
            opacity="0.8"
          >
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
