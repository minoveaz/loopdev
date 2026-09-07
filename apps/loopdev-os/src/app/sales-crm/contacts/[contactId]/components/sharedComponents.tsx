'use client';

import type { ReactNode } from 'react';
import { FlaskConical } from 'lucide-react';

export function SimulatedBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 select-none items-center gap-1 rounded border border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 ${className}`}
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
    <div className="border-border-subtle bg-surface-muted/10 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed px-4 py-12 text-center">
      <div className="bg-surface-muted/60 border-border-subtle shadow-xs mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl border">
        {icon}
      </div>
      <h4 className="text-text-main text-sm font-semibold">{title}</h4>
      <p className="text-text-muted mt-1 max-w-sm text-xs leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
