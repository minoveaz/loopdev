import { CommandBarTriggerProps } from './types';

/**
 * @hook useCommandBarTrigger
 * @description Lógica para la gestión de estilos y estados del disparador.
 */
export const useCommandBarTrigger = (props: CommandBarTriggerProps) => {
  const { mode = 'full', className = '' } = props;

  const isIconMode = mode === 'icon';

  // 1. Composición de Clases del Contenedor (Zero Hardcoding)
  const containerClasses = `
    group flex items-center gap-2 h-9 px-3 rounded-lg border transition-all duration-300
    bg-white/50 dark:bg-black/20 border-black/10 dark:border-white/10
    hover:bg-white dark:hover:bg-black/40 hover:border-primary/50 dark:hover:border-primary/50
    cursor-pointer
    ${isIconMode ? 'w-9 justify-center' : 'min-w-64'}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Clases para el Texto Placeholder
  const placeholderClasses = `
    text-sm text-text-muted/60 group-hover:text-text-muted transition-colors
  `;

  // 3. Clases para el Atajo de Teclado
  const shortcutClasses = `
    ml-auto font-mono text-[10px] font-bold border border-black/10 dark:border-white/10 
    bg-white/80 dark:bg-black/30 rounded px-1.5 py-0.5
    text-text-muted
  `;

  return {
    isIconMode,
    containerClasses,
    placeholderClasses,
    shortcutClasses,
  };
};
