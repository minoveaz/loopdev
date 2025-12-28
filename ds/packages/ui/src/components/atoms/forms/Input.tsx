import React from 'react';
import { cn } from '@/helpers/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border-2 bg-[var(--lpd-color-bg-base)] px-4 py-2 text-sm transition-all outline-none",
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

Input.displayName = "Input";
