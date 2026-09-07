'use client';

import React from 'react';
import type { ContactSegmentFilter } from '../types';
import { Users, ShieldCheck, Clock, Flame, Phone } from 'lucide-react';

interface ContactMobileCapa2Props {
  activeSegment: ContactSegmentFilter;
  onSelectSegment: (segment: ContactSegmentFilter) => void;
  counts: {
    all: number;
    verified: number;
    pending: number;
    withDeals: number;
    withPhone: number;
  };
}

export function ContactMobileCapa2({
  activeSegment,
  onSelectSegment,
  counts,
}: ContactMobileCapa2Props) {
  const segments: {
    id: ContactSegmentFilter;
    label: string;
    count: number;
    icon: React.ReactNode;
  }[] = [
    { id: 'all', label: 'Todos', count: counts.all, icon: <Users size={13} strokeWidth={1.75} /> },
    {
      id: 'with_deals',
      label: 'Con Deals',
      count: counts.withDeals,
      icon: <Flame size={13} strokeWidth={1.75} />,
    },
    {
      id: 'verified',
      label: 'Verificados',
      count: counts.verified,
      icon: <ShieldCheck size={13} strokeWidth={1.75} />,
    },
    {
      id: 'pending',
      label: 'Pendientes',
      count: counts.pending,
      icon: <Clock size={13} strokeWidth={1.75} />,
    },
    {
      id: 'with_phone',
      label: 'Con Móvil',
      count: counts.withPhone,
      icon: <Phone size={13} strokeWidth={1.75} />,
    },
  ];

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 block lg:hidden px-3 pointer-events-none">
      <div className="mx-auto max-w-lg rounded-2xl border border-border-subtle/80 bg-background/95 p-1.5 shadow-lg backdrop-blur-md pointer-events-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {segments.map((seg) => {
            const isActive = activeSegment === seg.id;
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => onSelectSegment(seg.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                    : 'text-text-muted hover:bg-surface hover:text-text-main'
                }`}
              >
                {seg.icon}
                <span>{seg.label}</span>
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface-active text-text-muted'
                  }`}
                >
                  {seg.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
