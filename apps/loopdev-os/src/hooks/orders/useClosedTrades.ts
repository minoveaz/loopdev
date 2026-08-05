'use client';

import { useQuery } from '@tanstack/react-query';
import type { ClosedTradesResponse, TradeFilters } from '@/types/orders';

const API_BASE_URL = 'http://localhost:8000/api';

export function useClosedTrades(filters?: TradeFilters) {
  return useQuery<ClosedTradesResponse>({
    queryKey: ['closed-trades', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.bot_id) params.append('bot_id', filters.bot_id);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const url = `${API_BASE_URL}/orders/closed-trades${params.size > 0 ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch closed trades: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
