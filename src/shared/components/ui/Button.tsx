import React, { useCallback, useMemo } from 'react';
import { usePerformanceOptimization } from '../../performance/presentation/hooks/usePerformanceOptimization'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  // Performance optimization props
  enableThrottle?: boolean;
  throttleDelay?: number;
}

// Componente de loading spinner simples
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
  type = 'button',
  enableThrottle = false,
  throttleDelay = 1000
}: ButtonProps) {
  // Estabiliza callback com useCallback
  const stableOnClick = useCallback(() => {
    onClick()
  }, [onClick])

  // Cria opções de otimização de forma estável com useMemo
  const optimizationOptions = useMemo(() => ({
    strategy: 'throttle' as const,
    delay: throttleDelay
  }), [throttleDelay])

  // Hook de otimização de performance
  const { optimizedFn: throttledOnClick } = usePerformanceOptimization(
    stableOnClick,
    optimizationOptions
  )

  // Classes base do botão
  const baseClasses = 'w-full rounded-2xl font-medium flex items-center justify-center gap-2 focus:outline-none focus-visible:outline-none';

  // Classes de variantes (cores e estilos básicos)
  const variantClasses = {
    primary: 'bg-primary-button text-primary-button hover:bg-primary-button-hover transition-colors shadow-button-primary',
    secondary: 'bg-surface border-2 border-border-secondary text-button-secondaryhover:bg-surface-hover transition-colors shadow-button-secondary',
    ghost: 'bg-transparent text-secondary hover:bg-surface-elevated active:bg-surface transition-colors',
    danger: 'bg-error text-white hover:bg-error-alt transition-colors shadow-button-primary'
  };

  // Classes de tamanho
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14'
  };

  // Classes de estado (disabled/loading)
  const stateClasses = (disabled || loading)
    ? 'opacity-50 cursor-not-allowed'
    : '';

  const loadingClasses = loading ? 'cursor-wait' : '';

  // Combina todas as classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses,
    loadingClasses,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && !loading) {
      if (enableThrottle) {
        throttledOnClick();
      } else {
        onClick();
      }
    }
  };

  // Controla o estado de clique para animação 3D
  const [isActive, setIsActive] = React.useState(false);

  // Estilos inline apenas para animação do clique
  const getButtonStyle = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      transition: 'all 0.2s ease',
      transform: isActive && !disabled && !loading ? 'translateY(5px)' : 'translateY(0)',
    };

    // Apenas define boxShadow quando está ativo para não sobrescrever as classes CSS
    if (isActive && !disabled && !loading) {
      styles.boxShadow = 'none';
    }

    return styles;
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={buttonClasses}
      style={getButtonStyle()}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
    >
      {loading && <LoadingSpinner />}
      {icon && !loading && icon}
      {children}
    </button>
  );
}