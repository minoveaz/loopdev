'use client';

import React from 'react';
import { AssetSelectorProps } from './types';
import { Label, LpdText, Skeleton } from '../../../atoms';
import { cn } from '../../../../helpers/cn';

/**
 * @component AssetSelector
 * @description Specialized primitive for choosing certified trading assets.
 * Features category-aware styling and industrial legibility.
 */
export const AssetSelector: React.FC<AssetSelectorProps> = ({
  assets,
  value,
  onChange,
  label,
  isLoading = false,
  disabled = false,
  className
}) => {
  
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <Skeleton className="h-3 w-20 mb-1 rounded" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crypto': return 'currency_bitcoin';
      case 'commodity': return 'gold';
      case 'forex': return 'currency_exchange';
      default: return 'token';
    }
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <Label className="text-sm font-black uppercase tracking-widest text-text-muted mb-1">
          {label}
        </Label>
      )}

      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "relative z-10 w-full h-10 pl-12 pr-10 rounded-lg",
            "bg-white dark:bg-lpd-bg-dark border border-border-technical/50",
            "text-sm font-bold text-text-main dark:text-white",
            "focus:border-primary outline-none transition-all",
            "appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
            "group-hover:border-border-technical/80"
          )}
        >
          {assets.map((asset) => (
            <option key={asset.symbol} value={asset.symbol} className="bg-white dark:bg-lpd-bg-dark text-text-main dark:text-white">
              {asset.symbol} - {asset.name}
            </option>
          ))}
        </select>

        {/* Decorative Icon Wrapper - Below the select (z-0) */}
        <div className="absolute z-0 left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">
            {getCategoryIcon(assets.find(a => a.symbol === value)?.category || 'token')}
          </span>
        </div>

        {/* Arrow Indicator - Below the select (z-0) */}
        <div className="absolute z-0 right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="material-symbols-outlined text-sm font-bold">expand_more</span>
        </div>
      </div>
    </div>
  );
};
