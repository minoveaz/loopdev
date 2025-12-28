import React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '@/helpers/cn';
import { Stack, Inline, Box } from '@/components/layout';
import { Button } from '@/components/atoms/button';

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  AlertDialogPrimitive.AlertDialogContentProps & { title?: string; description?: string }
>(({ children, title, description, className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogPrimitive.Overlay className="fixed inset-0 z-[var(--lpd-z-overlay)] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-[var(--lpd-z-modal)] w-full max-w-md translate-x-[-50%] translate-y-[-50%] animate-in zoom-in-95 fade-in duration-300",
        className
      )}
      {...props}
    >
      <Box background="base" radius="3xl" border className="shadow-2xl overflow-hidden">
        <Stack gap={6} className="p-8">
          <Stack gap={2}>
            {title && (
              <AlertDialogPrimitive.Title className="text-xl font-bold tracking-tight">
                {title}
              </AlertDialogPrimitive.Title>
            )}
            {description && (
              <AlertDialogPrimitive.Description className="text-sm text-[var(--lpd-color-text-muted)] leading-relaxed">
                {description}
              </AlertDialogPrimitive.Description>
            )}
          </Stack>
          {children}
        </Stack>
      </Box>
    </AlertDialogPrimitive.Content>
  </AlertDialogPortal>
));

AlertDialogContent.displayName = "AlertDialogContent";

export const AlertDialogFooter = ({ children }: { children: React.ReactNode }) => (
  <Inline justify="end" gap={3}>
    {children}
  </Inline>
);

export const AlertDialogAction = AlertDialogPrimitive.Action;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
