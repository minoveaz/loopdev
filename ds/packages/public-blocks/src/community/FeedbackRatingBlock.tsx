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
      <div
        className={clsx(
          'rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm',
          className,
        )}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Star className="h-6 w-6 fill-current" />
        </div>
        <h3 className="text-base font-bold text-slate-900">¡Gracias por tu valoración!</h3>
        <p className="mt-1 text-xs text-slate-500">
          Tu feedback ayuda a mejorar la comunidad de deportistas.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(
        'flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
        className,
      )}
    >
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--lpd-brand-primary)]">
          Valoración Post-Actividad
        </span>
        <h3 className="mt-0.5 text-base font-bold text-slate-900">{activityTitle}</h3>
        <p className="mt-1 text-xs text-slate-500">¿Cómo fue tu experiencia con el Crew?</p>
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
              className="flex min-h-[36px] min-w-[36px] items-center justify-center p-1 text-amber-400 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star className={clsx('h-6 w-6', isFilled ? 'fill-current' : 'text-slate-300')} />
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
                'min-h-[32px] rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                isSelected
                  ? 'bg-[var(--lpd-brand-primary)]/10 border-[var(--lpd-brand-primary)] font-semibold text-[var(--lpd-brand-primary)]'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100',
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
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lpd-brand-primary)]"
      />

      <button
        type="submit"
        className="min-h-[40px] w-full rounded-xl bg-[var(--lpd-brand-primary)] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[var(--lpd-brand-primary-hover)]"
      >
        Enviar valoración
      </button>
    </form>
  );
};
