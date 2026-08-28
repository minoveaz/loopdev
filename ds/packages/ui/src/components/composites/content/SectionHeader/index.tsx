import React from 'react';
import { cn } from '../../../../helpers/cn';
import { Heading } from '../../../atoms';
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
  headingAs = 'h2',
  className,
}) => (
  <header className={cn('flex items-center gap-2 border-b border-border-technical pb-2', className)}>
    <div className="flex min-w-0 items-center gap-2">
      {icon}
      <Heading
        as={headingAs}
        size="xs"
        className="truncate font-mono uppercase tracking-widest text-text-muted"
      >
        {title}
      </Heading>
    </div>
    {action && <div className="ml-auto shrink-0">{action}</div>}
  </header>
);

export type { SectionHeaderProps } from './types';