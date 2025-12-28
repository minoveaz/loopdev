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
          "w-full border rounded-lg outline-none transition-all duration-200 custom-scrollbar resize-none",
          "px-4 py-2.5 min-h-[120px]",
          "text-sm bg-white dark:bg-slate-900",
          "placeholder:text-slate-400 placeholder:font-medium",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error 
            ? "border-[var(--lpd-color-error)] text-[var(--lpd-color-error)] focus:ring-4 focus:ring-[var(--lpd-color-error)]/10" 
            : "border-slate-300 dark:border-slate-600 text-[#0d121b] dark:text-white focus:border-[var(--lpd-color-brand-primary)] focus:ring-4 focus:ring-[var(--lpd-color-brand-primary)]/10",
          className
        )}
        {...props}
      />
    );
  }
);

TextArea.displayName = "TextArea";