'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/hooks/useOrganization';

interface ExchangeAccount {
  id: string;
  name: string;
  provider: string;
  status: 'healthy' | 'error' | 'disconnected' | 'unknown';
  isPaper: boolean;
  lastSync: string;
  lastError: string | null;
  apiKeyMasked: string;
}

interface ExchangeResponse {
  id: string;
  name: string;
  exchange_provider: string;
  is_active: boolean;
  last_verified_at: string | null;
  last_error_message: string | null;
  apiKeyMasked: string;
}

interface ConnectPayload { name: string; provider: string; apiKey: string; apiSecret: string; }
interface TestResult { success: boolean; error?: string; message?: string; }
interface TestConnectionResponse { success: boolean; message: string; error: string | null; testResult: TestResult | null; timestamp: string; }
interface TestConnectionCallbacks { onSuccess?: (data: TestConnectionResponse) => void; onError?: (error: Error) => void; }

async function readResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof body.error === 'string' ? body.error : 'Exchange vault request failed');
  return body as T;
}

export const useExchangeVault = () => {
  const queryClient = useQueryClient();
  const { activeOrganization } = useOrganization();
  const queryKey = ['trading', 'exchanges', activeOrganization?.id] as const;

  const { data: accounts = [], isLoading, error } = useQuery({
    queryKey,
    enabled: Boolean(activeOrganization),
    queryFn: async () => {
      const response = await fetch(`/api/quant/exchanges?organizationId=${encodeURIComponent(activeOrganization!.id)}`);
      const exchanges = await readResponse<ExchangeResponse[]>(response);
      return exchanges.map((exchange): ExchangeAccount => ({
        id: exchange.id,
        name: exchange.name,
        provider: exchange.exchange_provider,
        status: exchange.last_error_message ? 'error' : exchange.is_active && exchange.last_verified_at ? 'healthy' : exchange.is_active ? 'unknown' : 'disconnected',
        isPaper: true,
        lastSync: exchange.last_verified_at ? new Date(exchange.last_verified_at).toLocaleString() : 'Never verified',
        lastError: exchange.last_error_message,
        apiKeyMasked: exchange.apiKeyMasked,
      }));
    },
  });

  const connectExchange = useMutation({
    mutationFn: async (payload: ConnectPayload) => {
      if (!activeOrganization) throw new Error('Select an organization before connecting an exchange');
      return readResponse<ExchangeResponse>(await fetch('/api/quant/exchanges', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, organizationId: activeOrganization.id }),
      }));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const testConnection = useMutation({
    mutationFn: async (id: string) => readResponse<TestConnectionResponse>(await fetch(`/api/quant/exchanges/${id}/test`, { method: 'POST' })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    accounts, isLoading, error,
    connectExchange: connectExchange.mutate, isConnecting: connectExchange.isPending,
    testConnection: (id: string, callbacks?: TestConnectionCallbacks) => testConnection.mutate(id, callbacks),
    isTesting: testConnection.isPending, testResult: testConnection.data,
    fetchBalance: async (_accountId: string) => { throw new Error('Exchange balances must be requested through a server-side Quant Core route'); },
    isFetchingBalance: false,
  };
};
