import React from 'react';
import { LpdText } from '../../../atoms';
import type { ContextBarProps } from './types';

export const ContextBar: React.FC<ContextBarProps> = ({
  label,
  value,
  leading,
  trailing,
  className = '',
  ...rest
}) => (
  <div
    className={`flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 border-y border-border-subtle py-2 ${className}`}
    {...rest}
  >
    {leading && <div className="shrink-0">{leading}</div>}
    <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
      {label && (
        <LpdText
          as="span"
          size="xs"
          variant="mono"
          className="uppercase tracking-widest text-text-muted"
        >
          {label}
        </LpdText>
      )}
      {value && (
        <LpdText as="span" size="sm" className="break-words">
          {value}
        </LpdText>
      )}
    </div>
    {trailing && (
      <div className="ml-auto flex shrink-0 flex-wrap items-center gap-2">{trailing}</div>
    )}
  </div>
);

export type { ContextBarProps } from './types';
