import type React from 'react';
import type { SemanticComponentColors } from '../../../shared/types';

export type SearchInputTone = 'default' | 'quiet' | 'accent';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
  onClear?: () => void;
  onSubmit?: () => void;
  loading?: boolean;
  tone?: SearchInputTone;
  clearLabel?: string;
  loadingLabel?: string;
  colors?: SemanticComponentColors;
}
