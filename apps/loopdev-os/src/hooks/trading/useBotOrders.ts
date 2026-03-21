'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useBotOrders = (botId?: string) => {
  return useQuery({
    queryKey: ['trading', 'orders', botId],
    queryFn: async () => {
      if (!botId) return [];
      
      const { data, error } = await supabase
        .from('quant_orders')
        .select('*')
        .eq('bot_id', botId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!botId,
    refetchInterval: 10000,
  });
};
