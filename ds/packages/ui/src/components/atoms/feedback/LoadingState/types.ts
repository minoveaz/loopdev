import type React from 'react';
import type { SemanticComponentColors } from '../../../shared/types';

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  lines?: number;
  colors?: SemanticComponentColors;
}
