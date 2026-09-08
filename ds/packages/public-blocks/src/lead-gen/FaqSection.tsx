'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import type { FaqSectionProps } from './types';

export const FaqSection: React.FC<FaqSectionProps> = ({
  title = 'Preguntas Frecuentes',
  subtitle = 'Resolvemos todas tus dudas sobre el proceso y las coberturas.',
  faqs,
  className,
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const toggleFaq = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <section className={clsx('flex w-full flex-col gap-6 py-6', className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndexes.includes(index);
          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-200"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                aria-expanded={isOpen}
                className="flex min-h-[48px] w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/50 focus:outline-none"
              >
                <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown
                  className={clsx(
                    'h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200',
                    isOpen && 'rotate-180 transform text-[var(--lpd-brand-primary)]',
                  )}
                />
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 px-5 pb-4 pt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
