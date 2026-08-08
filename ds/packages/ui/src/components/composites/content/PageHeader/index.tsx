import React from 'react';
import { Heading, LpdText } from '../../../atoms';
import type { PageHeaderProps } from './types';

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  eyebrow,
  actions,
  headingAs = 'h1',
  className = '',
  ...rest
}) => (
  <header className={`flex flex-wrap items-start justify-between gap-4 ${className}`} {...rest}>
    <div className="min-w-0 space-y-2">
      {eyebrow && (
        <LpdText
          as="p"
          size="xs"
          variant="mono"
          className="uppercase tracking-widest text-text-muted"
        >
          {eyebrow}
        </LpdText>
      )}
      <Heading as={headingAs} size="2xl" className="break-words">
        {title}
      </Heading>
      {description && (
        <LpdText as="p" size="sm" className="max-w-2xl text-text-muted">
          {description}
        </LpdText>
      )}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </header>
);

export type { PageHeaderProps } from './types';
