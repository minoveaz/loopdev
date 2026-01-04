import { BlueprintBackgroundProps, BackgroundIntensity } from './types';

/**
 * @hook useBlueprintBackground
 * @description Lógica para mapear intensidades y estados del fondo.
 */
export const useBlueprintBackground = (props: BlueprintBackgroundProps) => {
  const { 
    intensity = 'low', 
    withScanline = true, 
    variant = 'blueprint',
    className = '' 
  } = props;

  // Mapeo de intensidades a opacidades reactivas (Zero Hardcoding)
  // En modo claro (light) usamos opacidades más bajas para no ensuciar el blanco.
  const opacityMap: Record<BackgroundIntensity, { grid: string; container: string }> = {
    low: { 
      grid: 'opacity-[0.03] dark:opacity-[0.05]', 
      container: 'opacity-10 dark:opacity-40' 
    },
    medium: { 
      grid: 'opacity-[0.06] dark:opacity-[0.12]', 
      container: 'opacity-20 dark:opacity-60' 
    },
    high: { 
      grid: 'opacity-[0.1] dark:opacity-[0.2]', 
      container: 'opacity-30 dark:opacity-80' 
    }
  };

  const currentOpacity = opacityMap[intensity];

  // Contenedor base indestructible
  const containerClasses = `absolute inset-0 z-0 pointer-events-none overflow-hidden ${currentOpacity.container} ${className}`;

  // Clases para el efecto Scanline (Pulso animado)
  const scanlineClasses = `
    absolute inset-0 pointer-events-none animate-pulse opacity-10
    bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] 
    bg-[size:100%_4px]
  `.replace(/\s+/g, ' ').trim();

  return {
    variant,
    withScanline,
    containerClasses,
    scanlineClasses,
    gridOpacity: intensity === 'low' ? 'low' : intensity === 'medium' ? 'medium' : 'high'
  };
};
