'use client';

import React from 'react';
import { LpdText, cn } from '@loopdev/ui';
import { StructuredTextFieldProps } from './types';

/**
 * @component StructuredTextField
 * @description A structured input for brand narrative fields.
 */
export const StructuredTextField: React.FC<StructuredTextFieldProps> = ({
  label,
  description,
  value,
  isEditable,
  onValueChange,
  onClick,
  className,
}) => {
  return (
    <div
      className={cn('flex flex-col gap-3 group', className)}
      onClick={!isEditable ? onClick : undefined}
    >
      <div className="flex flex-col gap-1">
        <LpdText
          size="nano"
          weight="bold"
          className="text-text-muted uppercase tracking-widest opacity-60"
        >
          {label}
        </LpdText>
        {description && (
          <LpdText size="xs" className="text-text-muted leading-tight opacity-40">
            {description}
          </LpdText>
        )}
      </div>

      <div
        className={cn(
          'relative rounded-xl transition-all duration-300',
          isEditable
            ? 'bg-background-surface border border-border-technical focus-within:border-primary/40 p-1'
            : 'hover:bg-background-subtle/50 cursor-pointer p-0',
        )}
      >
        {isEditable ? (
          <textarea
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            className="text-text-main scrollbar-none min-h-[100px] w-full resize-none border-none bg-transparent p-3 text-sm focus:ring-0"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        ) : (
          <LpdText size="sm" className="text-text-main p-1 leading-relaxed">
            {value || `// ${label.toLowerCase()}_not_defined`}
          </LpdText>
        )}
      </div>
    </div>
  );
};
