'use client';

import React, { useState } from 'react';
import { LpdText, Heading, TechnicalSurface, Button, Skeleton, toast } from '@loopdev/ui';
import { ExchangeAccountCard, type ExchangeAccount } from '@/components/ExchangeAccountCard';
import { ConnectExchangeModal } from '../components/ConnectExchangeModal';
import { useExchangeVault } from '@/hooks/trading/useExchangeVault';

interface ConnectExchangePayload {
  name: string;
  provider: string;
  apiKey: string;
  apiSecret: string;
}

interface ConnectionTestResult {
  success: boolean;
  error?: string | null;
  message?: string;
}

/**
 * @page ExchangeVaultPage
 * @description Secure management of exchange credentials and connectivity.
 * Implements Section 18 of the Blueprint UX.
 */
export default function ExchangeVaultPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ExchangeAccount | null>(null);
  const { accounts, isLoading, connectExchange, testConnection, isTesting } = useExchangeVault();

  const handleTest = (id: string) => {
    console.log('[handleTest] Called with id:', id);

    toast.show({
      tenantId: 'loopdev',
      title: 'Testing_Connection',
      description: 'Verificando credenciales con el broker...',
      variant: 'info',
    });

    console.log('[handleTest] About to call testConnection with callbacks');

    testConnection(id, {
      onSuccess: (data: ConnectionTestResult) => {
        console.log('[handleTest] onSuccess called with:', data);
        if (data.success) {
          toast.show({
            tenantId: 'loopdev',
            title: 'Connection_Verified',
            description: 'La conexión con el broker se ha verificado correctamente.',
            variant: 'success',
          });
        } else {
          toast.show({
            tenantId: 'loopdev',
            title: 'Connection_Failed',
            description: data.error || 'No se pudo verificar la conexión con el broker.',
            variant: 'error',
          });
        }
      },
      onError: (error: Error) => {
        console.error('[handleTest] onError called with:', error);
        toast.show({
          tenantId: 'loopdev',
          title: 'Connection_Failed',
          description: error?.message || 'Ocurrió un error al verificar la conexión.',
          variant: 'error',
        });
      },
    });
  };

  const handleConnect = (data: ConnectExchangePayload) => {
    connectExchange(data);
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleSettings = (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc) return;
    setEditingAccount(acc);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-12 p-8 max-w-[1600px] mx-auto">
        <Skeleton className="h-20 w-1/3 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-[220px] w-full rounded-3xl" />
          <Skeleton className="h-[220px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <main className="h-full overflow-y-auto flex flex-col gap-12 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar">
      <ConnectExchangeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConnect={handleConnect}
        initialData={
          editingAccount
            ? {
                name: editingAccount.name,
                provider: (['binance', 'kraken', 'ibkr'] as const).includes(
                  editingAccount.provider as 'binance' | 'kraken' | 'ibkr',
                )
                  ? (editingAccount.provider as 'binance' | 'kraken' | 'ibkr')
                  : 'binance',
                isPaper: editingAccount.isPaper,
              }
            : undefined
        }
      />

      {/* 1. STANDARDIZED HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-sm font-bold">lock</span>
            <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em]">
              Secure_Credential_Vault
            </LpdText>
          </div>
          <Heading
            size="2xl"
            weight="bold"
            className="text-text-main tracking-tight uppercase italic"
          >
            Exchange_Vault<span className="text-primary">.</span>
          </Heading>
          <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
            Manage your API keys and broker connections securely. All credentials are encrypted
            using AES-256 at the infrastructure level.
          </LpdText>
        </div>

        <Button
          variant="primary"
          startIcon="add_link"
          onClick={() => setIsModalOpen(true)}
          className="px-8 shadow-xl shadow-primary/20"
        >
          Connect_New_Exchange
        </Button>
      </header>

      {/* 2. SECURITY ADVISORY */}
      <TechnicalSurface
        variant="surface"
        depth="flat"
        className="p-6 bg-primary/5 border-primary/20 rounded-2xl flex items-start gap-4"
      >
        <span className="material-symbols-outlined text-primary font-bold">shield</span>
        <div className="flex flex-col gap-1">
          <LpdText size="xs" weight="bold" className="text-primary uppercase tracking-widest">
            Security_Protocol_Notice
          </LpdText>
          <LpdText size="xs" className="text-primary/70 leading-relaxed">
            Always use API keys with restricted permissions. Ensure Withdrawal permissions are
            disabled for all keys linked to LoopDev Quant Core.
          </LpdText>
        </div>
      </TechnicalSurface>

      {/* 3. ACCOUNTS GRID */}
      {accounts.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {accounts.map((acc) => (
            <ExchangeAccountCard
              key={acc.id}
              account={acc}
              isLoading={isTesting}
              onTestConnection={handleTest}
              onSettings={handleSettings}
            />
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center p-24 border border-dashed border-border-technical/50 rounded-[2.5rem] bg-background-surface/50 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 mb-6">
            <span className="material-symbols-outlined text-3xl font-bold">account_balance</span>
          </div>
          <Heading size="lg" weight="bold" className="text-text-main mb-2">
            No Exchanges Connected
          </Heading>
          <LpdText size="sm" className="text-text-muted text-center max-w-sm mb-8">
            The Quant Core needs a bridge to execute your algorithmic logic. Connect your first
            exchange to begin trading.
          </LpdText>
          <Button variant="primary" className="px-12" onClick={() => setIsModalOpen(true)}>
            Connect_Your_Broker
          </Button>
        </section>
      )}
    </main>
  );
}
