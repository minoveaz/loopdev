import { ReactNode, SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Label descriptiva del select */
  label?: string;
  /** Tamaño del selector */
  size?: 'sm' | 'md' | 'lg';
  /** Si ocupa todo el ancho de su contenedor */
  fullWidth?: boolean;
  /** Opciones estructuradas (alternativa a pasar etiquetas <option> como children) */
  options?: SelectOption[];
  /** Callback tipado con el valor seleccionado directo */
  onValueChange?: (value: string) => void;
  /** Placeholder cuando no hay selección */
  placeholder?: string;
  /** Habilita buscador en tiempo real dentro del desplegable */
  searchable?: boolean;
  /** Permite limpiar la selección */
  clearable?: boolean;
  /** Icono o elemento visual a la izquierda del valor */
  leadingIcon?: ReactNode;
  /** Mensaje de error para validación */
  error?: string;
  /** Texto de ayuda o descripción complementaria */
  hint?: string;
  /** Clases adicionales para el botón disparador */
  triggerClassName?: string;
}
