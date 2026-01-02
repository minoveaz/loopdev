export type QAStatus = 'pass' | 'fail' | 'pending' | 'warning';

export interface QAMetric {
  label: string;
  status: QAStatus;
  value?: string;
}

export interface QualityShieldProps {
  metrics: {
    unit?: QAMetric;
    a11y?: QAMetric;
    visual?: QAMetric;
    flow?: QAMetric;
    security?: QAMetric;
  };
  className?: string;
}
