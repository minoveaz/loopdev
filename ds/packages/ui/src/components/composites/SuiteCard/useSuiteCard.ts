import { SuiteCardProps } from './types';

/**
 * @hook useSuiteCard
 * @description Lógica para la composición de estilos reactivos del SuiteCard.
 */
export const useSuiteCard = (props: SuiteCardProps) => {
  const { isLocked = false, className = '' } = props;

  // Composición del contenedor principal (Reactivo al Tema)
  const containerClasses = `group relative overflow-hidden rounded-xl border transition-all duration-500 flex flex-col h-full ${
    isLocked 
      ? 'bg-slate-50 dark:bg-slate-900 border-black/5 dark:border-white/5 opacity-60 cursor-not-allowed' 
      : 'bg-white dark:bg-surface-dark border-black/5 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900/80 cursor-pointer shadow-xl hover:shadow-2xl dark:shadow-2xl'
  } ${className}`.replace(/\s+/g, ' ').trim();

  // Clases para el contenedor de la ilustración
  const illustrationWrapperClasses = `w-full h-32 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 overflow-hidden ${
    isLocked 
      ? 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-white/20' 
      : 'bg-primary/5 text-primary group-hover:bg-primary/10'
  }`.replace(/\s+/g, ' ').trim();

  // Clases para el título (Autoridad Visual)
  const titleClasses = `mb-2 transition-colors duration-300 ${
    isLocked 
      ? 'text-slate-400 dark:text-white/40' 
      : 'text-slate-900 dark:text-white group-hover:text-primary'
  }`.replace(/\s+/g, ' ').trim();

  return {
    containerClasses,
    illustrationWrapperClasses,
    titleClasses
  };
};
