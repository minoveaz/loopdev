import React from 'react';
import { cn } from '@/helpers/cn';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[120px] w-full rounded-2xl border-2 bg-[var(--lpd-color-bg-base)] px-4 py-3 text-sm transition-all outline-none custom-scrollbar resize-none",
          "placeholder:text-[var(--lpd-color-text-muted)] placeholder:opacity-50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error 
            ? "border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-500/10" 
            : "border-[var(--lpd-color-border-subtle)] focus:border-[var(--lpd-color-brand-primary)] focus:ring-4 focus:ring-[var(--lpd-color-brand-primary)]/10 hover:border-[var(--lpd-color-text-muted)]/30",
          className
        )}
        {...props}
      />
    );
  }
);

TextArea.displayName = "TextArea";
