'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { TechnicalTooltipProps } from './types';
import { useTechnicalTooltip } from './useTechnicalTooltip';

/**
 * @component TechnicalTooltip
 * @description Átomo de información técnica que sustituye al 'title' nativo.
 * Utiliza sintaxis de terminal con brackets azules.
 * @category Foundations
 * @phase 1
 */
export const TechnicalTooltip: React.FC<TechnicalTooltipProps> = (props) => {
  const { children, content, side = 'right', align = 'center', open } = props;
  const { contentClasses, textClasses, delayDuration } = useTechnicalTooltip(props);

  return (
    <Tooltip.Provider delayDuration={delayDuration}>
      <Tooltip.Root open={open}>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        
        <Tooltip.Portal>
          <Tooltip.Content 
            side={side} 
            align={align} 
            sideOffset={8}
            className={contentClasses}
          >
            <div className="flex items-center gap-1.5">
              {/* Brackets en Azul (Tu propuesta de diseño) */}
              <span className="text-primary-light font-bold select-none">{`{`}</span>
              
              <div className={textClasses}>
                {content}
              </div>
              
              <span className="text-primary-light font-bold select-none">{`}`}</span>
            </div>
            
            {/* Nota: No incluimos Arrow para mantener el minimalismo industrial */}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
