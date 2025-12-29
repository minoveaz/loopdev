import React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { X } from 'lucide-react';
import { cn } from '../../../helpers/cn';
import { Stack, Inline, Box, SafeArea } from '../../../components/layout';

export const Drawer = DrawerPrimitive.Root;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;

export interface DrawerContentProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  title?: string;
  description?: string;
  showClose?: boolean;
  /** Direction of the drawer: 'right' (default for desktop) or 'bottom' (standard for mobile) */
  direction?: 'right' | 'bottom';
}

export const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ children, title, description, showClose = true, direction = 'right', className, ...props }, ref) => (
    <DrawerPortal>
      <DrawerPrimitive.Overlay 
        className="fixed inset-0 z-[var(--lpd-z-overlay)] bg-black/40 backdrop-blur-sm" 
      />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-[var(--lpd-z-modal)] flex flex-col bg-[var(--lpd-color-bg-base)] shadow-2xl transition-transform duration-300",
          direction === 'right' 
            ? "inset-y-0 right-0 w-full max-w-md h-full border-l border-[var(--lpd-color-border-subtle)]" 
            : "inset-x-0 bottom-0 h-[85vh] rounded-t-[32px] border-t border-[var(--lpd-color-border-subtle)]",
          className
        )}
        {...props}
      >
        {/* Mobile Grab Handle (only for bottom direction) */}
        {direction === 'bottom' && (
          <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-[var(--lpd-color-bg-subtle)]" />
        )}

        <Stack gap={0} className="flex-1 overflow-hidden">
          {/* Header */}
          {(title || showClose) && (
            <Box padding={6} className={cn(
              "border-b border-[var(--lpd-color-border-subtle)]",
              direction === 'right' ? "" : "pt-4"
            )}>
              <Inline justify="between" align="center">
                <Stack gap={1}>
                  {title && (
                    <DrawerPrimitive.Title className="text-xl font-bold tracking-tight">
                      {title}
                    </DrawerPrimitive.Title>
                  )}
                  {description && (
                    <DrawerPrimitive.Description className="text-sm text-[var(--lpd-color-text-muted)]">
                      {description}
                    </DrawerPrimitive.Description>
                  )}
                </Stack>
                {showClose && (
                  <DrawerPrimitive.Close className="p-2 hover:bg-[var(--lpd-color-bg-subtle)] rounded-xl transition-colors">
                    <X size={20} className="text-[var(--lpd-color-text-muted)]" />
                  </DrawerPrimitive.Close>
                )}
              </Inline>
            </Box>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {children}
          </div>

          {/* Footer Safe Area */}
          <SafeArea bottom />
        </Stack>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
);

DrawerContent.displayName = "DrawerContent";

export const DrawerFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <Box padding={6} className={cn("bg-[var(--lpd-color-bg-subtle)] border-t border-[var(--lpd-color-border-subtle)] mt-auto", className)}>
    <Inline justify="end" gap={3}>
      {children}
    </Inline>
  </Box>
);
