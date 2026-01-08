/**
 * @file types.ts
 * @description Contratos de tipado para el átomo de salida técnica ExitHatch.
 */

export interface ExitHatchProps {
  /** Etiqueta de texto (ej: "Back to OS") */
  label: string;
  /** Nombre del icono de Lucide */
  icon?: string;
  /** Modo compacto del sidebar */
  isRail?: boolean;
  /** Clase CSS adicional */
  className?: string;
  /** Callback de acción */
  onClick: () => void;
}
