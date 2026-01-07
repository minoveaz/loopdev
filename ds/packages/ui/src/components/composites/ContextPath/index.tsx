'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { TechnicalLabel } from '../../atoms';
import { ContextPathProps } from './types';
import { useContextPath } from './useContextPath';

/**
 * @component ContextPath
 * @description Dispositivo de orientación jerárquica para LoopDev OS.
 * Implementa colapso inteligente para mantener la claridad en rutas profundas.
 * @category Composites
 * @phase 1
 */
export const ContextPath: React.FC<ContextPathProps> = (props) => {
  const { separator = 'slash' } = props;
  const { 
    processedSegments, 
    containerClasses, 
    getSegmentClasses, 
    handleNavigate 
  } = useContextPath(props);

  return (
    <nav className={containerClasses} aria-label="Breadcrumb Técnico">
      <ol className="flex items-center gap-2">
        {processedSegments.map((segment, index) => {
          const isLast = index === processedSegments.length - 1;
          const isEllipsis = segment.id === 'ellipsis';

          return (
            <React.Fragment key={segment.id}>
              {/* Segmento de Ruta */}
              <li className="flex items-center">
                <div 
                  onClick={() => !isLast && !isEllipsis && segment.href && handleNavigate?.(segment.href)}
                  className={getSegmentClasses(isLast, isEllipsis)}
                >
                  <TechnicalLabel 
                    variant={isLast ? 'white' : 'muted'} 
                    size="nano"
                    weight="bold"
                    fontFamily="mono"
                    isUppercase={false}
                    className="cursor-inherit whitespace-nowrap"
                  >
                    {segment.label}
                  </TechnicalLabel>
                </div>
              </li>

              {/* Separador Técnico (Oculto tras el último item) */}
              {!isLast && (
                <li className="flex items-center text-text-muted/30 select-none" aria-hidden="true">
                  {separator === 'slash' ? (
                    <span className="text-[10px] font-light mx-0.5">/</span>
                  ) : (
                    <ChevronRight size={12} strokeWidth={1.5} />
                  )}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
