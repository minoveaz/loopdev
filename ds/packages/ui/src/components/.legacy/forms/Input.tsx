import React from 'react';
import { cn } from '../../../helpers/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative w-full group font-sans">
        {leftIcon && (
          <div className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200",
            error ? "text-[var(--lpd-color-error)]" : "text-slate-400 group-focus-within:text-[var(--lpd-color-brand-primary)]"
          )}>
            {React.isValidElement(leftIcon) 
              ? React.cloneElement(leftIcon as React.ReactElement, { size: 20 } as any) 
              : leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            "w-full border rounded-lg outline-none transition-all duration-200",
            "px-4 py-2.5", // Exact designer padding
            "text-sm bg-white dark:bg-slate-900", // Exact font size and backgrounds
            "placeholder:text-slate-400 placeholder:font-medium",
            "disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error 
              ? "border-[var(--lpd-color-error)] text-[var(--lpd-color-error)] focus:ring-4 focus:ring-[var(--lpd-color-error)]/10" 
              : "border-slate-300 dark:border-slate-600 text-[#0d121b] dark:text-white focus:border-[var(--lpd-color-brand-primary)] focus:ring-4 focus:ring-[var(--lpd-color-brand-primary)]/10",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {React.isValidElement(rightIcon) 
              ? React.cloneElement(rightIcon as React.ReactElement, { size: 20 } as any) 
              : rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";