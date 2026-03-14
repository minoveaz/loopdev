import { InputHTMLAttributes, ReactNode } from 'react';

export type InputVariant = 'outline' | 'filled' | 'ghost';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label descriptiva del campo */
  label?: string;
  /** Texto de ayuda o instrucción */
  helperText?: string;
  /** Mensaje de error o contrato de error de API (si existe, cambia el estado visual a error) */
  error?: string | { message: string; code?: string };
  /** Icono al inicio del input */
  startIcon?: ReactNode;
  /** Icono al final del input */
  endIcon?: ReactNode;
  /** Estado de carga (muestra un spinner sutil) */
  isLoading?: boolean;
  /** Variante visual del componente */
  variant?: InputVariant;
  /** Tamaño del componente */
  size?: 'sm' | 'md' | 'lg';
  /** Si es true, el input ocupará todo el ancho del contenedor */
  fullWidth?: boolean;
}
