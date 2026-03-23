'use client';

import { useBotFleet } from './useBotFleet';

/**
 * @hook usePortfolioStats
 * @description Aggregates fleet data for high-level governance metrics.
 * Derived from useBotFleet to ensure Cents precision consistency.
 */
export const usePortfolioStats = () => {
  const { bots, isLoading } = useBotFleet();

  // Todos los cálculos se realizan sobre datos ya convertidos de Cents a Float por useBotFleet
  const activeBotsCount = bots.filter(b => b.status === 'active' || b.status === 'paper_trading').length;
  const openPositions = bots.filter(b => b.currentEntryPrice > 0);
  const openPositionsCount = openPositions.length;

  const deployedCapital = bots.reduce((acc, b) => acc + (b.baseInvestmentUsdt || 0), 0);
  
  const unrealizedPnlUsdt = bots.reduce((acc, b) => acc + (b.currentPnlUsdt || 0), 0);
  const realizedPnlUsdt = bots.reduce((acc, b) => acc + (b.realized_pnl_usdt || 0), 0); // Asumiendo que useBotFleet mapea este campo
  
  // Equity = Capital Base + PnL Realizado + PnL No Realizado
  const totalEquity = deployedCapital + unrealizedPnlUsdt;
  
  const unrealizedPnlPct = deployedCapital > 0 
    ? (unrealizedPnlUsdt / deployedCapital) * 100 
    : 0;

  return {
    totalEquity,
    unrealizedPnlUsdt,
    unrealizedPnlPct,
    deployedCapital,
    activeBotsCount,
    openPositionsCount,
    activePositions: openPositions,
    isLoading
  };
};
