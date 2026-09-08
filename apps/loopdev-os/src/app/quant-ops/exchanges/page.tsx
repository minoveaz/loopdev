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
      <div className="mx-auto flex max-w-[1600px] flex-col gap-12 p-8">
        <Skeleton className="h-20 w-1/3 rounded-xl" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Skeleton className="h-[220px] w-full rounded-3xl" />
          <Skeleton className="h-[220px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <main className="animate-in fade-in custom-scrollbar mx-auto flex h-full max-w-[1600px] flex-col gap-12 overflow-y-auto p-8 pb-32 duration-700">
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
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-2">
          <div className="text-primary flex items-center gap-3">
            <span className="material-symbols-outlined text-sm font-bold">lock</span>
            <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em]">
              Secure_Credential_Vault
            </LpdText>
          </div>
          <Heading
            size="2xl"
            weight="bold"
            className="text-text-main uppercase italic tracking-tight"
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
          className="shadow-primary/20 px-8 shadow-xl"
        >
          Connect_New_Exchange
        </Button>
      </header>

      {/* 2. SECURITY ADVISORY */}
      <TechnicalSurface
        variant="surface"
        depth="flat"
        className="bg-primary/5 border-primary/20 flex items-start gap-4 rounded-2xl p-6"
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
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
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
        <section className="border-border-technical/50 bg-background-surface/50 flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed p-24 backdrop-blur-sm">
          <div className="bg-primary/5 border-primary/10 text-primary/40 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border">
            <span className="material-symbols-outlined text-3xl font-bold">account_balance</span>
          </div>
          <Heading size="lg" weight="bold" className="text-text-main mb-2">
            No Exchanges Connected
          </Heading>
          <LpdText size="sm" className="text-text-muted mb-8 max-w-sm text-center">
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
