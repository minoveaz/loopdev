'use client';

import { useQuery } from '@tanstack/react-query';
import type { OrdersResponse, OrderFilters } from '@/types/orders';

const API_BASE_URL = 'http://localhost:8000/api';

export function useOrders(filters?: OrderFilters) {
  return useQuery<OrdersResponse>({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.bot_id) params.append('bot_id', filters.bot_id);
      if (filters?.side) params.append('side', filters.side);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const url = `${API_BASE_URL}/orders${params.size > 0 ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });
}
