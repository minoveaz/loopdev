'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ActivityEvent } from '@loopdev/ui';

interface QuantOrderRow {
  id: string;
  created_at: string;
  side?: string;
  pair?: string;
  filled_quantity?: number | string | null;
  average_fill_price?: number | string | null;
  status?: string;
  signal_source?: string;
  quant_bots?: { name?: string } | null;
}

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

      return data.map((order: QuantOrderRow): ActivityEvent => ({
        id: order.id,
        time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type: order.side?.toUpperCase() === 'SELL' ? 'SELL' : 'BUY',
        pair: order.pair || '---',
        qty: order.filled_quantity?.toString() || '0',
        price: order.average_fill_price?.toLocaleString() || '0',
        status: order.status === 'filled' ? 'filled' : 'rejected',
        strategy: order.quant_bots?.name || 'Unknown_Agent',
        message: order.signal_source
      }));
    },
    refetchInterval: 10000, // Refresh activity every 10 seconds
  });
};
