'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ActivityEvent } from '@loopdev/ui';

/**
 * @hook useActivityStream
 * @description Fetches the latest trading events from the quant_orders table.
 */
export const useActivityStream = () => {
  return useQuery({
    queryKey: ['trading', 'activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quant_orders')
        .select('*, quant_bots(name)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return data.map((order): ActivityEvent => ({
        id: order.id,
        time: order.created_at
          ? new Date(order.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          : 'Unknown time',
        type: order.side?.toUpperCase() === 'SELL' ? 'SELL' : 'BUY',
        pair: '---',
        qty: order.filled_quantity?.toString() || '0',
        price: order.average_fill_price?.toLocaleString() || '0',
        status: order.status === 'filled' ? 'filled' : 'rejected',
        strategy: order.quant_bots?.name || 'Unknown_Agent',
        message: order.signal_source ?? undefined,
      }));
    },
    refetchInterval: 10000, // Refresh activity every 10 seconds
  });
};
