import React from 'react';
import { Label, HelperText, ErrorMessage, RequiredIndicator } from '@/components/atoms/forms';
import { Stack, Inline } from '@/components/layout';
import { cn } from '@/helpers/cn';

export interface FieldProps {
  children: React.ReactNode;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

/**
 * Field Molecule
 * Orchestrates Label, Input (children), HelperText and ErrorMessage
 * providing a consistent layout for all form fields.
 */
export const Field: React.FC<FieldProps> = ({
  children,
  label,
  helperText,
  error,
  required = false,
  id,
  className,
}) => {
  return (
    <Stack gap={1.5} className={cn("w-full", className)}>
      {label && (
        <Inline gap={1} align="center">
          <Label htmlFor={id} error={!!error}>{label}</Label>
          {required && <RequiredIndicator />}
        </Inline>
      )}
      
      <div className="relative">
        {children}
      </div>

      {(error || helperText) && (
        <Stack gap={1}>
          {error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            helperText && <HelperText>{helperText}</HelperText>
          )}
        </Stack>
      )}
    </Stack>
  );
};
