import type React from 'react';
import type { SemanticComponentColors } from '../../../shared/types';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  labels?: { previous?: string; next?: string; page?: (current: number, total: number) => string };
  loading?: boolean;
  disabled?: boolean;
  colors?: SemanticComponentColors;
  className?: string;
  showSummary?: boolean;
  compact?: boolean;
}
