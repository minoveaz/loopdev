import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../../helpers/cn';
import { Stack, Inline, Box } from '../../../components/layout';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;

export interface DialogContentProps extends DialogPrimitive.DialogContentProps {
  title?: string;
  description?: string;
  showClose?: boolean;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, title, description, showClose = true, className, ...props }, ref) => (
    <DialogPortal>
      <DialogPrimitive.Overlay 
        className="fixed inset-0 z-[var(--lpd-z-overlay)] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
      />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-[var(--lpd-z-modal)] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] animate-in zoom-in-95 fade-in duration-300",
          className
        )}
        {...props}
      >
        <Box background="base" radius="3xl" border className="shadow-2xl overflow-hidden">
          <Stack gap={0}>
            {/* Header */}
            {(title || showClose) && (
              <Box padding={6} className="border-b border-[var(--lpd-color-border-subtle)]">
                <Inline justify="between" align="center">
                  <Stack gap={1}>
                    {title && (
                      <DialogPrimitive.Title className="text-xl font-bold tracking-tight">
                        {title}
                      </DialogPrimitive.Title>
                    )}
                    {description && (
                      <DialogPrimitive.Description className="text-sm text-[var(--lpd-color-text-muted)]">
                        {description}
                      </DialogPrimitive.Description>
                    )}
                  </Stack>
                  {showClose && (
                    <DialogPrimitive.Close className="p-2 hover:bg-[var(--lpd-color-bg-subtle)] rounded-xl transition-colors">
                      <X size={20} className="text-[var(--lpd-color-text-muted)]" />
                    </DialogPrimitive.Close>
                  )}
                </Inline>
              </Box>
            )}

            {/* Body */}
            <Box padding={6} className="overflow-y-auto max-h-[70vh] custom-scrollbar">
              {children}
            </Box>
          </Stack>
        </Box>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);

DialogContent.displayName = "DialogContent";

export const DialogFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <Box padding={6} className={cn("bg-[var(--lpd-color-bg-subtle)] border-t border-[var(--lpd-color-border-subtle)]", className)}>
    <Inline justify="end" gap={3}>
      {children}
    </Inline>
  </Box>
);

export const DialogClose = DialogPrimitive.Close;
