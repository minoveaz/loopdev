import { ReactNode } from 'react';
import { SuiteIdentity } from '@loopdev/contracts';

/**
 * @file types.ts
 * @description Contratos de tipado para el selector de suites SuiteSwitcher.
 */

export interface SuiteSwitcherProps {
  /** Suite activa actualmente */
  currentSuite: SuiteIdentity;
  /** Lista de suites disponibles para el usuario */
  availableSuites: SuiteIdentity[];
  /** Indica si la suite está bloqueada (Governance) */
  accessMap?: Record<string, 'enabled' | 'disabled' | 'hidden'>;
  /** Callback al seleccionar una nueva suite */
  onSuiteChange: (suiteId: string) => void;
  /** Clase CSS adicional */
  className?: string;
}
