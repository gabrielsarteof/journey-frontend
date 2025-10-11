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
  // Base classes - sempre aplicadas
  const baseClasses = 'w-full rounded-2xl font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus-visible:outline-none';

  // Variant classes
  const variantClasses = {
    primary: 'bg-journeyBlack text-white shadow-journeyBlackShadow hover:bg-gray-800 active:translate-y-[2px] active:shadow-none',
    secondary: 'bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50 active:translate-y-[2px] shadow-md active:shadow-sm',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    danger: 'bg-journeyRed text-white hover:bg-red-700 active:translate-y-[2px] shadow-red-200 active:shadow-none'
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14'
  };

  // State classes
  const stateClasses = (disabled || loading)
    ? 'opacity-50 cursor-not-allowed transform-none shadow-none hover:bg-current active:translate-y-0'
    : '';

  const loadingClasses = loading ? 'cursor-wait' : '';

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

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {loading && <LoadingSpinner />}
      {icon && !loading && icon}
      {children}
    </button>
  );
}