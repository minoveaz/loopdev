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
    const storedTheme = localStorage.getItem('lpd-theme');
    const isDarkMode = storedTheme ? storedTheme === 'dark' : document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', isDarkMode);
    setIsDark(isDarkMode);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== 'lpd-theme' || !event.newValue) return;
      const nextIsDark = event.newValue === 'dark';
      document.documentElement.classList.toggle('dark', nextIsDark);
      setIsDark(nextIsDark);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
    md: 'w-9 h-9 p-1.5',
    lg: 'w-12 h-12 p-2.5',
  };

  // Composición de clases (Zero Hardcoding)
  const buttonClasses = `
    rounded-full transition-all duration-300 flex items-center justify-center shadow-sm border
    ${sizeMap[size]}
    ${variant === 'technical' 
      ? 'bg-transparent border-primary/50 text-text-muted hover:border-primary hover:text-text-muted dark:border-white/10 dark:text-text-muted dark:hover:border-primary/40'
      : 'bg-transparent border-primary/35 hover:border-primary text-text-muted dark:border-white/10 dark:text-text-muted dark:hover:border-primary/40'
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
