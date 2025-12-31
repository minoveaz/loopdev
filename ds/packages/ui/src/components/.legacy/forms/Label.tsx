import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../../../helpers/cn';

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  className?: string;
  error?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, error, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200",
        error ? "text-[var(--lpd-color-error)]" : "text-slate-700 dark:text-slate-300",
        className
      )}
      {...props}
    />
  )
);

Label.displayName = "Label";
