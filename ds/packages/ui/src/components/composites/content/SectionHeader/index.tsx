import React from 'react';
import { cn } from '../../../../helpers/cn';
import { LpdText } from '../../../atoms/foundations/Typography';
import type { SectionHeaderProps } from './types';

/**
 * @component SectionHeader
 * @description Encabezado consistente para secciones de contenido operativo.
 * @category Composites
 * @phase 1
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  action,
  className,
}) => (
  <div className={cn('flex items-center gap-2 pb-2 border-b border-border-technical', className)}>
    <div className="flex min-w-0 items-center gap-2">
      {icon}
      <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-widest">
        {title}
      </LpdText>
    </div>
    {action && <div className="ml-auto">{action}</div>}
  </div>
);

export type { SectionHeaderProps } from './types';