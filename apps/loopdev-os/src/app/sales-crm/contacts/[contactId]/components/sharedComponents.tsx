'use client';

import type { ReactNode } from 'react';
import { FlaskConical } from 'lucide-react';

export function SimulatedBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider select-none shrink-0 ${className}`}
      title="Dato simulado para pruebas de interfaz y diseño"
    >
      <FlaskConical className="h-2.5 w-2.5" />
      SIM
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-border-subtle bg-surface-muted/10 flex-1">
      <div className="h-12 w-12 rounded-2xl bg-surface-muted/60 border border-border-subtle flex items-center justify-center mb-3.5 shadow-xs">
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-text-main">{title}</h4>
      <p className="mt-1 text-xs text-text-muted max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
