import type { Customer360RecordView } from '@loopdev/contracts';

export type CustomerTabKey = 'contact' | 'timeline' | 'opportunities' | 'tasks' | 'notes';

export function contactName(view: Customer360RecordView) {
  return [view.contact.firstName, view.contact.lastName].filter(Boolean).join(' ') || 'Contact';
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'CT';
}

export function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value));
  } catch {
    return value;
  }
}

export function formatCurrency(amount: number | null | undefined, currency = 'EUR') {
  if (amount == null) return '0,00 €';
  try {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}
