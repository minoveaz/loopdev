import { useMemo } from 'react';

/**
 * @hook useBotCardMetrics
 * @description Offloads business logic from the UI layer to maintain 60FPS performance.
 */
export const useBotCardMetrics = (liveState: any) => {
  return useMemo(() => {
    if (!liveState?.openPosition) return null;

    const { openedAt, pnlPct, pnlUsdt, exitTargets } = liveState.openPosition;
    
    // Calculate Duration
    const duration = (() => {
      if (!openedAt) return '0m';
      const diff = Math.floor((new Date().getTime() - new Date(openedAt).getTime()) / 60000);
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    })();

    // Risk Corridor Progress
    const progress = Math.min(Math.max(50 + (pnlPct * 10), 5), 95);

    return {
      duration,
      progress,
      isPositive: pnlPct >= 0,
      formattedPnl: `${pnlUsdt >= 0 ? '+' : ''}$${pnlUsdt.toLocaleString()}`,
      formattedPct: `${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%`
    };
  }, [liveState]);
};
