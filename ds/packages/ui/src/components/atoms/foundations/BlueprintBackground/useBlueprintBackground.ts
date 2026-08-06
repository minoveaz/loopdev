import { BlueprintBackgroundProps } from './types';

/**
 * @hook useBlueprintBackground
 * @description Lógica para mapear intensidades y estados del fondo técnico.
 */
export const useBlueprintBackground = (props: BlueprintBackgroundProps) => {
  const { 
    intensity = 'medium', 
    withScanline = false, 
    variant = 'blueprint',
    className = '' 
  } = props;

  // 1. Mapeo de intensidades (Sin hardcoding de opacidades mágicas)
  // Dejamos que el chasis sea lo más transparente posible para que luzcan los tokens CSS.
  const intensityClasses = {
    low: 'opacity-40',
    medium: 'opacity-70',
    high: 'opacity-100'
  };

  const containerClasses = `
    absolute inset-0 pointer-events-none overflow-hidden
    ${intensityClasses[intensity]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Efecto Scanline (Pulso técnico)
  const scanlineClasses = `
    absolute inset-0 pointer-events-none animate-pulse opacity-[0.03]
    bg-repeat bg-[size:100%_4px]
    bg-[linear-gradient(to_bottom,transparent_50%,var(--lpd-color-text-base)_50%)]
  `.replace(/\s+/g, ' ').trim();

  return {
    variant,
    withScanline,
    containerClasses,
    scanlineClasses
  };
};