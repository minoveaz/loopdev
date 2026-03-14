import { HTMLAttributes } from 'react';

export type CanvasVariant = 'blueprint' | 'neural' | 'clean';
export type CanvasIntensity = 'low' | 'medium' | 'high';

export interface TechnicalCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Estilo de la rejilla */
  variant?: 'blueprint' | 'neural' | 'clean' | 'monochrome';
  
  /** Intensidad visual de la grilla */
  intensity?: CanvasIntensity;
  
  /** Tamaño de la celda principal (por defecto 40px) */
  size?: number;
  
  /** Si debe mostrar la sub-grilla de precisión (8px) */
  showSubgrid?: boolean;
}
