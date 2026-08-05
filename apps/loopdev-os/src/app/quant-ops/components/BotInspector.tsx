'use client';

import React, { useMemo } from 'react';
import { InspectorPanel, Button, LpdText, cn } from '@loopdev/ui';
import { useBotFleet } from '@/hooks/trading/useBotFleet';
import { useQuantOps } from '../context';

// Atomic Subcomponents
import { InspectorHeader } from './inspector/InspectorHeader';
import { SessionPulse } from './inspector/SessionPulse';
import { SignalWatch } from './inspector/SignalWatch';
import { ActivityStream } from './inspector/ActivityStream';
import { EngineLogs } from './inspector/EngineLogs';

/**
 * @component BotInspectorIndustrial
 * @description Refactored Industrial Console. 
 * Assembles atomic subcomponents for robust management.
 */
export const BotInspectorIndustrial: React.FC = () => {
  const { selectedBotId, closeInspector } = useQuantOps();
  const { bots } = useBotFleet();
  
  const bot = useMemo(() => bots.find(b => b.id === selectedBotId), [bots, selectedBotId]);
  
  if (!selectedBotId || !bot) return null;

  const isInPosition = bot.currentAction?.includes('In Position');
  const confluence: number = bot.macroSentiment === 'bullish' ? 66 : 0;

  return (
    <InspectorPanel
      title="AGENT_COMMAND_CONSOLE"
      onClose={closeInspector}
      className={cn(
        "pt-14 px-6 transition-all duration-500",
        confluence === 100 && "border-l-2 border-emerald-500/50 shadow-[inset_10px_0_20px_rgba(16,185,129,0.05)]"
      )}
      footerSlot={
        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-2">
            <Button variant="danger" size="md" fullWidth startIcon="bolt" className="font-black uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-rose-500/10">
              PANIC_EXIT
            </Button>
            <Button variant="outline" size="md" fullWidth startIcon="settings" className="font-black uppercase tracking-[0.2em] h-14 rounded-2xl border-white/10 hover:bg-white/5">
              CONFIG
            </Button>
          </div>
          <LpdText size="nano" className="text-center text-text-muted opacity-40 font-mono tracking-tighter italic">
            // authenticated_session_node: 0x{bot.id.substring(0,8)}
          </LpdText>
        </div>
      }
    >
      <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
        
        {/* 1. Header: Identity & Connectivity */}
        <InspectorHeader bot={bot} />

        {/* 2. Metrics: Session Pulse */}
        <SessionPulse bot={bot} />

        {/* 3. Logic: Signal Heatmap (RESTORED) */}
        {!isInPosition && <SignalWatch bot={bot} confluence={confluence} />}

        {/* 4. Activity: Execution Stream */}
        <ActivityStream botId={bot.id} pair={bot.pair} />

        {/* 5. Narrative: Decision Logs */}
        <EngineLogs bot={bot} />

      </div>
    </InspectorPanel>
  );
};
