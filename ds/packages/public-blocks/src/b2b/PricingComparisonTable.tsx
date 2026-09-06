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
    <section className={clsx('w-full py-8 flex flex-col gap-8', className)}>
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-2">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full items-stretch">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={clsx(
              'bg-white border rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-200',
              tier.isPopular
                ? 'border-[var(--lpd-brand-primary)] shadow-xl ring-2 ring-[var(--lpd-brand-primary)]/20 md:-translate-y-2'
                : 'border-slate-200/90 shadow-sm hover:shadow-md',
            )}
          >
            {tier.isPopular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--lpd-brand-primary)] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                Más popular
              </span>
            )}

            <div>
              <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{tier.description}</p>

              <div className="mt-4 mb-6 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {tier.price}
                </span>
                {tier.period && <span className="text-xs text-slate-500">/{tier.period}</span>}
              </div>

              <div className="border-t border-slate-100 pt-5 flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Incluye:
                </p>
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={tier.onSelect}
              className={clsx(
                'w-full py-3 px-4 text-xs font-bold rounded-xl transition-all mt-8 min-h-[44px]',
                tier.isPopular
                  ? 'bg-[var(--lpd-brand-primary)] hover:bg-[var(--lpd-brand-primary-hover)] text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800',
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
