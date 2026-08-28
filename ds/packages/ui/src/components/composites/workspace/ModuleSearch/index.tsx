'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../atoms';

export interface ModuleSearchProps extends Omit<React.ComponentProps<typeof Input>, 'label'> {
  placeholder?: string;
}

export const ModuleSearch: React.FC<ModuleSearchProps> = ({
  placeholder = 'Search',
  className = '',
  ...props
}) => (
  <div className={`w-full min-w-0 max-w-[24rem] ${className}`}>
    <Input
      {...props}
      aria-label={props['aria-label'] ?? placeholder}
      placeholder={placeholder}
      startIcon={<Search size={16} aria-hidden="true" />}
      size="sm"
      fullWidth
    />
  </div>
);
