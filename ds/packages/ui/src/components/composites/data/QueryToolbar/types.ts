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
    control?: React.ReactNode;
  };
  view?: {
    value: string;
    options: QueryToolbarOption[];
    onChange: (value: string) => void;
    label?: string;
  };
  pagination?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  showClear?: boolean;
  colors?: SemanticComponentColors;
  className?: string;
}
