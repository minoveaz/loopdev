'use client';

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
    // Variants use paired semantic tokens so tenant themes don't inherit a
    // dark surface with a light-theme foreground (or the reverse).
    variant === 'outline' && "bg-lpd-bg-base border-border-subtle",
    variant === 'filled' && "bg-primary/5 border-transparent",
    variant === 'ghost' && "bg-transparent border-transparent hover:bg-primary/5",
    // States
    isFocused && "ring-2 ring-primary/20 border-primary",
    error && "border-danger ring-danger/10",
    !error && !isFocused && "hover:border-primary/40 dark:hover:border-primary/40"
  );

  const inputClasses = cn(
    "lpd-input w-full border-none bg-transparent text-lpd-text-base caret-primary outline-none placeholder:text-lpd-text-muted focus:ring-0",
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
