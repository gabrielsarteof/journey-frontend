import { useEffect, useState, useRef, RefObject } from 'react'

interface ModuleVisibilityOptions {
  threshold?: number
  rootMargin?: string
}

export function useModuleVisibility(
  moduleRefs: RefObject<HTMLDivElement>[],
  options: ModuleVisibilityOptions = {}
) {
  const [visibleModuleIndex, setVisibleModuleIndex] = useState<number>(0)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Observer para os módulos
    if (moduleRefs.length === 0) return

    const threshold = options.threshold ?? 0.3
    const rootMargin = options.rootMargin ?? '-20% 0px -50% 0px'

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Encontra a entrada mais visível
        let maxRatio = 0
        let maxIndex = 0

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            const index = moduleRefs.findIndex(
              (ref) => ref.current === entry.target
            )
            if (index !== -1) {
              maxRatio = entry.intersectionRatio
              maxIndex = index
            }
          }
        })

        if (maxRatio > 0) {
          setVisibleModuleIndex(maxIndex)
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin
      }
    )

    moduleRefs.forEach((ref) => {
      if (ref.current) {
        observerRef.current?.observe(ref.current)
      }
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [moduleRefs, options.threshold, options.rootMargin])

  return {
    visibleModuleIndex
  }
}
