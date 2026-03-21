'use client';

import React, { useMemo, useEffect, useRef, useState } from 'react';
import { BotCardIndustrial as BotCard, BotStatus } from '@loopdev/ui';
import { BotExecutionMetrics } from '../../components/BotExecutionMetrics';
import { useQuantOps } from '../../context';

interface BotCardItemProps {
  bot: any;
  onToggleStatus: (id: string, status: BotStatus) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * @component BotCardItem
 * @description Extracted sub-component to allow useMemo hooks for memoizing props.
 * This solves the React Rules of Hooks violation by moving useMemo out of the .map() loop.
 */
export const BotCardItem: React.FC<BotCardItemProps> = ({
  bot,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const prevBotRef = useRef<any>(null);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | null>(null);
  const [smaDirection, setSmaDirection] = useState<'up' | 'down' | null>(null);
  const [atrDirection, setAtrDirection] = useState<'up' | 'down' | null>(null);

  // Memoize bot object to prevent re-renders when data is the same
  const memoizedBot = useMemo(() => ({
    ...bot,
    macroSentiment: bot.macroSentiment,
    priceHistory: bot.priceHistory
  }), [
    bot.id,
    bot.name,
    bot.pair,
    bot.status,
    bot.currentPrice,
    bot.currentSma,
    bot.currentAtr,
    bot.macroSentiment,
    bot.priceHistory,
    bot.currentAction,
    bot.currentEntryPrice,
    bot.baseInvestmentUsdt,
    bot.currentQuantity,
    bot.openedAt,
    bot.currentPnlPct,
    bot.currentPnlUsdt,
    bot.exitTargets,
    bot.logicSnapshot,
  ]);

  // Memoize liveState to prevent unnecessary re-renders
  const isInPosition = bot.currentAction?.includes('In Position');
  const memoizedLiveState = useMemo(() => ({
    currentAction: bot.currentAction,
    logicSnapshot: bot.logicSnapshot,
    openPosition: isInPosition ? {
      entryPrice: bot.currentEntryPrice || 0,
      investedUsdt: bot.baseInvestmentUsdt || 0,
      inventory: bot.currentQuantity || 0,
      openedAt: bot.openedAt,
      quantity: bot.currentQuantity || 0,
      pnlPct: bot.currentPnlPct || 0,
      pnlUsdt: bot.currentPnlUsdt || 0,
      exitTargets: bot.exitTargets
    } : undefined
  }), [
    bot.currentAction,
    bot.logicSnapshot,
    isInPosition,
    bot.currentEntryPrice,
    bot.baseInvestmentUsdt,
    bot.currentQuantity,
    bot.openedAt,
    bot.currentPnlPct,
    bot.currentPnlUsdt,
    bot.exitTargets
  ]);

  // Track price changes and show direction indicators
  useEffect(() => {
    if (prevBotRef.current) {
      // Compare and set direction
      if (bot.currentPrice > (prevBotRef.current.currentPrice || 0)) {
        setPriceDirection('up');
        setTimeout(() => setPriceDirection(null), 2000);
      } else if (bot.currentPrice < (prevBotRef.current.currentPrice || 0)) {
        setPriceDirection('down');
        setTimeout(() => setPriceDirection(null), 2000);
      }

      if (bot.currentSma > (prevBotRef.current.currentSma || 0)) {
        setSmaDirection('up');
        setTimeout(() => setSmaDirection(null), 2000);
      } else if (bot.currentSma < (prevBotRef.current.currentSma || 0)) {
        setSmaDirection('down');
        setTimeout(() => setSmaDirection(null), 2000);
      }

      if (bot.currentAtr > (prevBotRef.current.currentAtr || 0)) {
        setAtrDirection('up');
        setTimeout(() => setAtrDirection(null), 2000);
      } else if (bot.currentAtr < (prevBotRef.current.currentAtr || 0)) {
        setAtrDirection('down');
        setTimeout(() => setAtrDirection(null), 2000);
      }
    }
    prevBotRef.current = bot;
  }, [bot.currentPrice, bot.currentSma, bot.currentAtr, bot]);

  const currentPrice = bot.currentPrice || 0;
  const targetPrice = bot.priceTarget || 0;
  const atr = bot.atrValue || 0;
  const showExecutionMetrics = !isInPosition && targetPrice > 0 && currentPrice > 0;

  const { openBotInspector } = useQuantOps();

  return (
    <div className="flex flex-col gap-4">
      <BotCard 
        bot={memoizedBot}
        liveState={memoizedLiveState}
        stats={undefined}
        priceDirection={priceDirection}
        smaDirection={smaDirection}
        atrDirection={atrDirection}
        onToggleStatus={() => onToggleStatus(bot.id, bot.status)}
        onOpenDetails={openBotInspector}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      
      {/* Execution Metrics - Shown when waiting for signal */}
      {showExecutionMetrics && (
        <BotExecutionMetrics
          currentPrice={currentPrice}
          targetPrice={targetPrice}
          atr={atr}
          recentVolatility={0.002}
          botName={bot.name}
        />
      )}
    </div>
  );
};
