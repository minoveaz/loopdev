import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../../../helpers/cn';

export const Switch = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lpd-color-brand-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[var(--lpd-color-brand-primary)] data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:bg-slate-700",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
        "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1" // Matching designer exact translation
      )}
    />
  </SwitchPrimitive.Root>
));

Switch.displayName = "Switch";