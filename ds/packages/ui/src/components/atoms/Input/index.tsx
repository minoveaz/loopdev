'use client';

import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';
import { InputProps } from './types';
import { useInput } from './useInput';
import { IconWrapper, LoadingSpinner, PasswordToggle } from './components';
import { Label } from '../Label';

/**
 * @component Input
 * @category Primitives
 * @version 1.0.0
 * @description Sensor de datos industrial con validación, iconos y soporte multi-tenant. 
 * Cumple con VISUAL_COMPOSITION_SYSTEM v3.8 para formularios SaaS.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    inputId,
    helperId,
    errorId,
    currentType,
    isPassword,
    showPassword,
    togglePassword,
    containerClasses,
    wrapperClasses,
    inputClasses,
    label,
    helperText,
    error,
    isLoading,
    startIcon,
    endIcon,
    disabled,
    onFocus,
    onBlur,
    setIsFocused,
    isFocused, // Extraemos el booleano para que no vaya al input
    variant,   // Extraemos props de diseño
    size,
    fullWidth,
    ...rest
  } = useInput(props);

  return (
    <div className={containerClasses}>
      {label && (
        <Label 
          as="label"
          htmlFor={inputId} 
          size="xs"
          weight="black"
          className={cn("uppercase tracking-widest mb-1", error ? 'text-danger' : 'text-text-muted')}
        >
          {label}
        </Label>
      )}

      <div className={wrapperClasses}>
        {startIcon && <IconWrapper position="start">{startIcon}</IconWrapper>}
        
        <input
          {...rest}
          ref={ref}
          id={inputId}
          type={currentType}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperId}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
        />

        {isLoading && <LoadingSpinner />}
        
        {isPassword && !isLoading && (
          <PasswordToggle show={showPassword} onToggle={togglePassword} />
        )}

        {endIcon && !isLoading && !isPassword && (
          <IconWrapper position="end">{endIcon}</IconWrapper>
        )}
      </div>

      {error ? (
        <span id={errorId} className="text-xs font-medium text-[var(--lpd-color-error)] ml-1 animate-in fade-in slide-in-from-top-1">
          {typeof error === 'string' ? error : error.message}
        </span>
      ) : (
        helperText && (
          <span id={helperId} className="text-xs text-slate-400 dark:text-slate-500 ml-1">
            {helperText}
          </span>
        )
      )}
    </div>
  );
});

Input.displayName = 'Input';
