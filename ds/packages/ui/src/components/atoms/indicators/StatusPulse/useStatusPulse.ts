import { StatusPulseProps, StatusPulseVariant, StatusPulseSize } from './types';

/**
 * @hook useStatusPulse
 * @description Lógica para la composición de clases y estilos de telemetría.
 * Implementa el principio de Zero Hardcoding usando variables CSS de LoopDev.
 */
export const useStatusPulse = (props: StatusPulseProps) => {
  const { 
    variant = 'success', 
    status, // Alias para variant
    size = 'sm', 
    isAnimated = true,
    className = '' 
  } = props;

  const activeVariant = status || variant;

  // 1. Mapeo de Variantes a Tokens de Color y Sombras (Glow)
  const variantMap: Record<StatusPulseVariant, string> = {
    success: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
    energy: 'bg-energy-yellow shadow-[0_0_8px_var(--lpd-color-brand-energy)]',
    danger: 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.4)]',
    primary: 'bg-primary shadow-[0_0_8px_rgba(19,91,236,0.4)]',
    info: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.4)]',
    neutral: 'bg-slate-300 dark:bg-white/20',
    innovation: 'bg-purple-600 dark:bg-innovation-purple shadow-purple-500/50',
  };

  // 2. Mapeo de Tamaños Industriales
  const sizeMap: Record<StatusPulseSize, string> = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  // 3. Composición de Clases
  const pulseClasses = `
    rounded-full transition-all duration-500 shrink-0
    ${variantMap[activeVariant as StatusPulseVariant] || variantMap.success}
    ${sizeMap[size]}
    ${isAnimated ? 'animate-pulse' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return {
    pulseClasses
  };
};