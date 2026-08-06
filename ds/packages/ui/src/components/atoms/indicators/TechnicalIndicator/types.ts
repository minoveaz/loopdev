export type IndicatorVariant = 'ai' | 'pdf' | 'stale' | 'info' | 'success' | 'counter';
type IndicatorBrandMode = 'sanitas' | 'adeslas' | 'neutral';

export interface TechnicalIndicatorProps {
  /** Variante del indicador que define el icono y el esquema de color base */
  variant: IndicatorVariant;
  /** Modo de marca para ajustar contrastes (Sanitas = fondos oscuros/texto blanco, Adeslas = fondos claros) */
  brandMode?: IndicatorBrandMode;
  /** Contenido del tooltip */
  tooltip?: string;
  /** Valor numérico (solo para variante 'counter') */
  value?: number;
  /** Clase CSS adicional */
  className?: string;
  /** Función al hacer click */
  onClick?: () => void;
}
