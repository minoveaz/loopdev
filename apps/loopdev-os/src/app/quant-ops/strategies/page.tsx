'use client';

import React, { useState } from 'react';
import {
  Button,
  toast,
  TechnicalSurface,
  Heading,
  LpdText,
  Divider,
  cn,
  StrategyCard,
  CreateStrategyModal,
  StrategyConfig,
  IconButton,
  TechnicalDialog,
} from '@loopdev/ui';
import { useStrategies } from '@/hooks/trading/useStrategies';
import { useExchangeVault } from '@/hooks/trading/useExchangeVault';
import { useAssets } from '@/hooks/trading/useAssets';

/**
 * @page StrategiesPage
 * @description Operational management of trading protocols.
 * Industrialized using @loopdev/ui primitives.
 */
export default function StrategiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<{ id: string } | null>(null);
  const [selectedStrategyForBacktest, setSelectedStrategyForBacktest] = useState<string | null>(
    null,
  );
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    strategyId: string | null;
  }>({ isOpen: false, strategyId: null });

  const { accounts } = useExchangeVault();
  const { data: assets = [] } = useAssets();

  const {
    strategies,
    strategyRegistry,
    isLoading,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    isCreating,
    updateStrategyStatus,
    runBacktest,
    isBacktesting,
    backtestResult,
  } = useStrategies();

  const handleOpenCreate = () => {
    setEditingStrategy(null);
    setIsModalOpen(true);
  };

  const handleSaveStrategy = async (config: StrategyConfig) => {
    // Industrial Mapping: Adapt modal payload to DB schema
    const params = {
      name: config.name,
      exchangeId: config.exchangeId ?? '',
      mode: config.mode,
      pairs: config.pairs,
      core_id: config.coreId,
      parameters: config.parameters || {},
      // Standard Risk Guard (inherited from form or defaults)
      sizePerTrade: config.parameters?.sizePerTrade || 100,
      maxPositions: config.parameters?.maxPositions || 5,
      maxExposure: config.parameters?.maxExposure || 1000,
      stopLoss: config.stopLoss || 2.0,
      takeProfit: config.takeProfit || 5.0,
      trailingStop: config.parameters?.trailingStop || 0.0,
      cooldownMinutes: config.parameters?.cooldownMinutes || 60,
      dailyLossLimit: config.parameters?.dailyLossLimit || 5.0,
      description: config.description,
    };

    if (editingStrategy) {
      updateStrategy(
        { id: editingStrategy.id, params },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingStrategy(null);
            toast.show({
              tenantId: 'loopdev',
              title: 'Strategy_Updated',
              description: 'Protocol configuration updated successfully.',
              variant: 'success',
            });
          },
        },
      );
    } else {
      createStrategy(params, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.show({
            tenantId: 'loopdev',
            title: 'Strategy_Created',
            description: 'New protocol initialized in Draft mode.',
            variant: 'success',
          });
        },
      });
    }
  };

  const handleEdit = (id: string) => {
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) return;

    // Map strategy to config format for the modal
    // Note: In a real app we might need to fetch the full details if the list view is lightweight
    setEditingStrategy({ id: strategy.id });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmation({ isOpen: true, strategyId: id });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.strategyId) {
      deleteStrategy(deleteConfirmation.strategyId, {
        onSuccess: () => {
          toast.show({
            tenantId: 'loopdev',
            title: 'Strategy_Deleted',
            description: 'Protocol removed from vault.',
            variant: 'info',
          });
          setDeleteConfirmation({ isOpen: false, strategyId: null });
        },
      });
    }
  };

  const handleBacktest = (id: string) => {
    const strategy = strategies.find((s) => s.id === id);
    if (!strategy) return;

    setSelectedStrategyForBacktest(id);

    toast.show({
      tenantId: 'loopdev',
      title: 'Backtest_Started',
      description: `Simulating ${strategy.name} logic...`,
      variant: 'info',
    });

    runBacktest({
      strategyId: strategy.id,
      strategyName: strategy.name,
      pairs: strategy.pairs,
      sizePerTrade: 100, // Default for backtest
      maxPositions: 5,
      stopLoss: 2.0,
      takeProfit: 5.0,
      days: 30,
    });
  };

  const handleActivateStrategy = (id: string) => {
    updateStrategyStatus({ strategyId: id, status: 'active' });
  };

  const handlePauseStrategy = (id: string) => {
    updateStrategyStatus({ strategyId: id, status: 'paused' });
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <TechnicalSurface variant="surface" className="h-[340px] animate-pulse rounded-3xl" />
        <TechnicalSurface variant="surface" className="h-[340px] animate-pulse rounded-3xl" />
        <TechnicalSurface variant="surface" className="h-[340px] animate-pulse rounded-3xl" />
      </div>
    );
  }

  return (
    <main className="h-full overflow-y-auto flex flex-col gap-12 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar">
      {/* 1. STANDARDIZED HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-sm font-bold">psychology</span>
            <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em]">
              Algorithmic_Protocol_Vault
            </LpdText>
          </div>
          <Heading
            size="2xl"
            weight="bold"
            className="text-text-main tracking-tight uppercase italic"
          >
            Strategies_Lab<span className="text-primary">.</span>
          </Heading>
          <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
            Design and backtest your proprietary trading logic. Deploy verified blueprints to the
            fleet for execution.
          </LpdText>
        </div>

        <Button
          variant="energy"
          startIcon="add"
          onClick={handleOpenCreate}
          disabled={accounts.length === 0}
          className="px-8 shadow-xl shadow-amber-500/20"
        >
          New_Strategy_Blueprint
        </Button>
      </header>

      {/* 2. FLEET OVERVIEW */}
      {strategies.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {strategies.map((strategy) => (
            <StrategyCard
              key={strategy.id}
              strategy={{
                id: strategy.id,
                name: strategy.name,
                coreId: '',
                exchangeId:
                  accounts.find((account) => account.name === strategy.exchange)?.id || '',
                mode: strategy.mode,
                status: strategy.status,
                pairs: strategy.pairs,
                parameters: {},
                stopLoss: 0,
                takeProfit: 0,
              }}
              isLoading={isBacktesting && selectedStrategyForBacktest === strategy.id}
              onActivate={handleActivateStrategy}
              onPause={handlePauseStrategy}
              onBacktest={handleBacktest}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center p-24 border border-dashed border-border-technical/50 rounded-[2.5rem] bg-background-surface/50 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 mb-6">
            <span className="material-symbols-outlined text-3xl font-bold">biotech</span>
          </div>
          <Heading size="lg" weight="bold" className="text-text-main mb-2">
            No Protocols Defined
          </Heading>
          <LpdText size="sm" className="text-text-muted text-center max-w-sm mb-8">
            Your laboratory is empty. Start by creating a strategy blueprint based on mathematical
            signals or price action.
          </LpdText>
          <Button variant="primary" className="px-12" onClick={handleOpenCreate}>
            Initialize_First_Blueprint
          </Button>
        </section>
      )}

      {/* 3. BACKTEST RESULTS MODAL */}
      {backtestResult && selectedStrategyForBacktest && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-8">
          <div
            className="absolute inset-0 bg-background-canvas/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedStrategyForBacktest(null)}
          />

          <TechnicalSurface
            variant="surface"
            depth="overlay"
            className="relative z-10 w-full max-w-2xl h-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden rounded-3xl border-primary/20"
          >
            <header className="p-6 border-b border-border-technical/30 flex items-center justify-between bg-background-subtle/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-status-success/10 flex items-center justify-center text-status-success border border-status-success/20">
                  <span className="material-symbols-outlined text-xl font-bold">query_stats</span>
                </div>
                <Heading size="xs" weight="bold" className="uppercase tracking-tight italic">
                  Simulation_Audit_Report
                </Heading>
              </div>
              <IconButton
                icon="close"
                size="sm"
                onClick={() => setSelectedStrategyForBacktest(null)}
              />
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total_Trades', value: backtestResult.totalTrades, icon: 'analytics' },
                  { label: 'Win_Rate', value: `${backtestResult.winRate}%`, icon: 'check_circle' },
                  {
                    label: 'Net_Return',
                    value: `${backtestResult.totalReturn}%`,
                    icon: 'trending_up',
                    color: 'text-emerald-500',
                  },
                  {
                    label: 'Max_Drawdown',
                    value: `${backtestResult.maxDrawdown}%`,
                    icon: 'trending_down',
                    color: 'text-rose-500',
                  },
                  {
                    label: 'Profit_Factor',
                    value: backtestResult.profitFactor,
                    icon: 'settings_input_component',
                  },
                  {
                    label: 'Sharpe_Ratio',
                    value: backtestResult.sharpeRatio,
                    icon: 'architecture',
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-background-subtle/50 border border-border-technical/30"
                  >
                    <div className="flex items-center gap-2 mb-2 opacity-40">
                      <span className="material-symbols-outlined text-xs">{stat.icon}</span>
                      <LpdText size="nano" weight="bold" className="uppercase tracking-widest">
                        {stat.label}
                      </LpdText>
                    </div>
                    <LpdText
                      size="lg"
                      weight="black"
                      className={cn('font-mono', stat.color || 'text-text-main')}
                    >
                      {stat.value}
                    </LpdText>
                  </div>
                ))}
              </div>

              <Divider thickness="technical" className="opacity-30" />

              <div className="space-y-4">
                <LpdText
                  size="nano"
                  weight="black"
                  className="uppercase tracking-[0.2em] opacity-40 px-1"
                >
                  Detailed_Trade_Log
                </LpdText>
                <div className="space-y-2">
                  {backtestResult.trades.slice(0, 5).map((trade, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/5 border border-border-technical/20"
                    >
                      <div className="flex flex-col">
                        <LpdText size="xs" weight="bold" className="uppercase">
                          {trade.pair}
                          {' // '}
                          {trade.side}
                        </LpdText>
                        <LpdText size="nano" className="text-text-muted font-mono">
                          {new Date(trade.entry_time).toLocaleDateString()}
                        </LpdText>
                      </div>
                      <div className="text-right">
                        <LpdText
                          size="xs"
                          weight="black"
                          className={(trade.pnl ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}
                        >
                          {(trade.pnl ?? 0) >= 0 ? '+' : ''}
                          {trade.pnl_pct}%
                        </LpdText>
                        <LpdText
                          size="nano"
                          className="text-text-muted opacity-40 uppercase font-bold"
                        >
                          {trade.reason}
                        </LpdText>
                      </div>
                    </div>
                  ))}
                  {backtestResult.trades.length > 5 && (
                    <LpdText size="nano" className="text-center text-text-muted italic block py-2">
                      + {backtestResult.trades.length - 5} additional trades in full report
                    </LpdText>
                  )}
                </div>
              </div>
            </div>

            <footer className="p-6 border-t border-border-technical/30 flex items-center justify-end gap-4 bg-background-subtle/10">
              <Button variant="outline" onClick={() => setSelectedStrategyForBacktest(null)}>
                Dismiss_Report
              </Button>
              <Button variant="primary" className="px-8 shadow-xl shadow-primary/20">
                Download_CSV
              </Button>
            </footer>
          </TechnicalSurface>
        </div>
      )}

      {/* 4. INDUSTRIAL MODAL */}
      <CreateStrategyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleSaveStrategy}
        exchanges={accounts.map((acc) => ({ id: acc.id, name: acc.name, provider: acc.provider }))}
        availableAssets={assets}
        availableCores={strategyRegistry}
        isLoading={isCreating}
      />

      {/* 5. DELETE CONFIRMATION DIALOG */}
      <TechnicalDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, strategyId: null })}
        title="Protocol_Termination"
        description="This action is irreversible. The strategy configuration and its history will be permanently deleted from the vault."
        variant="danger"
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmation({ isOpen: false, strategyId: null })}
            >
              Cancel_Action
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Confirm_Delete
            </Button>
          </>
        }
      >
        <div className="p-4 bg-status-error/5 border border-status-error/10 rounded-xl flex gap-3">
          <span className="material-symbols-outlined text-status-error">warning</span>
          <LpdText size="xs" className="text-status-error/80 leading-relaxed font-medium">
            Warning: If this strategy is currently active on any bot, those bots will be stopped
            immediately to prevent undefined behavior.
          </LpdText>
        </div>
      </TechnicalDialog>
    </main>
  );
}
