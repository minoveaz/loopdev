/**
 * @file types.ts
 * @description Contratos para el componente visual del Toast.
 */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  action?: ToastAction;
  metadata?: string;
  onDismiss: (id: string) => void;
  /** Duración en ms */
  duration?: number;
  /** Clase CSS adicional */
  className?: string;
}
