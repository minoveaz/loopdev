import type React from 'react';
import type { SemanticComponentColors } from '../../../shared/types';
import type { FilterBarFilter } from '../FilterBar/types';

export interface QueryToolbarOption {
  value: string;
  label: string;
}

export interface QueryToolbarProps {
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
  resultCount?: number;
  resultCountLabel?: (count: number) => string;
  sort?: {
    value: string;
    options: QueryToolbarOption[];
    onChange: (value: string) => void;
    label?: string;
  };
  view?: {
    value: string;
    options: QueryToolbarOption[];
    onChange: (value: string) => void;
    label?: string;
  };
  actions?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  colors?: SemanticComponentColors;
  className?: string;
}
