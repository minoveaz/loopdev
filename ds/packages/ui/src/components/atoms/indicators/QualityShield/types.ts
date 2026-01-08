/**
 * @file types.ts
 * @description Contratos para la matriz de calidad (QualityShield).
 */

export type QualityGateStatus = 'pass' | 'fail' | 'warn';

export interface QualityMetric {
  label: string;
  status: QualityGateStatus;
  value: string;
}

export interface QualityShieldProps {
  /** Métricas de QA para mostrar en la matriz */
  metrics: {
    unit: QualityMetric;
    a11y: QualityMetric;
    visual: QualityMetric;
  };
  /** Clase CSS adicional */
  className?: string;
}
