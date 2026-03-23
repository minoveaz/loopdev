'use client';

import React from 'react';
import { ScanningState } from './states/ScanningState';
import { WaitingState } from './states/WaitingState';
import { InPositionState } from './states/InPositionState';

interface BotCardStateProps {
  currentAction: string;
  isActive: boolean;
  bot: any;
  onMarketExit?: () => Promise<void>;
  onSetToBE?: () => Promise<void>;
  onExecuteTP?: () => Promise<void>;
}

/**
 * @component BotCardState
 * @description State Router. 
 * Orchestrates between Scanning, Waiting, and In-Position states.
 */
export const BotCardState = ({ 
  currentAction, 
  isActive, 
  bot,
  onMarketExit,
  onSetToBE,
  onExecuteTP
}: BotCardStateProps) => {
  const isInPosition = bot.currentEntryPrice > 0;
  const isWaiting = (bot.proximityPct > 70) || currentAction?.toUpperCase().includes('WAITING');

  // --- ROUTING LOGIC ---
  
  // 1. Prioridad Máxima: Operación Abierta
  if (isInPosition) {
    return (
      <InPositionState 
        bot={bot}
        onMarketExit={onMarketExit}
        onSetToBE={onSetToBE}
        onExecuteTP={onExecuteTP}
      />
    );
  }

  // 2. Prioridad Táctica: Señal Inminente
  if (isWaiting && isActive) {
    return <WaitingState bot={bot} />;
  }

  // 3. Estado por Defecto: Búsqueda Pasiva
  return <ScanningState bot={bot} isActive={isActive} />;
};
