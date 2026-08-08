'use client';

import React, { useState } from 'react';
import { LpdText, Button } from '@loopdev/ui';
import type { OrderFilters } from '@/types/orders';

interface OrderFiltersProps {
  onFiltersChange?: (filters: OrderFilters) => void;
}

export function OrderFilters({ onFiltersChange }: OrderFiltersProps) {
  const [filters, setFilters] = useState<OrderFilters>({
    limit: 50,
    offset: 0,
  });

  const handleSideChange = (side: 'buy' | 'sell' | undefined) => {
    const newFilters = { ...filters, side };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters: OrderFilters = { limit: 50, offset: 0 };
    setFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  return (
    <div className="bg-background-surface border border-border-technical/30 rounded-lg p-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <LpdText size="sm" className="text-text-muted">
          Filter by:
        </LpdText>
      </div>

      {/* Side Filter */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" type="button"
          onClick={() => handleSideChange(undefined)}
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            !filters.side
              ? 'bg-primary/10 border-primary text-primary'
              : 'border-border-technical/30 hover:border-border-technical/50'
          }`}
        >
          All
        </Button>
        <Button variant="outline" size="sm" type="button"
          onClick={() => handleSideChange('buy')}
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            filters.side === 'buy'
              ? 'bg-green-500/10 border-green-500 text-green-500'
              : 'border-border-technical/30 hover:border-border-technical/50'
          }`}
        >
          Buy Only
        </Button>
        <Button variant="outline" size="sm" type="button"
          onClick={() => handleSideChange('sell')}
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            filters.side === 'sell'
              ? 'bg-red-500/10 border-red-500 text-red-500'
              : 'border-border-technical/30 hover:border-border-technical/50'
          }`}
        >
          Sell Only
        </Button>
      </div>

      {/* Reset Button */}
      <Button variant="ghost" size="sm" type="button"
        onClick={handleReset}
        className="px-3 py-1 text-sm border border-border-technical/30 rounded hover:bg-background-elevated transition-colors ml-auto"
      >
        Reset Filters
      </Button>
    </div>
  );
}
