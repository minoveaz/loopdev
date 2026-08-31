'use client';

import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2 } from 'lucide-react';
import type { FeatureSpotlightProps } from './types';

export const FeatureSpotlight: React.FC<FeatureSpotlightProps> = ({
  badge,
  title,
  description,
  bullets,
  ctaSlot,
  visualSlot,
  reversed = false,
  className,
}) => {
  return (
    <section
      className={clsx(
        'w-full py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center',
        className,
      )}
    >
      {/* Content Column */}
      <div
        className={clsx(
          'lg:col-span-6 flex flex-col gap-4',
          reversed ? 'lg:order-2' : 'lg:order-1',
        )}
      >
        {badge && (
          <span className="inline-block self-start px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--lpd-brand-primary)] bg-[var(--lpd-brand-primary)]/10 rounded-full">
            {badge}
          </span>
        )}

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
          {title}
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>

        {bullets.length > 0 && (
          <div className="flex flex-col gap-2.5 pt-2">
            {bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        )}

        {ctaSlot && <div className="pt-3">{ctaSlot}</div>}
      </div>

      {/* Visual / Mockup Column */}
      <div
        className={clsx(
          'lg:col-span-6 rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-50/50 shadow-inner flex items-center justify-center min-h-[300px]',
          reversed ? 'lg:order-1' : 'lg:order-2',
        )}
      >
        {visualSlot ?? (
          <div className="p-8 text-center text-xs text-slate-400">Mockup visual del producto</div>
        )}
      </div>
    </section>
  );
};
