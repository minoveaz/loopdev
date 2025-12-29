import React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '../../../helpers/cn';
import { Box } from '../../../components/layout';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverPrimitive.PopoverContentProps
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-[var(--lpd-z-popover)] w-72 animate-in fade-in zoom-in-95 duration-200",
        className
      )}
      {...props}
    >
      <Box background="base" radius="2xl" border className="shadow-xl overflow-hidden">
        {props.children}
      </Box>
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = "PopoverContent";
