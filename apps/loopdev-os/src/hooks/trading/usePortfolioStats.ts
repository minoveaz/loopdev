'use client';

import { useMemo } from 'react';
import { useBotFleet } from './useBotFleet';

/**
 * @hook usePortfolioStats
 * @description Aggregates real-time data from the entire bot fleet for the Overview Dashboard.
 */
export const usePortfolioStats = () => {
  const { bots, isLoading } = useBotFleet();

  return useMemo(() => {
    if (isLoading || !bots.length) {
      return {
        totalEquity: 0,
        unrealizedPnlUsdt: 0,
        unrealizedPnlPct: 0,
        deployedCapital: 0,
        activeBotsCount: 0,
        openPositionsCount: 0,
        activePositions: []
      };
    }

    let totalInvested = 0;
    let totalPnlUsdt = 0;
    let activeBots = 0;
    
    const openPositions = bots.filter(bot => {
      if (bot.status === 'active' || bot.status === 'paper_trading') activeBots++;
      return bot.currentAction?.includes('In Position');
    });

    bots.forEach(bot => {
      // Only count capital if in position
      const isInPos = bot.currentAction?.includes('In Position');
      if (isInPos) {
        totalInvested += Number(bot.baseInvestmentUsdt || 0);
        totalPnlUsdt += Number(bot.currentPnlUsdt || 0);
      }
    });

    const pnlPct = totalInvested > 0 ? (totalPnlUsdt / totalInvested) * 100 : 0;

    return {
      totalEquity: totalInvested + totalPnlUsdt,
      unrealizedPnlUsdt: totalPnlUsdt,
      unrealizedPnlPct: pnlPct,
      deployedCapital: totalInvested,
      activeBotsCount: activeBots,
      openPositionsCount: openPositions.length,
      activePositions: openPositions.map(bot => ({
        id: bot.id,
        pair: bot.pair,
        side: 'LONG', // Default for now
        strategy: bot.strategyId,
        entryPrice: bot.currentEntryPrice?.toLocaleString() || '---',
        currentPrice: '---', // Will be updated by WS in the table if possible
        quantity: bot.currentQuantity?.toFixed(4) || '0',
        valueUsdt: bot.baseInvestmentUsdt?.toLocaleString() || '0',
        pnlPct: `${bot.currentPnlPct > 0 ? '+' : ''}${bot.currentPnlPct}`,
        pnlUsdt: bot.currentPnlUsdt?.toLocaleString() || '0',
        status: bot.currentPnlPct >= 0 ? 'healthy' : 'at_risk'
      }))
    };
  }, [bots, isLoading]);
};
