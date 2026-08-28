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
    <section className={clsx('w-full py-6 flex flex-col gap-6', className)}>
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1.5">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={clsx('w-4 h-4', i < t.rating ? 'fill-current' : 'text-slate-200')}
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">"{t.content}"</p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-4">
              {t.avatarUrl ? (
                <img
                  src={t.avatarUrl}
                  alt={t.authorName}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-100 font-bold text-xs text-slate-600 flex items-center justify-center">
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
