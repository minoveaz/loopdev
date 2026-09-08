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
        'grid w-full grid-cols-1 items-center gap-8 py-10 lg:grid-cols-12 lg:gap-12',
        className,
      )}
    >
      {/* Content Column */}
      <div
        className={clsx(
          'flex flex-col gap-4 lg:col-span-6',
          reversed ? 'lg:order-2' : 'lg:order-1',
        )}
      >
        {badge && (
          <span className="bg-[var(--lpd-brand-primary)]/10 inline-block self-start rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--lpd-brand-primary)]">
            {badge}
          </span>
        )}

        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>

        <p className="text-sm leading-relaxed text-slate-600">{description}</p>

        {bullets.length > 0 && (
          <div className="flex flex-col gap-2.5 pt-2">
            {bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 sm:text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
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
          'flex min-h-[300px] items-center justify-center overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50/50 shadow-inner lg:col-span-6',
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
