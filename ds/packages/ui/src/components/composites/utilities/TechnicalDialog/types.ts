import { ReactNode } from 'react';

type DialogVariant = 'default' | 'info' | 'warning' | 'danger' | 'success';

/**
 * @interface TechnicalDialogProps
 * @description Contract for the standardized industrial modal.
 */
export interface TechnicalDialogProps {
  /** Controlled open state */
  isOpen: boolean;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Title of the dialog (Technical Heading) */
  title: string;
  /** Optional subtitle or description */
  description?: string;
  /** Content of the dialog */
  children?: ReactNode;
  /** Footer actions (Buttons) */
  actions?: ReactNode;
  /** Severity variant for styling header/borders */
  variant?: DialogVariant;
  /** Width class (default: max-w-lg) */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Additional class names */
  className?: string;
}
