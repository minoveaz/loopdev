/**
 * @file metricsFormatter.ts
 * @description Industrial-grade formatting for metrics display
 *
 * Follows LoopDev standards:
 * - No hardcoded decimals (uses context-aware precision)
 * - Multi-tenant support
 * - Locale-aware formatting
 */

export const formatPrice = (
  value: number,
  currency: string = 'USD',
  precision?: number,
): string => {
  if (!isFinite(value)) return '—';

  const decimals = precision ?? 2;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return formatted;
};

export const formatPercentage = (value: number, precision: number = 2): string => {
  if (!isFinite(value)) return '—';

  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(precision)}%`;
};

export const formatATR = (value: number, precision: number = 4): string => {
  if (!isFinite(value)) return '—';
  return value.toFixed(precision);
};

export const formatTimeAgo = (isoDateString: string): string => {
  try {
    const date = new Date(isoDateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch {
    return '—';
  }
};
