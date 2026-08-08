import type { SuiteHomeAction } from '../SuiteHomeLayout/types';
import type React from 'react';

export interface SuiteLaunchpadProps {
  title: string;
  description: string;
  primaryAction?: SuiteHomeAction;
  quickActions: SuiteHomeAction[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  children?: React.ReactNode;
  /** Permite mantener temporalmente las secciones antiguas durante una migración. */
  showLegacySections?: boolean;
  className?: string;
}
