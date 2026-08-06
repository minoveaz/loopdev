'use client';

import React from 'react';
import { ActivityStreamProps } from './types';
import { TechnicalSurface, LpdText, Skeleton } from '../../../atoms';
import { cn } from '../../../../helpers/cn';

/**
 * @component ActivityStream
 * @description Operational audit trail for trading events.
 * Implements high-density technical logging from Section 16 of Blueprint UX.
 */
export const ActivityStream: React.FC<ActivityStreamProps> = ({
  events,
  isLive = false,
  title,
  isLoading = false,
  className
}) => {
  
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {title && (
        <div className="flex items-center justify-between px-2 shrink-0">
          <LpdText size="nano" weight="bold" className="uppercase italic tracking-tighter opacity-60 font-sans">
            {title}
          </LpdText>
          {isLive && (
            <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-emerald-500 animate-pulse">
              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
              Live_Stream
            </div>
          )}
        </div>
      )}

      <TechnicalSurface variant="surface" depth="flat" className="overflow-hidden border-border-technical/20 rounded-3xl">
        <div className="flex flex-col font-mono divide-y divide-border-technical/10">
          {events.length === 0 ? (
            <div className="p-12 text-center opacity-30 italic">
              <LpdText size="sm">// awaiting_system_events</LpdText>
            </div>
          ) : (
            events.map((event) => (
              <div 
                key={event.id} 
                className="flex items-center gap-4 md:gap-8 p-4 text-[10px] hover:bg-background-subtle/50 transition-colors group"
              >
                {/* 1. Time & Type */}
                <span className="text-text-muted shrink-0 w-14">{event.time}</span>
                
                <span className={cn(
                  "font-black w-14 px-1.5 py-0.5 rounded text-center border transition-colors",
                  event.type === 'BUY' && "bg-emerald-500/5 border-emerald-500/20 text-emerald-500",
                  event.type === 'SELL' && "bg-amber-500/5 border-amber-500/20 text-amber-500",
                  event.type === 'REBUY' && "bg-blue-500/5 border-blue-500/20 text-blue-500",
                  event.type === 'RISK' && "bg-rose-500/5 border-rose-500/20 text-rose-500",
                  (event.type === 'SYSTEM' || event.type === 'SYNC') && "bg-slate-500/5 border-slate-500/20 text-slate-400",
                  event.type === 'ERROR' && "bg-rose-600 text-white border-rose-600"
                )}>
                  {event.type}
                </span>

                {/* 2. Pair / Strategy Context */}
                <div className="flex flex-col w-24 shrink-0">
                  <span className="font-bold text-text-main truncate">{event.pair || 'SYSTEM'}</span>
                  {event.strategy && (
                    <span className="text-[8px] opacity-40 uppercase tracking-tighter truncate">{event.strategy}</span>
                  )}
                </div>

                {/* 3. Operational Data / Message */}
                <span className="flex-1 opacity-70 truncate">
                  {event.message ? (
                    <span className="italic">// {event.message}</span>
                  ) : (
                    <span>QTY: {event.qty} @ {event.price}</span>
                  )}
                </span>

                {/* 4. Status Badge */}
                <div className={cn(
                  "px-2 py-0.5 rounded-md border text-[8px] font-black uppercase shrink-0 transition-all",
                  event.status === 'filled' || event.status === 'success' 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600' 
                    : event.status === 'rejected' || event.status === 'canceled'
                    ? 'bg-rose-500/5 border-rose-500/20 text-rose-600'
                    : 'bg-amber-500/5 border-amber-500/20 text-amber-600'
                )}>
                  {event.status}
                </div>
              </div>
            ))
          )}
        </div>
      </TechnicalSurface>
    </div>
  );
};
