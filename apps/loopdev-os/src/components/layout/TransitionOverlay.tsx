'use client';

import { useEffect, useState } from 'react';
import { LogoSpinner } from '@loopdev/ui';

const TRANSITION_KEY = 'loopdev.organizationTransition';

export function TransitionOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(TRANSITION_KEY) !== 'pending') return undefined;
    window.sessionStorage.removeItem(TRANSITION_KEY);

    const showTimeout = window.setTimeout(() => {
      setIsVisible(true);
    }, 0);
    const hideTimeout = window.setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => {
      window.clearTimeout(showTimeout);
      window.clearTimeout(hideTimeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="dark:bg-surface-elevated fixed inset-0 z-[100] flex items-center justify-center bg-white" role="status" aria-live="polite" aria-label="Loading work context">
      <div className="flex flex-col items-center gap-4">
        <LogoSpinner size={64} />
        <span className="text-text-muted font-mono text-[10px] font-bold uppercase tracking-[0.28em]">Loading work context</span>
      </div>
    </div>
  );
}
