import type React from 'react';
import type { SemanticComponentColors } from '../../../shared/types';

export interface FilterBarFilter {
  id: string;
  label: string;
  icon?: string;
  options: string[];
  multiple?: boolean;
}

export interface FilterBarProps {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    ariaLabel?: string;
  };
  filters?: FilterBarFilter[];
  filterValues?: Record<string, string[]>;
  onFilterValuesChange?: (id: string, values: string[]) => void;
  onClear?: () => void;
  actions?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  colors?: SemanticComponentColors;
  className?: string;
}
