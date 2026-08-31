'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Star } from 'lucide-react';
import type { FeedbackRatingBlockProps } from './types';

const defaultFeedbackTags = [
  'Puntualidad excelente',
  'Gran nivel deportivo',
  'Ambiente muy positivo',
  'Ubicación perfecta',
  'Capitán muy atento',
  'Repetiré seguro',
];

export const FeedbackRatingBlock: React.FC<FeedbackRatingBlockProps> = ({
  activityTitle,
  onSubmit,
  className,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      rating,
      comment: comment.trim() || undefined,
      tags: selectedTags,
    });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={clsx('bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm', className)}>
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Star className="w-6 h-6 fill-current" />
        </div>
        <h3 className="text-base font-bold text-slate-900">¡Gracias por tu valoración!</h3>
        <p className="text-xs text-slate-500 mt-1">Tu feedback ayuda a mejorar la comunidad de deportistas.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx('bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4', className)}
    >
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--lpd-brand-primary)]">
          Valoración Post-Actividad
        </span>
        <h3 className="text-base font-bold text-slate-900 mt-0.5">{activityTitle}</h3>
        <p className="text-xs text-slate-500 mt-1">¿Cómo fue tu experiencia con el Crew?</p>
      </div>

      {/* Stars Interactive Rating */}
      <div className="flex items-center gap-1.5 py-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hoverRating ?? rating) >= star;
          return (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              aria-label={`${star} estrellas`}
              className="p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <Star className={clsx('w-6 h-6', isFilled ? 'fill-current' : 'text-slate-300')} />
            </button>
          );
        })}
      </div>

      {/* Quick Feedback Tags */}
      <div className="flex flex-wrap gap-1.5">
        {defaultFeedbackTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={clsx(
                'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors min-h-[32px]',
                isSelected
                  ? 'bg-[var(--lpd-brand-primary)]/10 text-[var(--lpd-brand-primary)] border-[var(--lpd-brand-primary)] font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Optional Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comentario adicional para el capitán o la comunidad (opcional)..."
        rows={3}
        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--lpd-brand-primary)] focus:bg-white transition-all resize-none"
      />

      <button
        type="submit"
        className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[var(--lpd-brand-primary)] hover:bg-[var(--lpd-brand-primary-hover)] rounded-xl transition-colors shadow-sm min-h-[40px]"
      >
        Enviar valoración
      </button>
    </form>
  );
};
