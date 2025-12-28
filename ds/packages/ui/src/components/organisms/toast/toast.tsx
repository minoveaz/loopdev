import React from 'react';
import { Toaster as Sonner } from 'sonner';
import { useTenant } from '@/providers/tenant-provider';

export const Toaster = () => {
  const { tenant } = useTenant();

  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast rounded-2xl border-[var(--lpd-color-border-subtle)] bg-[var(--lpd-color-bg-base)] text-[var(--lpd-color-text-base)] shadow-xl font-sans",
          description: "text-[var(--lpd-color-text-muted)]",
          actionButton: "bg-[var(--lpd-color-brand-primary)] text-white font-bold",
          cancelButton: "bg-[var(--lpd-color-bg-subtle)] text-[var(--lpd-color-text-base)]",
          success: "text-green-600",
          error: "text-red-600",
        },
      }}
    />
  );
};

export { toast } from 'sonner';
