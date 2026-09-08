'use client';

import React, { useState, useEffect } from 'react';
import {
  TechnicalSurface,
  LpdText,
  Heading,
  Input,
  Button,
  IconButton,
  Divider,
  cn,
} from '@loopdev/ui';

interface ExchangeFormData {
  name: string;
  provider: 'binance' | 'kraken' | 'ibkr';
  apiKey: string;
  apiSecret: string;
  isPaper: boolean;
}

interface InitialExchangeData {
  name?: string;
  provider?: ExchangeFormData['provider'];
  isPaper?: boolean;
}

interface ConnectExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (data: ExchangeFormData) => void;
  initialData?: InitialExchangeData;
}

/**
 * @component ConnectExchangeModal
 * @description Industrial modal for linking new exchange credentials to the vault.
 */
export const ConnectExchangeModal: React.FC<ConnectExchangeModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  initialData,
}) => {
  const [formData, setFormData] = useState<ExchangeFormData>({
    name: '',
    provider: 'binance',
    apiKey: '',
    apiSecret: '',
    isPaper: true,
  });

  // Sync initialData when editing
  useEffect(() => {
    if (initialData) {
      queueMicrotask(() =>
        setFormData({
          name: initialData.name || '',
          provider: initialData.provider || 'binance',
          apiKey: '••••••••••••••••', // Masked indicator
          apiSecret: '••••••••••••••••',
          isPaper: initialData.isPaper ?? true,
        }),
      );
    } else {
      // Reset to default for new connections
      queueMicrotask(() =>
        setFormData({
          name: '',
          provider: 'binance',
          apiKey: '',
          apiSecret: '',
          isPaper: true,
        }),
      );
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="bg-background-canvas/60 animate-in fade-in absolute inset-0 backdrop-blur-sm duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <TechnicalSurface
        variant="surface"
        depth="overlay"
        className="animate-in zoom-in-95 relative z-10 flex h-full max-h-[70vh] w-full max-w-xl flex-col overflow-hidden shadow-2xl duration-300"
      >
        <div className="flex h-full w-full flex-col">
          <header className="border-border-technical/30 bg-background-subtle/30 flex shrink-0 items-center justify-between border-b p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary border-primary/20 flex h-10 w-10 items-center justify-center rounded-xl border">
                <span className="material-symbols-outlined text-xl font-bold">add_link</span>
              </div>
              <div>
                <Heading size="xs" weight="bold" className="uppercase italic tracking-tight">
                  {initialData ? 'Update_Broker_Account' : 'Link_Broker_Account'}
                </Heading>
                <LpdText
                  size="nano"
                  className="text-text-muted font-mono uppercase tracking-widest opacity-60"
                >
                  Vault // Security_Layer
                </LpdText>
              </div>
            </div>
            <IconButton icon="close" size="sm" onClick={onClose} />
          </header>

          <form
            onSubmit={handleSubmit}
            className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-8"
          >
            {/* 0. CRITICAL ENVIRONMENT SELECTOR */}
            <div className="flex flex-col gap-4">
              <LpdText
                size="nano"
                weight="black"
                className="px-1 uppercase tracking-[0.2em] text-status-warning opacity-60"
              >
                00. Execution_Environment
              </LpdText>
              <div className="bg-background-subtle border-border-technical/30 grid grid-cols-2 gap-2 rounded-2xl border p-1 dark:bg-white/5">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setFormData({ ...formData, isPaper: false })}
                  className={cn(
                    'flex flex-col items-center gap-1 py-4 rounded-xl transition-all border border-transparent',
                    !formData.isPaper
                      ? 'bg-white dark:bg-lpd-bg-dark shadow-xl border-amber-500/30 text-amber-500'
                      : 'text-text-muted hover:text-text-main',
                  )}
                >
                  <span className="material-symbols-outlined text-xl font-bold">bolt</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Live_Trading_Mode
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setFormData({ ...formData, isPaper: true })}
                  className={cn(
                    'flex flex-col items-center gap-1 py-4 rounded-xl transition-all border border-transparent',
                    formData.isPaper
                      ? 'bg-white dark:bg-lpd-bg-dark shadow-xl border-blue-500/30 text-blue-500'
                      : 'text-text-muted hover:text-text-main',
                  )}
                >
                  <span className="material-symbols-outlined text-xl font-bold">science</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Paper_Trading_Mode
                  </span>
                </Button>
              </div>
              <div
                className={cn(
                  'px-4 py-2 rounded-lg text-[8px] font-bold uppercase tracking-wider text-center border',
                  formData.isPaper
                    ? 'bg-blue-500/5 border-blue-500/10 text-blue-500/70'
                    : 'bg-amber-500/5 border-amber-500/10 text-amber-500/70',
                )}
              >
                {formData.isPaper
                  ? '// SAFE_ENVIRONMENT: Virtual capital using exchange testnet.'
                  : '!! CRITICAL_ENVIRONMENT: REAL CAPITAL COMMITMENT AT RISK.'}
              </div>
            </div>

            <Divider thickness="technical" className="opacity-50" />

            {/* 1. Account Identity */}
            <div className="flex flex-col gap-6">
              <LpdText
                size="nano"
                weight="black"
                className="text-primary px-1 uppercase tracking-[0.2em] opacity-60"
              >
                01. Account_Identity
              </LpdText>
              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Friendly Name"
                  placeholder="e.g. Binance_Primary"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <div className="flex flex-col gap-2">
                  <label className="text-text-muted px-1 text-[10px] font-black uppercase tracking-widest">
                    Broker_Provider
                  </label>
                  <select
                    className="border-border-technical/50 text-text-main focus:border-primary h-10 w-full cursor-pointer appearance-none rounded-lg border bg-white px-3 text-sm font-bold outline-none transition-all dark:bg-white/5"
                    value={formData.provider}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        provider: e.target.value as ExchangeFormData['provider'],
                      })
                    }
                  >
                    <option value="binance" className="bg-white dark:bg-slate-900">
                      Binance_Exchange
                    </option>
                    <option value="kraken" className="bg-white dark:bg-slate-900">
                      Kraken_Exchange (Coming Soon)
                    </option>
                    <option value="ibkr" className="bg-white dark:bg-slate-900">
                      Interactive_Brokers (Coming Soon)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <Divider thickness="technical" className="opacity-50" />

            {/* 2. Credentials */}
            <div className="flex flex-col gap-6">
              <LpdText
                size="nano"
                weight="black"
                className="px-1 uppercase tracking-[0.2em] text-status-warning opacity-60"
              >
                02. Encrypted_Credentials
              </LpdText>
              <div className="flex flex-col gap-6">
                <Input
                  label="API Key"
                  placeholder="Paste your API key here"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  required
                />
                <Input
                  label="Secret Key"
                  type="password"
                  placeholder="Paste your secret key here"
                  value={formData.apiSecret}
                  onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                  required
                />
              </div>
            </div>
          </form>
          <footer className="border-border-technical/30 bg-background-subtle/10 flex shrink-0 items-center justify-end gap-4 border-t p-6">
            <Button variant="outline" onClick={onClose}>
              Cancel_Action
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={handleSubmit}
              className="shadow-primary/20 px-12 shadow-xl"
            >
              {initialData ? 'Update_&_Save' : 'Verify_&_Save'}
            </Button>
          </footer>
        </div>
      </TechnicalSurface>
    </div>
  );
};
