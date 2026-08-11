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
    hover:border-accent/50 dark:hover:border-accent/50 hover:bg-[linear-gradient(to_right,rgba(0,95,115,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,95,115,0.05)_1px,transparent_1px)] hover:bg-[length:12px_12px]
    dark:hover:bg-[linear-gradient(to_right,rgba(0,95,115,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,95,115,0.08)_1px,transparent_1px)]
    focus-visible:border-accent/50 dark:focus-visible:border-accent/50 focus-visible:bg-[linear-gradient(to_right,rgba(0,95,115,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,95,115,0.05)_1px,transparent_1px)] focus-visible:bg-[length:12px_12px]
    dark:focus-visible:bg-[linear-gradient(to_right,rgba(0,95,115,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,95,115,0.08)_1px,transparent_1px)]
    cursor-pointer
    ${isIconMode ? 'w-9 justify-center' : 'min-w-64'}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // 2. Clases para el Texto Placeholder
  const placeholderClasses = `
    text-xs text-text-muted/50 group-hover:text-text-muted/80 transition-colors
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
