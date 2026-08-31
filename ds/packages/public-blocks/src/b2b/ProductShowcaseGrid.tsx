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
    <section className={clsx('w-full py-8 flex flex-col gap-6', className)}>
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1.5">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-2.5 rounded-xl bg-slate-100 text-[var(--lpd-brand-primary)] group-hover:bg-[var(--lpd-brand-primary)] group-hover:text-white transition-colors">
                  <Layers className="w-5 h-5" />
                </div>
                {product.badge && (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[var(--lpd-brand-primary)] transition-colors">
                {product.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            <button
              type="button"
              onClick={product.onAction}
              className="flex items-center gap-1.5 text-xs font-bold text-[var(--lpd-brand-primary)] group-hover:translate-x-1 transition-transform pt-4 mt-4 border-t border-slate-100"
            >
              <span>{product.actionLabel ?? 'Conocer más'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
