import { ReactNode } from 'react';

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface MultiSelectProps {
  /** Label descriptiva del selector */
  label?: string;
  /** Tamaño del selector */
  size?: 'sm' | 'md' | 'lg';
  /** Si ocupa todo el ancho de su contenedor */
  fullWidth?: boolean;
  /** Opciones disponibles */
  options?: MultiSelectOption[];
  /** Valores seleccionados actualmente */
  value?: string[];
  /** Valores seleccionados por defecto */
  defaultValue?: string[];
  /** Callback cuando cambian los valores seleccionados */
  onChange?: (values: string[]) => void;
  /** Placeholder cuando no hay ningún valor seleccionado */
  placeholder?: string;
  /** Habilita buscador en el desplegable */
  searchable?: boolean;
  /** Permite limpiar todos los valores seleccionados */
  clearable?: boolean;
  /** Máximo de tags a mostrar antes de agrupar en +N más */
  maxTags?: number;
  /** Deshabilita la interacción */
  disabled?: boolean;
  /** Mensaje de error de validación */
  error?: string;
  /** Texto descriptivo o de ayuda */
  hint?: string;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
  /** Clases CSS adicionales para el botón disparador */
  triggerClassName?: string;
  /** Identificador HTML */
  id?: string;
  /** Requerido */
  required?: boolean;
  /** Accessible label */
  'aria-label'?: string;
}
