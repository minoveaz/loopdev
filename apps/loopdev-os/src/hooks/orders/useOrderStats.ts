'use client';

import { useQuery } from '@tanstack/react-query';
import type { OrderStats } from '@/types/orders';

const API_BASE_URL = 'http://localhost:8000/api';

export function useOrderStats(bot_id?: string) {
  return useQuery<OrderStats>({
    queryKey: ['orders-stats', bot_id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (bot_id) params.append('bot_id', bot_id);

      const url = `${API_BASE_URL}/orders/stats${params.size > 0 ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch order stats: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 60000, // 60 seconds (stats can be slightly stale)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
