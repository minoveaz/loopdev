'use client';

import React, { useState } from 'react';
import { LpdText, Heading, Icon, Skeleton, Button, TechnicalDialog, toast } from '@loopdev/ui';
import type { BotConfig, BotStatus } from '@loopdev/contracts';
import { DeployBotModal } from '../components/DeployBotModal';
import { BotCardItem } from './components/BotCardItem';
import { useBotFleet } from '@/hooks/trading/useBotFleet';

/**
 * @page BotFleetPage
 * @description Operational management of all bot instances.
 * Connected to Quant Core via Supabase.
 */
export default function BotFleetPage() {
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<
    ReturnType<typeof useBotFleet>['bots'][number] | null
  >(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    botId: string | null;
  }>({ isOpen: false, botId: null });

  const { bots, isLoading, deployBot, toggleStatus, updateBot, deleteBot, executeCommand } =
    useBotFleet();

  const handleToggleStatus = (id: string, current: BotStatus) => {
    const nextStatus: BotStatus = current === 'active' ? 'paused' : 'active';
    toggleStatus({ id, status: nextStatus });
  };

  const handleMarketExit = async (id: string) => {
    executeCommand({ id, command: 'MARKET_EXIT' });
    toast.show({
      tenantId: 'loopdev',
      title: 'Manual_Exit_Triggered',
      description: 'The engine is processing an immediate market liquidation.',
      variant: 'info',
    });
  };

  const handleSetToBE = async (id: string) => {
    executeCommand({ id, command: 'MOVE_TO_BE' });
    toast.show({
      tenantId: 'loopdev',
      title: 'Stop_Loss_Adjusted',
      description: 'The stop loss has been synchronized with the break-even level.',
      variant: 'success',
    });
  };

  const handleExecuteTP = async (id: string) => {
    executeCommand({ id, command: 'TP_NOW' });
    toast.show({
      tenantId: 'loopdev',
      title: 'TP_Exit_Triggered',
      description: 'The agent is closing the position at the current market price.',
      variant: 'info',
    });
  };

  const handleUpdateTrail = async (id: string, distance: number) => {
    executeCommand({ id, command: `TRAIL_DISTANCE:${distance}` });
    toast.show({
      tenantId: 'loopdev',
      title: 'Trailing_Agressiveness_Updated',
      description: `Targeting a ${distance}% callback distance from peak.`,
      variant: 'success',
    });
  };

  const handleOpenDeploy = () => {
    setEditingBot(null);
    setIsDeployModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const bot = bots.find((b) => b.id === id);
    if (!bot) return;
    setEditingBot(bot);
    setIsDeployModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmation({ isOpen: true, botId: id });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.botId) {
      deleteBot(deleteConfirmation.botId, {
        onSuccess: () => {
          setDeleteConfirmation({ isOpen: false, botId: null });
          toast.show({
            tenantId: 'loopdev',
            title: 'Bot_Terminated',
            description: 'The bot instance has been removed from the fleet.',
            variant: 'info',
          });
        },
      });
    }
  };

  const handleSaveBot = (newBotData: Partial<BotConfig>) => {
    const riskProfile = (newBotData.riskProfile ?? {}) as Partial<BotConfig['riskProfile']>;
    const botPayload = {
      name: newBotData.name ?? '',
      exchangeId: newBotData.exchangeId ?? '',
      pair: newBotData.pair ?? '',
      strategyId: newBotData.strategyId ?? '',
      baseInvestmentUsdt: newBotData.baseInvestmentUsdt ?? 1000,
      riskProfile: {
        maxDailyLossPct: riskProfile.maxDailyLossPct ?? 2,
        globalStopLossPct: riskProfile.globalStopLossPct ?? 5,
        maxRebuys: riskProfile.maxRebuys ?? 3,
        maxExposureUsdt: riskProfile.maxExposureUsdt ?? 5000,
      },
      useInitialRangeFilter: newBotData.useInitialRangeFilter ?? true,
      useMarketRegimeFilter: newBotData.useMarketRegimeFilter ?? true,
    };

    if (editingBot) {
      updateBot(
        { id: editingBot.id, params: botPayload },
        {
          onSuccess: () => {
            toast.show({
              tenantId: 'loopdev',
              title: 'Bot_Updated',
              description: 'The bot configuration has been successfully synchronized.',
              variant: 'success',
            });
          },
        },
      );
    } else {
      deployBot(botPayload, {
        onSuccess: () => {
          toast.show({
            tenantId: 'loopdev',
            title: 'Bot_Deployed',
            description: 'A new trading agent has been added to your fleet.',
            variant: 'success',
          });
        },
      });
    }

    setIsDeployModalOpen(false);
    setEditingBot(null);
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col gap-12 p-8">
        <Skeleton className="h-20 w-1/3 rounded-xl" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Skeleton className="h-[340px] w-full rounded-3xl" />
          <Skeleton className="h-[340px] w-full rounded-3xl" />
          <Skeleton className="h-[340px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <main className="animate-in fade-in custom-scrollbar mx-auto flex h-full max-w-[1600px] flex-col gap-12 overflow-y-auto p-8 pb-32 duration-700">
      <DeployBotModal
        isOpen={isDeployModalOpen}
        onClose={() => {
          setIsDeployModalOpen(false);
          setEditingBot(null);
        }}
        onDeploy={handleSaveBot}
        initialData={editingBot ?? undefined}
      />

      {/* 1. STANDARDIZED HEADER */}
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-amber-500">
            <span className="material-symbols-outlined text-sm font-bold">hub</span>
            <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em]">
              Operational_Fleet_Manager
            </LpdText>
          </div>
          <Heading
            size="2xl"
            weight="bold"
            className="text-text-main uppercase italic tracking-tight"
          >
            Bot_Fleet_Control<span className="text-amber-500">.</span>
          </Heading>
          <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
            Monitor, deploy, and scale your algorithmic agents. All instances are synchronized with
            the Quant Core Engine.
          </LpdText>
        </div>

        <Button
          variant="energy"
          onClick={handleOpenDeploy}
          startIcon="add"
          className="px-8 shadow-xl shadow-amber-500/20"
        >
          Deploy_New_Bot
        </Button>
      </header>

      {/* 2. FLEET GRID */}
      {bots.length > 0 ? (
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {bots.map((bot) => (
            <BotCardItem
              key={bot.id}
              bot={bot}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarketExit={handleMarketExit}
              onSetToBE={handleSetToBE}
              onExecuteTP={handleExecuteTP}
              onUpdateTrail={handleUpdateTrail}
            />
          ))}
        </section>
      ) : (
        <section className="border-border-technical/50 bg-background-surface/50 flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed p-24 backdrop-blur-sm">
          <div className="bg-energy-yellow/5 border-energy-yellow/10 text-energy-yellow/40 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border">
            <Icon name="Bot" size="lg" />
          </div>
          <Heading size="lg" weight="bold" className="text-text-main mb-2">
            No Bots Deployed
          </Heading>
          <LpdText size="sm" className="text-text-muted mb-8 max-w-sm text-center">
            Your fleet is currently offline. Start by deploying your first trading agent using a
            certified strategy logic.
          </LpdText>
          <Button variant="primary" className="px-12" onClick={handleOpenDeploy}>
            Deploy_Your_First_Bot
          </Button>
        </section>
      )}

      {/* 5. DELETE CONFIRMATION DIALOG */}
      <TechnicalDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, botId: null })}
        title="Terminate_Bot_Instance"
        description="Warning: Termination is permanent. This bot will stop all market monitoring and close its execution loop in the core engine."
        variant="danger"
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmation({ isOpen: false, botId: null })}
            >
              Cancel_Action
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Terminate_Bot
            </Button>
          </>
        }
      >
        <div className="bg-status-error/5 border-status-error/10 flex gap-3 rounded-xl border p-4">
          <span className="material-symbols-outlined text-status-error">warning</span>
          <LpdText size="xs" className="text-status-error/80 font-medium leading-relaxed">
            Confirming this action will purge the bot&apos;s configuration from the active fleet.
            Open positions linked to this bot might need manual intervention.
          </LpdText>
        </div>
      </TechnicalDialog>
    </main>
  );
}
