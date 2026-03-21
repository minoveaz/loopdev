'use client';

import React from 'react';
import { LpdText, Icon, cn } from '@loopdev/ui';
import { useBotOrders } from '@/hooks/trading/useBotOrders';

interface ActivityStreamProps {
  botId: string;
  pair: string;
}

export const ActivityStream: React.FC<ActivityStreamProps> = ({ botId, pair }) => {
  const { data: recentOrders = [] } = useBotOrders(botId);

  return (
    <section className="flex flex-col gap-4">
      <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em] text-text-muted opacity-40 px-1">Live_Execution_Stream</LpdText>
      <div className="flex flex-col gap-2">
        {recentOrders.length > 0 ? (
          recentOrders.map((order: any) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="flex flex-col">
                <LpdText size="nano" weight="black" className={cn("uppercase", order.side === 'buy' ? 'text-emerald-500' : 'text-rose-500')}>{order.side}_ORDER</LpdText>
                <LpdText size="nano" className="text-text-muted opacity-40">{new Date(order.created_at).toLocaleTimeString()}</LpdText>
              </div>
              <div className="text-right">
                <LpdText size="xs" weight="black" className="text-text-main font-mono">${order.price.toLocaleString()}</LpdText>
                <LpdText size="nano" className="text-text-muted opacity-40">{order.quantity} {pair.split('/')[0]}</LpdText>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 border border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-3 opacity-30 text-center">
            <Icon name="Activity" size="lg" />
            <LpdText size="nano" weight="black" className="uppercase tracking-widest">No_Recent_Orders</LpdText>
            <LpdText size="nano" className="italic text-[8px]">Scanning timeframe confluence...</LpdText>
          </div>
        )}
      </div>
    </section>
  );
};
