import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../../helpers/cn';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipPrimitive.TooltipContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-[var(--lpd-z-tooltip)] overflow-hidden rounded-lg bg-[var(--lpd-color-slate-950)] px-3 py-1.5 text-xs font-bold text-white shadow-md animate-in fade-in zoom-in-95 duration-200",
      className
    )}
    {...props}
  />
));

TooltipContent.displayName = "TooltipContent";
