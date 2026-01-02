import { useState, useEffect } from 'react';
import analysisData from '../data/analysis_activity_sidebar.json';

export interface AuditZone {
  zone: string;
  status: string;
  target: string;
}

export interface AuditReport {
  componentName: string;
  zones: AuditZone[];
  antipatterns: {
    hardcodedColors: string[];
    legacyIcons: number;
    inlineStyles: number;
  };
}

export const useArchitectAudit = () => {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular lectura de archivo
    setTimeout(() => {
      setReport(analysisData as AuditReport);
      setIsLoading(false);
    }, 600);
  }, []);

  return { report, isLoading };
};
