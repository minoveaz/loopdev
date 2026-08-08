'use client';

import React from 'react';
import { Button } from '@loopdev/ui';
import { AlertCircle, CheckCircle, Link as LinkIcon, Settings } from 'lucide-react';

export interface ExchangeAccount {
  id: string;
  name: string;
  provider: string;
  status: 'healthy' | 'error' | 'disconnected' | 'unknown';
  isPaper: boolean;
  lastSync: string;
  lastError: string | null;
  apiKeyMasked: string;
}

interface ExchangeAccountCardProps {
  account: ExchangeAccount;
  isLoading?: boolean;
  onTestConnection?: (id: string) => void;
  onSettings?: (id: string) => void;
}

export const ExchangeAccountCard: React.FC<ExchangeAccountCardProps> = ({
  account,
  isLoading = false,
  onTestConnection,
  onSettings
}) => {
  // Determine status color and icon
  const statusConfig = {
    healthy: {
      color: 'bg-emerald-500/10 border-emerald-200',
      textColor: 'text-emerald-700',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      label: 'Connected'
    },
    error: {
      color: 'bg-red-500/10 border-red-200',
      textColor: 'text-red-700',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      label: 'Connection Error'
    },
    disconnected: {
      color: 'bg-slate-100 border-slate-200',
      textColor: 'text-slate-500',
      icon: <AlertCircle className="w-5 h-5 text-slate-400" />,
      label: 'Disconnected'
    },
    unknown: {
      color: 'bg-blue-500/10 border-blue-200',
      textColor: 'text-blue-700',
      icon: <LinkIcon className="w-5 h-5 text-blue-500" />,
      label: 'Not Tested'
    }
  };

  const currentStatus = statusConfig[account.status];

  return (
    <div className={`rounded-2xl border p-6 transition-all duration-300 ${currentStatus.color}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200">
            <span className="text-xl font-bold text-slate-600">
              {account.provider.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-slate-900">{account.name}</h3>
            <p className="text-xs text-slate-500">{account.provider}</p>
          </div>
        </div>
        <button
          onClick={() => onSettings?.(account.id)}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-4">
        {currentStatus.icon}
        <span className={`text-sm font-semibold ${currentStatus.textColor}`}>
          {currentStatus.label}
        </span>
      </div>

      {/* Error Message - Only show if there's an error */}
      {account.lastError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-red-900">Credenciales inválidas</p>
              <p className="text-xs text-red-700 mt-0.5 opacity-80">{account.lastError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="space-y-2 mb-4 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">API Key:</span>
          <code className="font-mono text-slate-600 bg-white/50 px-2 py-1 rounded">
            {account.apiKeyMasked}
          </code>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Last Verified:</span>
          <span className="text-slate-600">{account.lastSync}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Mode:</span>
          <span className="font-semibold text-slate-700">
            {account.isPaper ? '📝 Paper' : '💰 Live'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onTestConnection?.(account.id)}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-lg font-semibold text-sm transition-colors"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </div>
  );
};
