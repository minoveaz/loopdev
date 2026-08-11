import { TechnicalTooltipProps } from './types';

/**
 * @hook useTechnicalTooltip
 * @description Lógica para gestionar estilos y comportamientos del globo técnico.
 */
export const useTechnicalTooltip = (props: TechnicalTooltipProps) => {
  const { className = '', delayDuration = 200, variant = 'technical' } = props;

  if (variant === 'popover') {
    return {
      contentClasses: `
        z-[var(--lpd-z-index-tooltip, 2000)]
        rounded-md border border-border-technical
        bg-surface-light px-3 py-2 shadow-lg
        animate-in fade-in zoom-in-95 duration-150
        dark:bg-surface-dark dark:text-white
        ${className}
      `.replace(/\s+/g, ' ').trim(),
      textClasses: 'text-text-main text-xs font-medium dark:text-white',
      delayDuration,
    };
  }

  // 1. Composición de Clases para el Contenedor (Fiel al Bloque 0)
  // El tooltip SIEMPRE es oscuro (Technical Terminal) independientemente del tema.
  const contentClasses = `
    z-[var(--lpd-z-index-tooltip, 2000)]
    overflow-hidden rounded-md border border-white/10
    bg-black/90 backdrop-blur-xl px-3 py-1.5 shadow-2xl
    animate-in fade-in zoom-in-95 duration-200
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Clases para el texto interno (JetBrains Mono)
  const textClasses = `
    font-mono text-[10px] font-bold text-white tracking-tight
  `;

  return {
    contentClasses,
    textClasses,
    delayDuration
  };
};
