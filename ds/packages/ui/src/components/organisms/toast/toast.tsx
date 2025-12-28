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
          toast: "group toast rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[var(--lpd-color-text-base)] shadow-2xl font-sans p-4",
          description: "text-xs text-slate-500 mt-1 font-medium",
          title: "text-sm font-bold",
          actionButton: "bg-[var(--lpd-color-brand-primary)] text-white font-bold",
          cancelButton: "bg-slate-100 text-slate-600",
          success: "text-green-600",
          error: "text-red-600",
        },
      }}
    />
  );
};

export { toast } from 'sonner';