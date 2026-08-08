import type React from 'react';

export interface ContextBarProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  value?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}
