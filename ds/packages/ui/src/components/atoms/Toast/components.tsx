'use client';

'use client';

import React, { useMemo } from 'react';
import { useToastStore } from './useToastStore';
import { ToastItem } from './index';
import { toastStore } from './toastStore';

/**
 * @component ToastViewport
 * @description Contenedor de notificaciones con Aislamiento Multi-tenant.
 */
export const ToastViewport: React.FC<{
  activeTenantId: string; // OBLIGATORIO para seguridad
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxVisible?: number;
}> = ({ activeTenantId, position = 'bottom-right', maxVisible = 3 }) => {
  const { toasts } = useToastStore();

  // Story 8: Solo permitimos los toasts que coinciden con el tenant activo
  const filteredToasts = useMemo(() => {
    return toasts.filter(t => t.tenantId === activeTenantId);
  }, [toasts, activeTenantId]);

  const visibleToasts = filteredToasts.slice(-maxVisible);

  const positionClasses = {
    'top-right': 'top-4 right-4 items-end',
    'top-left': 'top-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end flex-col-reverse',
    'bottom-left': 'bottom-4 left-4 items-start flex-col-reverse',
  }[position];

  return (
    <div 
      className={`fixed ${positionClasses} z-[100] flex flex-col gap-3`}
      aria-live="polite"
      role="region"
      aria-label="Notifications"
    >
      {visibleToasts.map(toastProps => (
        <ToastItem 
          key={toastProps.id}
          {...toastProps}
          onDismiss={() => toastStore.dismiss(toastProps.id)} 
        />
      ))}
    </div>
  );
};
