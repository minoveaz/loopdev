import { useState, useId, useMemo } from 'react';
import { InputProps } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for tailwind classes */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const useInput = (props: InputProps) => {
  const {
    id: customId,
    type = 'text',
    variant = 'outline',
    size = 'md',
    fullWidth = true,
    error,
    isLoading,
    className,
    disabled,
    ...rest
  } = props;

  const generatedId = useId();
  const inputId = customId || `input-${generatedId}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const containerClasses = cn(
    "flex flex-col gap-1.5",
    fullWidth ? "w-full" : "w-fit",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  const wrapperClasses = cn(
    "relative flex items-center transition-all duration-200 group border rounded-lg overflow-hidden",
    // Variants
    variant === 'outline' && "bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800",
    variant === 'filled' && "bg-slate-100 dark:bg-slate-900 border-transparent",
    variant === 'ghost' && "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50",
    // States
    isFocused && "ring-2 ring-[var(--lpd-color-brand-primary)]/20 border-[var(--lpd-color-brand-primary)]",
    error && "border-[var(--lpd-color-error)] ring-[var(--lpd-color-error)]/10",
    !error && !isFocused && "hover:border-slate-400 dark:hover:border-slate-700"
  );

  const inputClasses = cn(
    "w-full bg-transparent border-none focus:ring-0 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400/80",
    // Sizes
    size === 'sm' && "px-3 py-1.5 text-xs",
    size === 'md' && "px-4 py-2.5 text-sm",
    size === 'lg' && "px-5 py-3.5 text-base"
  );

  const togglePassword = () => setShowPassword(!showPassword);

  return {
    inputId,
    helperId,
    errorId,
    currentType,
    isPassword,
    showPassword,
    isFocused,
    setIsFocused,
    togglePassword,
    containerClasses,
    wrapperClasses,
    inputClasses,
    disabled,
    error,
    isLoading,
    variant,
    size,
    fullWidth,
    ...rest
  };
};
