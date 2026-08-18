'use client';

import { Loader2, Search, X } from 'lucide-react';
import type React from 'react';
import { useId } from 'react';
import { cn } from '../../../../helpers/cn';
import type { SearchInputProps } from './types';

export type { SearchInputProps, SearchInputTone } from './types';

export function SearchInput({
  value,
  onValueChange,
  onClear,
  onSubmit,
  loading = false,
  tone = 'default',
  clearLabel = 'Clear search',
  loadingLabel = 'Loading search results',
  colors,
  id,
  className,
  placeholder = 'Search',
  disabled,
  'aria-label': ariaLabel,
  ...inputProps
}: SearchInputProps) {
  const generatedId = useId();
  const inputId = id ?? `search-input-${generatedId}`;
  const clear = () => {
    onValueChange('');
    onClear?.();
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') onSubmit?.();
    inputProps.onKeyDown?.(event);
  };
  const toneClass =
    tone === 'quiet'
      ? 'bg-transparent border-transparent'
      : tone === 'accent'
        ? 'bg-bg-primary-subtle border-primary'
        : 'bg-shell-surface border-border-technical';
  const style = {
    ...(colors?.surface ? { '--search-surface': colors.surface } : {}),
    ...(colors?.border ? { '--search-border': colors.border } : {}),
    ...(colors?.text ? { '--search-text': colors.text } : {}),
    ...(colors?.placeholder ? { '--search-placeholder': colors.placeholder } : {}),
    ...(colors?.accent ? { '--search-accent': colors.accent } : {}),
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-2 rounded-md border px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-primary',
        toneClass,
        className,
      )}
      style={style}
      data-search-input="true"
      data-tone={tone}
    >
      {loading ? (
        <Loader2 className="size-4 shrink-0 animate-spin text-[var(--search-accent,var(--color-primary))]" aria-hidden="true" />
      ) : (
        <Search className="size-4 shrink-0 text-[var(--search-accent,var(--color-primary))]" aria-hidden="true" />
      )}
      <input
        {...inputProps}
        id={inputId}
        value={value}
        disabled={disabled || loading}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel ?? 'Search'}
        aria-busy={loading || undefined}
        className="min-w-0 flex-1 bg-transparent text-sm text-[var(--search-text,var(--color-text-main))] outline-none placeholder:text-[var(--search-placeholder,var(--color-text-muted))]"
        style={{ backgroundColor: 'var(--search-surface,transparent)', borderColor: 'var(--search-border,transparent)' }}
      />
      {loading ? <span className="sr-only">{loadingLabel}</span> : null}
      {value && !loading ? (
        <button type="button" className="shrink-0 text-text-muted hover:text-text-main" onClick={clear} aria-label={clearLabel}>
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
