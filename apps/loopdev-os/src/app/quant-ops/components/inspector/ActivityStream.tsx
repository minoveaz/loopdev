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
      <LpdText
        size="nano"
        weight="black"
        className="text-text-muted px-1 uppercase tracking-[0.2em] opacity-40"
      >
        Live_Execution_Stream
      </LpdText>
      <div className="flex flex-col gap-2">
        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3"
            >
              <div className="flex flex-col">
                <LpdText
                  size="nano"
                  weight="black"
                  className={cn(
                    'uppercase',
                    order.side === 'buy' ? 'text-emerald-500' : 'text-rose-500',
                  )}
                >
                  {order.side}_ORDER
                </LpdText>
                <LpdText size="nano" className="text-text-muted opacity-40">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleTimeString()
                    : 'Unknown time'}
                </LpdText>
              </div>
              <div className="text-right">
                <LpdText size="xs" weight="black" className="text-text-main font-mono">
                  ${(order.price ?? 0).toLocaleString()}
                </LpdText>
                <LpdText size="nano" className="text-text-muted opacity-40">
                  {order.quantity} {pair.split('/')[0]}
                </LpdText>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 p-10 text-center opacity-30">
            <Icon name="Activity" size="lg" />
            <LpdText size="nano" weight="black" className="uppercase tracking-widest">
              No_Recent_Orders
            </LpdText>
            <LpdText size="nano" className="text-[8px] italic">
              Scanning timeframe confluence...
            </LpdText>
          </div>
        )}
      </div>
    </section>
  );
};
