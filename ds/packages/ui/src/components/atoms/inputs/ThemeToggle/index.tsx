'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeToggleProps } from './types';
import { useThemeToggle } from './useThemeToggle';

/**
 * @component ThemeToggle
 * @description Átomo oficial para la alternancia de temas con estética industrial.
 * @category Primitives
 * @phase 1
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = (props) => {
  const { isDark, toggleTheme, buttonClasses, iconSize } = useThemeToggle(props);

  return (
    <button 
      onClick={toggleTheme}
      className={buttonClasses}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label="Toggle Theme"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Icono de Sol (Aparece en modo oscuro para volver a claro) */}
        <Sun 
          size={iconSize} 
          className={`
            absolute transition-all duration-500 transform
            ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
          `}
        />
        
        {/* Icono de Luna (Aparece en modo claro para volver a oscuro) */}
        <Moon 
          size={iconSize} 
          className={`
            absolute transition-all duration-500 transform
            ${!isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}
          `}
        />
      </div>
    </button>
  );
};
