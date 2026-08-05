import { SelectHTMLAttributes } from 'react';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Label descriptiva del select */
  label?: string;
  /** Tamaño del selector */
  size?: 'sm' | 'md' | 'lg';
  /** Si ocupa todo el ancho de su contenedor */
  fullWidth?: boolean;
}
