
import React from 'react';

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  icon?: string; // Material symbol name
  content?: React.ReactNode;
}

export const DEFAULT_STEPS: StepItem[] = [
  { id: '1', label: 'Account', icon: 'person' },
  { id: '2', label: 'Details', icon: 'description' },
  { id: '3', label: 'Review', icon: 'check_circle' }
];
