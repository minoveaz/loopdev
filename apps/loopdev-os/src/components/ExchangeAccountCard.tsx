'use client';

import React from 'react';
import { Button, Heading, IconButton } from '@loopdev/ui';
import { AlertCircle, CheckCircle, Link as LinkIcon } from 'lucide-react';

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
      icon: <CheckCircle className="text-status-success h-5 w-5" />,
      label: 'Connected'
    },
    error: {
      color: 'bg-status-error/10 border-status-error/20',
      textColor: 'text-status-error',
      icon: <AlertCircle className="text-status-error h-5 w-5" />,
      label: 'Connection Error'
    },
    disconnected: {
      color: 'bg-background-subtle border-border-technical',
      textColor: 'text-text-muted',
      icon: <AlertCircle className="text-text-muted h-5 w-5" />,
      label: 'Disconnected'
    },
    unknown: {
      color: 'bg-status-info/10 border-status-info/20',
      textColor: 'text-status-info',
      icon: <LinkIcon className="text-status-info h-5 w-5" />,
      label: 'Not Tested'
    }
  };

  const currentStatus = statusConfig[account.status];

  return (
    <div className={`rounded-2xl border p-6 transition-all duration-300 ${currentStatus.color}`}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-shell-surface border-border-technical flex h-12 w-12 items-center justify-center rounded-lg border">
            <span className="text-text-muted text-xl font-bold">
              {account.provider.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <Heading as="h3" size="sm" weight="bold" className="text-text-main">{account.name}</Heading>
            <p className="text-text-muted text-xs">{account.provider}</p>
          </div>
        </div>
        <IconButton
          icon="settings"
          size="sm"
          aria-label="Configurar cuenta de exchange"
          onClick={() => onSettings?.(account.id)}
          className="rounded-lg p-2 transition-colors hover:bg-white/50"
        />
      </div>

      {/* Status Badge */}
      <div className="mb-4 flex items-center gap-2">
        {currentStatus.icon}
        <span className={`text-sm font-semibold ${currentStatus.textColor}`}>
          {currentStatus.label}
        </span>
      </div>

      {/* Error Message - Only show if there's an error */}
      {account.lastError && (
        <div className="bg-status-error/10 border-status-error/20 mb-4 rounded-lg border p-3">
          <div className="flex gap-2">
            <AlertCircle className="text-status-error mt-0.5 h-4 w-4 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-status-error text-xs font-semibold">Credenciales inválidas</p>
              <p className="text-status-error mt-0.5 text-xs opacity-80">{account.lastError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mb-4 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-text-muted">API Key:</span>
          <code className="text-text-muted bg-shell-surface/50 rounded px-2 py-1 font-mono">
            {account.apiKeyMasked}
          </code>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Last Verified:</span>
          <span className="text-text-muted">{account.lastSync}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Mode:</span>
          <span className="text-text-main font-semibold">
            {account.isPaper ? '📝 Paper' : '💰 Live'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="primary" size="sm"
          onClick={() => onTestConnection?.(account.id)}
          disabled={isLoading}
          className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </Button>
      </div>
    </div>
  );
};
