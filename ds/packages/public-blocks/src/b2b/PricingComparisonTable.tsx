'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import type { PricingComparisonTableProps } from './types';

export const PricingComparisonTable: React.FC<PricingComparisonTableProps> = ({
  title = 'Planes transparentes y escalables',
  subtitle = 'Elige el plan que mejor se adapte a tu escala y volumen operativo.',
  tiers,
  className,
}) => {
  return (
    <section className={clsx('flex w-full flex-col gap-8 py-8', className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={clsx(
              'relative flex flex-col justify-between rounded-3xl border bg-white p-6 transition-all duration-200 sm:p-8',
              tier.isPopular
                ? 'ring-[var(--lpd-brand-primary)]/20 border-[var(--lpd-brand-primary)] shadow-xl ring-2 md:-translate-y-2'
                : 'border-slate-200/90 shadow-sm hover:shadow-md',
            )}
          >
            {tier.isPopular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--lpd-brand-primary)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                Más popular
              </span>
            )}

            <div>
              <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{tier.description}</p>

              <div className="mb-6 mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                  {tier.price}
                </span>
                {tier.period && <span className="text-xs text-slate-500">/{tier.period}</span>}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Incluye:
                </p>
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={tier.onSelect}
              className={clsx(
                'mt-8 min-h-[44px] w-full rounded-xl px-4 py-3 text-xs font-bold transition-all',
                tier.isPopular
                  ? 'bg-[var(--lpd-brand-primary)] text-white shadow-md hover:bg-[var(--lpd-brand-primary-hover)]'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
              )}
            >
              {tier.ctaLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
