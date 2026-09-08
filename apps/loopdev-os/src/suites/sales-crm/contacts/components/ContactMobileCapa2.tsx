'use client';

import React from 'react';
import type { ContactSegmentFilter } from '../types';
import { Users, ShieldCheck, Clock, Flame, Phone } from 'lucide-react';
import { Button } from '@loopdev/ui';

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
    <div className="pointer-events-none fixed bottom-16 left-0 right-0 z-40 block px-3 lg:hidden">
      <div className="border-border-subtle/80 bg-background/95 pointer-events-auto mx-auto max-w-lg rounded-2xl border p-1.5 shadow-lg backdrop-blur-md">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5">
          {segments.map((seg) => {
            const isActive = activeSegment === seg.id;
            return (
              <Button
                key={seg.id}
                type="button"
                variant="ghost"
                size="sm"
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
                  className={`py-0.2 ml-0.5 rounded-full px-1.5 text-[10px] font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface-active text-text-muted'
                  }`}
                >
                  {seg.count}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
