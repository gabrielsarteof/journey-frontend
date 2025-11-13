import { useMemo } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface ThemedImageProps {
  lightSrc: string
  darkSrc: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  priority?: boolean
}

export function ThemedImage({
  lightSrc,
  darkSrc,
  alt,
  className = '',
  width,
  height,
  loading = 'eager',
  priority = false
}: ThemedImageProps) {
  const { resolvedTheme } = useTheme()

  const currentSrc = useMemo(() => {
    return resolvedTheme === 'dark' ? darkSrc : lightSrc
  }, [resolvedTheme, darkSrc, lightSrc])

  const imgProps = useMemo(() => {
    const props: React.ImgHTMLAttributes<HTMLImageElement> = {
      src: currentSrc,
      alt,
      className,
      loading: priority ? 'eager' : loading
    }

    if (width) props.width = width
    if (height) props.height = height

    return props
  }, [currentSrc, alt, className, width, height, loading, priority])

  return (
    <img
      {...imgProps}
      style={{
        transition: 'opacity 0.2s ease-in-out'
      }}
    />
  )
}
