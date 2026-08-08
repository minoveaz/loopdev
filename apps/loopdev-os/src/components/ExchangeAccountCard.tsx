'use client';

import React from 'react';
import { Button, Heading, IconButton } from '@loopdev/ui';
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
      color: 'bg-status-success/10 border-status-success/20',
      textColor: 'text-status-success',
      icon: <CheckCircle className="w-5 h-5 text-status-success" />,
      label: 'Connected'
    },
    error: {
      color: 'bg-status-error/10 border-status-error/20',
      textColor: 'text-status-error',
      icon: <AlertCircle className="w-5 h-5 text-status-error" />,
      label: 'Connection Error'
    },
    disconnected: {
      color: 'bg-background-subtle border-border-technical',
      textColor: 'text-text-muted',
      icon: <AlertCircle className="w-5 h-5 text-text-muted" />,
      label: 'Disconnected'
    },
    unknown: {
      color: 'bg-status-info/10 border-status-info/20',
      textColor: 'text-status-info',
      icon: <LinkIcon className="w-5 h-5 text-status-info" />,
      label: 'Not Tested'
    }
  };

  const currentStatus = statusConfig[account.status];

  return (
    <div className={`rounded-2xl border p-6 transition-all duration-300 ${currentStatus.color}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-shell-surface rounded-lg flex items-center justify-center border border-border-technical">
            <span className="text-xl font-bold text-text-muted">
              {account.provider.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <Heading as="h3" size="sm" weight="bold" className="text-text-main">{account.name}</Heading>
            <p className="text-xs text-text-muted">{account.provider}</p>
          </div>
        </div>
        <IconButton
          icon="settings"
          size="sm"
          aria-label="Configurar cuenta de exchange"
          onClick={() => onSettings?.(account.id)}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        />
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
        <div className="mb-4 p-3 bg-status-error/10 border border-status-error/20 rounded-lg">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-status-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-status-error">Credenciales inválidas</p>
              <p className="text-xs text-status-error mt-0.5 opacity-80">{account.lastError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="space-y-2 mb-4 text-xs">
        <div className="flex justify-between">
          <span className="text-text-muted">API Key:</span>
          <code className="font-mono text-text-muted bg-shell-surface/50 px-2 py-1 rounded">
            {account.apiKeyMasked}
          </code>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Last Verified:</span>
          <span className="text-text-muted">{account.lastSync}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Mode:</span>
          <span className="font-semibold text-text-main">
            {account.isPaper ? '📝 Paper' : '💰 Live'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="primary" size="sm"
          onClick={() => onTestConnection?.(account.id)}
          disabled={isLoading}
          className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </Button>
      </div>
    </div>
  );
};
