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
    <section className={clsx('w-full py-6 flex flex-col gap-6', className)}>
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1.5">{subtitle}</p>}
      </div>

      <div className="max-w-3xl mx-auto w-full flex flex-col gap-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndexes.includes(index);
          return (
            <div
              key={index}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-shadow duration-200 shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                aria-expanded={isOpen}
                className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-slate-50/50 transition-colors focus:outline-none min-h-[48px]"
              >
                <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown
                  className={clsx(
                    'w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0',
                    isOpen && 'transform rotate-180 text-[var(--lpd-brand-primary)]',
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
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
