'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';
import { LpdText } from '../../foundations/Typography';
import { IndustrialBreadcrumbsProps } from './types';

/**
 * @component IndustrialBreadcrumbs
 * @description Átomo de navegación jerárquica con capas de profundidad.
 * Fix: Eliminación de bordes claros en modo oscuro.
 */
export const IndustrialBreadcrumbs: React.FC<IndustrialBreadcrumbsProps> = ({ 
  segments, 
  className = '' 
}) => {
  return (
    <nav className={cn("flex items-center gap-1 overflow-hidden", className)} aria-label="Breadcrumb">
      {segments.map((segment, idx) => (
        <React.Fragment key={segment.id}>
          <div 
            onClick={() => !segment.isActive && segment.href && (window.location.href = segment.href)}
            className={cn(
              "relative flex items-center px-3 py-1 rounded-lg transition-all duration-300 border group overflow-hidden",
              segment.isActive 
                ? "border-primary/30 dark:border-transparent shadow-sm dark:shadow-none" 
                : "text-text-muted hover:text-primary cursor-pointer border-transparent"
            )}
          >
            {/* CAPA DE FONDO (Garantiza visibilidad del azul) */}
            <div className={cn(
              "absolute inset-0 transition-opacity duration-300",
              segment.isActive 
                ? "bg-primary opacity-20 dark:opacity-[0.15]" 
                : "bg-primary opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20"
            )} />

            {/* CONTENIDO */}
            <LpdText 
              size="xs" 
              weight={segment.isActive ? "bold" : "medium"} 
              className={cn(
                "relative z-10 truncate whitespace-nowrap transition-colors duration-300",
                segment.isActive ? "text-primary dark:text-primary" : "inherit"
              )}
            >
              {segment.label}
            </LpdText>
          </div>
          
          {idx < segments.length - 1 && (
            <span className="relative z-10 text-[10px] font-mono text-primary opacity-40 px-0.5 select-none">
              /
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
