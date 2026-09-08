'use client';

import React from 'react';
import { clsx } from 'clsx';
import { ArrowRight, Layers } from 'lucide-react';
import type { ProductShowcaseGridProps } from './types';

export const ProductShowcaseGrid: React.FC<ProductShowcaseGridProps> = ({
  title = 'Módulos y Suites Integradas',
  subtitle = 'Herramientas de ingeniería y negocio diseñadas para operar con máxima precisión.',
  products,
  className,
}) => {
  return (
    <section className={clsx('flex w-full flex-col gap-6 py-8', className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          >
            <div>
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="rounded-xl bg-slate-100 p-2.5 text-[var(--lpd-brand-primary)] transition-colors group-hover:bg-[var(--lpd-brand-primary)] group-hover:text-white">
                  <Layers className="h-5 w-5" />
                </div>
                {product.badge && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    {product.badge}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-[var(--lpd-brand-primary)]">
                {product.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {product.description}
              </p>
            </div>

            <button
              type="button"
              onClick={product.onAction}
              className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-4 text-xs font-bold text-[var(--lpd-brand-primary)] transition-transform group-hover:translate-x-1"
            >
              <span>{product.actionLabel ?? 'Conocer más'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
