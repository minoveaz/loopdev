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
  Icon,
  cn
} from '@loopdev/ui';

interface ConnectExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (data: any) => void;
  initialData?: any;
}

/**
 * @component ConnectExchangeModal
 * @description Industrial modal for linking new exchange credentials to the vault.
 */
export const ConnectExchangeModal: React.FC<ConnectExchangeModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: '',
    provider: 'binance',
    apiKey: '',
    apiSecret: '',
    isPaper: true
  });

  // Sync initialData when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        provider: initialData.provider || 'binance',
        apiKey: '••••••••••••••••', // Masked indicator
        apiSecret: '••••••••••••••••',
        isPaper: initialData.isPaper ?? true
      });
    } else {
      // Reset to default for new connections
      setFormData({
        name: '',
        provider: 'binance',
        apiKey: '',
        apiSecret: '',
        isPaper: true
      });
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
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <TechnicalSurface 
        variant="surface" 
        depth="overlay" 
        className="relative z-10 w-full max-w-xl h-full max-h-[70vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300"
      >
        <div className="flex flex-col h-full w-full">
          <header className="p-6 border-b border-border-technical/30 flex items-center justify-between bg-background-subtle/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-xl font-bold">add_link</span>
              </div>
              <div>
                <Heading size="xs" weight="bold" className="uppercase tracking-tight italic">
                  {initialData ? 'Update_Broker_Account' : 'Link_Broker_Account'}
                </Heading>
                <LpdText size="nano" className="text-text-muted uppercase tracking-widest font-mono opacity-60">Vault // Security_Layer</LpdText>
              </div>
            </div>
            <IconButton icon="close" size="sm" onClick={onClose} />
          </header>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar flex flex-col gap-8 min-h-0">

            {/* 0. CRITICAL ENVIRONMENT SELECTOR */}
            <div className="flex flex-col gap-4">
              <LpdText size="nano" weight="black" className="text-amber-500 uppercase tracking-[0.2em] opacity-60 px-1">00. Execution_Environment</LpdText>
              <div className="grid grid-cols-2 gap-2 p-1 bg-background-subtle dark:bg-white/5 rounded-2xl border border-border-technical/30">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, isPaper: false})}
                  className={cn(
                    "flex flex-col items-center gap-1 py-4 rounded-xl transition-all border border-transparent",
                    !formData.isPaper 
                      ? "bg-white dark:bg-[#161E33] shadow-xl border-amber-500/30 text-amber-500" 
                      : "text-text-muted hover:text-text-main"
                  )}
                >
                  <span className="material-symbols-outlined text-xl font-bold">bolt</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Live_Trading_Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, isPaper: true})}
                  className={cn(
                    "flex flex-col items-center gap-1 py-4 rounded-xl transition-all border border-transparent",
                    formData.isPaper 
                      ? "bg-white dark:bg-[#161E33] shadow-xl border-blue-500/30 text-blue-500" 
                      : "text-text-muted hover:text-text-main"
                  )}
                >
                  <span className="material-symbols-outlined text-xl font-bold">science</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Paper_Trading_Mode</span>
                </button>
              </div>
              <div className={cn(
                "px-4 py-2 rounded-lg text-[8px] font-bold uppercase tracking-wider text-center border",
                formData.isPaper ? "bg-blue-500/5 border-blue-500/10 text-blue-500/70" : "bg-amber-500/5 border-amber-500/10 text-amber-500/70"
              )}>
                {formData.isPaper 
                  ? "// SAFE_ENVIRONMENT: Virtual capital using exchange testnet." 
                  : "!! CRITICAL_ENVIRONMENT: REAL CAPITAL COMMITMENT AT RISK."}
              </div>
            </div>

            <Divider thickness="technical" className="opacity-50" />

            {/* 1. Account Identity */}
            <div className="flex flex-col gap-6">
              <LpdText size="nano" weight="black" className="text-primary uppercase tracking-[0.2em] opacity-60 px-1">01. Account_Identity</LpdText>
              <div className="grid grid-cols-1 gap-6">
                <Input 
                  label="Friendly Name" 
                  placeholder="e.g. Binance_Primary" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-text-muted px-1">Broker_Provider</label>
                  <select 
                    className="w-full h-10 px-3 rounded-lg bg-white dark:bg-white/5 border border-border-technical/50 text-sm font-bold text-text-main focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                    value={formData.provider}
                    onChange={(e) => setFormData({...formData, provider: e.target.value})}
                  >
                    <option value="binance" className="bg-white dark:bg-slate-900">Binance_Exchange</option>
                    <option value="kraken" className="bg-white dark:bg-slate-900">Kraken_Exchange (Coming Soon)</option>
                    <option value="ibkr" className="bg-white dark:bg-slate-900">Interactive_Brokers (Coming Soon)</option>
                  </select>
                </div>
              </div>
            </div>

            <Divider thickness="technical" className="opacity-50" />

            {/* 2. Credentials */}
            <div className="flex flex-col gap-6">
              <LpdText size="nano" weight="black" className="text-amber-500 uppercase tracking-[0.2em] opacity-60 px-1">02. Encrypted_Credentials</LpdText>
              <div className="flex flex-col gap-6">
                <Input 
                  label="API Key" 
                  placeholder="Paste your API key here" 
                  value={formData.apiKey}
                  onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                  required
                />
                <Input 
                  label="Secret Key" 
                  type="password" 
                  placeholder="Paste your secret key here" 
                  value={formData.apiSecret}
                  onChange={(e) => setFormData({...formData, apiSecret: e.target.value})}
                  required
                />
              </div>
            </div>

          </form>
          <footer className="p-6 border-t border-border-technical/30 flex items-center justify-end gap-4 bg-background-subtle/10 shrink-0">
            <Button variant="outline" onClick={onClose}>Cancel_Action</Button>
            <Button 
              variant="primary" 
              type="submit"
              onClick={handleSubmit}
              className="px-12 shadow-xl shadow-primary/20"
            >
              {initialData ? 'Update_&_Save' : 'Verify_&_Save'}
            </Button>
          </footer>
        </div>
      </TechnicalSurface>
    </div>
  );
};
