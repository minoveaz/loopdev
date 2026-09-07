import type { CrmContact } from '@loopdev/contracts';

export type ContactSegmentFilter = 'all' | 'verified' | 'pending' | 'with_deals' | 'with_phone';

export interface EnrichedContactMeta {
  dealCount: number;
  totalPipelineValue: number;
  leadScore?: number;
  lastActivityText: string;
}

export function contactFullName(contact: Pick<CrmContact, 'firstName' | 'lastName'>): string {
  return [contact.firstName, contact.lastName].filter(Boolean).join(' ') || 'Contacto';
}

export function getContactInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'CT';
}

/**
 * Deterministic pastel color generator inspired by Untitled UI avatar palettes
 */
export function getAvatarColorStyles(seed: string): { bg: string; text: string; border: string } {
  const palettes = [
    { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200/60 dark:border-blue-800/40' },
    { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200/60 dark:border-indigo-800/40' },
    { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200/60 dark:border-violet-800/40' },
    { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200/60 dark:border-emerald-800/40' },
    { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200/60 dark:border-teal-800/40' },
    { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-200/60 dark:border-amber-800/40' },
    { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200/60 dark:border-rose-800/40' },
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % palettes.length;
  return palettes[index];
}

export function formatRelativeActivity(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 5) return 'Reciente';
    if (diffMinutes < 60) return `Hace ${diffMinutes}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(date);
  } catch {
    return 'Reciente';
  }
}

export function formatCurrencyAmount(amount: number, currency = 'EUR'): string {
  try {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} €`;
  }
}
