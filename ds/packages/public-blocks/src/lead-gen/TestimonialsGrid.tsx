'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Star } from 'lucide-react';
import type { TestimonialsGridProps } from './types';

export const TestimonialsGrid: React.FC<TestimonialsGridProps> = ({
  title = 'Lo que opinan nuestros clientes',
  subtitle = 'Experiencias reales de personas que ya confían en nuestros servicios.',
  testimonials,
  className,
}) => {
  return (
    <section className={clsx('flex w-full flex-col gap-6 py-6', className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div>
              {/* Stars */}
              <div className="mb-3 flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={clsx('h-4 w-4', i < t.rating ? 'fill-current' : 'text-slate-200')}
                  />
                ))}
              </div>
              <p className="text-xs italic leading-relaxed text-slate-700 sm:text-sm">
                "{t.content}"
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
              {t.avatarUrl ? (
                <img
                  src={t.avatarUrl}
                  alt={t.authorName}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                  {t.authorName.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t.authorName}</h4>
                {t.authorRole && <p className="text-[11px] text-slate-500">{t.authorRole}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
