import { useState, useEffect } from 'react';
import { ThemeToggleProps } from './types';

/**
 * @hook useThemeToggle
 * @description Lógica para gestionar el estado del tema y las clases de estilo.
 */
export const useThemeToggle = (props: ThemeToggleProps) => {
  const { size = 'md', variant = 'technical', className = '' } = props;
  const [isDark, setIsDark] = useState(false);

  // Inicialización: Detectar tema actual
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newMode = !isDark;
    
    if (newMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setIsDark(newMode);
    // Opcional: Guardar en localStorage para persistencia
    localStorage.setItem('lpd-theme', newMode ? 'dark' : 'light');
  };

  // Mapeo de tamaños industriales
  const sizeMap = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
  };

  // Composición de clases (Zero Hardcoding)
  const buttonClasses = `
    rounded-lg transition-all duration-300 flex items-center justify-center shadow-sm
    ${sizeMap[size]}
    ${variant === 'technical' 
      ? 'bg-white border border-black/5 text-slate-500 hover:border-primary/50 hover:text-primary dark:bg-white/5 dark:border-white/10 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-primary dark:hover:border-primary/50' 
      : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-white/40'
    }
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return {
    isDark,
    toggleTheme,
    buttonClasses,
    iconSize: size === 'sm' ? 16 : size === 'lg' ? 22 : 18
  };
};
