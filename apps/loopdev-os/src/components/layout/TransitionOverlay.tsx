'use client';

import { useLayoutEffect, useState } from 'react';
import { LogoSpinner } from '@loopdev/ui';

const TRANSITION_KEY = 'loopdev.organizationTransition';

export function TransitionOverlay() {
  const [isVisible, setIsVisible] = useState(() => (
    typeof window !== 'undefined'
    && window.sessionStorage.getItem(TRANSITION_KEY) === 'pending'
  ));

  useLayoutEffect(() => {
    if (window.sessionStorage.getItem(TRANSITION_KEY) !== 'pending') return;
    window.sessionStorage.removeItem(TRANSITION_KEY);
    const timeout = window.setTimeout(() => setIsVisible(false), 1500);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-surface-elevated" role="status" aria-live="polite" aria-label="Loading work context">
      <div className="flex flex-col items-center gap-4">
        <LogoSpinner size={64} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-text-muted">Loading work context</span>
      </div>
    </div>
  );
}
