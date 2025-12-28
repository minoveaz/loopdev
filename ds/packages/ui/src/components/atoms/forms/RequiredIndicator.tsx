import React from 'react';
import { cn } from '@/helpers/cn';

export const RequiredIndicator = ({ className }: { className?: string }) => (
  <span className={cn("text-red-500 ml-1 font-bold", className)} aria-hidden="true">
    *
  </span>
);
