'use client';

import React, { useMemo, useEffect, useRef, useState } from 'react';
import { BotCardIndustrial as BotCard } from '@loopdev/ui';
import type { BotStatus } from '@loopdev/contracts';
import { BotExecutionMetrics } from '../../components/BotExecutionMetrics';
import { useQuantOps } from '../../context';

interface BotCardData {
  id: string;
  name: string;
  pair: string;
  status: BotStatus;
  currentPrice?: number;
  currentSma?: number;
  currentAtr?: number;
  priceTarget?: number;
  atrValue?: number;
  currentAction?: string;
  currentEntryPrice?: number;
  baseInvestmentUsdt?: number;
  currentQuantity?: number;
  openedAt?: string;
  currentPnlPct?: number;
  currentPnlUsdt?: number;
  macroSentiment?: string;
  priceHistory?: number[];
  strategyName?: string;
  coreId?: string;
  updatedAt?: string;
  trailingStopDistance?: number;
  exitTargets?: { tpPrice?: number; slPrice?: number; bePrice?: number };
  logicSnapshot?: Record<string, unknown>;
}

interface BotCardItemProps {
  bot: BotCardData;
  onToggleStatus: (id: string, status: BotStatus) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMarketExit?: (id: string) => Promise<void>;
  onSetToBE?: (id: string) => Promise<void>;
  onExecuteTP?: (id: string) => Promise<void>;
  onUpdateTrail?: (id: string, distance: number) => Promise<void>;
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
  onMarketExit,
  onSetToBE,
  onExecuteTP,
  onUpdateTrail,
}) => {
  const prevBotRef = useRef<BotCardData | null>(null);

  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | null>(null);
  const [smaDirection, setSmaDirection] = useState<'up' | 'down' | null>(null);
  const [atrDirection, setAtrDirection] = useState<'up' | 'down' | null>(null);

  // Memoize bot object to prevent re-renders when data is the same
  const memoizedBot = {
    ...bot,
    macroSentiment: bot.macroSentiment,
    priceHistory: bot.priceHistory,
    strategyName: bot.strategyName,
    coreId: bot.coreId,
    updatedAt: bot.updatedAt,
    trailingStopDistance: bot.trailingStopDistance,
  };

  // Memoize liveState to prevent unnecessary re-renders
  const isInPosition = bot.currentAction?.includes('In Position');
  const memoizedLiveState = useMemo(
    () => ({
      currentAction: bot.currentAction,
      logicSnapshot: bot.logicSnapshot,
      openPosition: isInPosition
        ? {
            entryPrice: bot.currentEntryPrice || 0,
            investedUsdt: bot.baseInvestmentUsdt || 0,
            inventory: bot.currentQuantity || 0,
            openedAt: bot.openedAt,
            quantity: bot.currentQuantity || 0,
            pnlPct: bot.currentPnlPct || 0,
            pnlUsdt: bot.currentPnlUsdt || 0,
            exitTargets: bot.exitTargets,
          }
        : undefined,
    }),
    [
      bot.currentAction,
      bot.logicSnapshot,
      isInPosition,
      bot.currentEntryPrice,
      bot.baseInvestmentUsdt,
      bot.currentQuantity,
      bot.openedAt,
      bot.currentPnlPct,
      bot.currentPnlUsdt,
      bot.exitTargets,
    ],
  );

  // Track price changes and show direction indicators
  useEffect(() => {
    if (prevBotRef.current) {
      // Compare and set direction
      if ((bot.currentPrice || 0) > (prevBotRef.current.currentPrice || 0)) {
        queueMicrotask(() => setPriceDirection('up'));
        setTimeout(() => setPriceDirection(null), 2000);
      } else if ((bot.currentPrice || 0) < (prevBotRef.current.currentPrice || 0)) {
        queueMicrotask(() => setPriceDirection('down'));
        setTimeout(() => setPriceDirection(null), 2000);
      }

      if ((bot.currentSma || 0) > (prevBotRef.current.currentSma || 0)) {
        queueMicrotask(() => setSmaDirection('up'));
        setTimeout(() => setSmaDirection(null), 2000);
      } else if ((bot.currentSma || 0) < (prevBotRef.current.currentSma || 0)) {
        queueMicrotask(() => setSmaDirection('down'));
        setTimeout(() => setSmaDirection(null), 2000);
      }

      if ((bot.currentAtr || 0) > (prevBotRef.current.currentAtr || 0)) {
        queueMicrotask(() => setAtrDirection('up'));
        setTimeout(() => setAtrDirection(null), 2000);
      } else if ((bot.currentAtr || 0) < (prevBotRef.current.currentAtr || 0)) {
        queueMicrotask(() => setAtrDirection('down'));
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
        onMarketExit={onMarketExit}
        onSetToBE={onSetToBE}
        onExecuteTP={onExecuteTP}
        onUpdateTrail={onUpdateTrail}
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
