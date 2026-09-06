'use client';

import React, { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../../../lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, size = 'md', fullWidth = true, id, className, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? `textarea-${generatedId}`;
    const descriptionId = `${textareaId}-description`;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-fit', className)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-text-muted text-sm font-black uppercase tracking-widest"
          >
            {label}
          </label>
        )}
        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error || helperText ? descriptionId : undefined}
          className={cn(
            'w-full resize-y rounded-lg border bg-surface-light text-text-main outline-none transition-colors placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 dark:bg-surface-dark dark:text-white',
            size === 'sm' && 'min-h-20 px-3 py-2 text-xs',
            size === 'md' && 'min-h-28 px-4 py-3 text-sm',
            size === 'lg' && 'min-h-36 px-5 py-4 text-base',
            error ? 'border-danger' : 'border-border-subtle',
            props.disabled && 'cursor-not-allowed opacity-50',
          )}
        />
        {(error || helperText) && (
          <span
            id={descriptionId}
            className={cn('text-xs', error ? 'text-danger' : 'text-text-muted')}
          >
            {error ?? helperText}
          </span>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
