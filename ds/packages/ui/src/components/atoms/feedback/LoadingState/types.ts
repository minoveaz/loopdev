import type React from 'react';

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  lines?: number;
}
