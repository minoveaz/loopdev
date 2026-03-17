'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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

// Raw database record type
interface RawExchange {
  id: string;
  name: string;
  exchange_provider: string;
  api_key: string;
  api_secret: string;
  is_active: boolean;
  last_verified_at: string | null;
  last_error_message: string | null;
  created_at: string;
}

// Connect payload type
interface ConnectPayload {
  name: string;
  provider: string;
  apiKey: string;
  apiSecret: string;
}

// Test result type from Python Core
interface TestResult {
  success: boolean;
  error?: string;
  message?: string;
}

// Update payload type for Supabase
interface UpdatePayload {
  last_verified_at: string;
  is_active: boolean;
  last_error_message?: string | null;
}

// Callback type for testConnection
interface TestConnectionCallbacks {
  onSuccess?: (data: TestConnectionResponse) => void;
  onError?: (error: Error) => void;
}

// Response from testConnection mutation
interface TestConnectionResponse {
  success: boolean;
  message: string;
  error: string | null;
  testResult: TestResult | null;
  timestamp: string;
}

/**
 * @hook useExchangeVault
 * @description Industrial hook for managing exchange connections via Supabase.
 */
export const useExchangeVault = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Connected Accounts
  const { data: accounts = [], isLoading, error } = useQuery({
    queryKey: ['trading', 'exchanges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quant_exchanges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Industrial Mapping
      return data.map((raw: RawExchange) => {
        // Determine status based on both is_active and error state
        let status: 'healthy' | 'error' | 'disconnected' | 'unknown' = 'unknown';
        
        // Debug log
        console.debug(`[Exchange ${raw.name}]`, {
          is_active: raw.is_active,
          last_verified_at: raw.last_verified_at,
          last_error_message: raw.last_error_message
        });

        // Priority: Error > Healthy > Disconnected > Unknown
        if (raw.last_error_message) {
          status = 'error';
          console.warn(`[Exchange ${raw.name}] Status set to ERROR:`, raw.last_error_message);
        } else if (raw.is_active && raw.last_verified_at) {
          status = 'healthy';
        } else if (!raw.is_active) {
          status = 'disconnected';
        }

        const mapped = {
          id: raw.id,
          name: raw.name,
          provider: raw.exchange_provider,
          status,
          isPaper: true,
          lastSync: raw.last_verified_at 
            ? new Date(raw.last_verified_at).toLocaleString()
            : 'Never verified',
          lastError: raw.last_error_message || null,
          apiKeyMasked: `${raw.api_key.substring(0, 4)}...${raw.api_key.substring(raw.api_key.length - 4)}`
        };

        return mapped;
      }) as ExchangeAccount[];
    }
  });

  // 2. Connect Exchange Mutation
  const connectExchange = useMutation({
    mutationFn: async (payload: ConnectPayload) => {
      const { data, error } = await supabase
        .from('quant_exchanges')
        .insert([{
          tenant_id: '00000000-0000-0000-0000-000000000000', // Demo
          name: payload.name,
          exchange_provider: payload.provider,
          api_key: payload.apiKey,
          api_secret: payload.apiSecret,
          is_active: true
        }])
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'exchanges'] });
    }
  });

  // 3. Test Connection Mutation
  const testConnection = useMutation({
    mutationFn: async (id: string) => {
      // Fetch raw credentials from DB (Internal call)
      const { data, error } = await supabase
        .from('quant_exchanges')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      let testResult: TestResult | null = null;
      let errorMessage: string | null = null;

      try {
        // Call Python Core API for connection test
        const requestPayload = {
          exchangeId: data.exchange_provider,
          apiKey: data.api_key,
          apiSecret: data.api_secret,
          isPaper: true // MVP default
        };
        
        console.debug('[testConnection] Sending request to Python Core:', requestPayload);
        
        const response = await fetch('http://localhost:8000/exchanges/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload)
        });

        console.debug('[testConnection] Response HTTP status:', response.status);
        testResult = await response.json();
        console.debug('[testConnection] Full response from Python Core:', JSON.stringify(testResult, null, 2));

        // Python Core returns { success: boolean, error?: string }
        // Check the success field, not HTTP status
        if (testResult?.success === false) {
          const rawError = testResult?.error || 'Connection test failed';
          
          // Try to parse CCXT error format: 'binance {"code":-2015,"msg":"..."}'
          const jsonMatch = rawError.match(/\{.*\}/);
          if (jsonMatch) {
            try {
              const parsedError = JSON.parse(jsonMatch[0]);
              errorMessage = parsedError.msg || rawError;
            } catch {
              errorMessage = rawError;
            }
          } else {
            errorMessage = rawError;
          }
          
          console.warn('[testConnection] Python Core returned error:', errorMessage);
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        errorMessage = error.message || 'Failed to reach Python Core API';
        console.error('[testConnection] Fetch error:', err);
      }

      // Update Supabase with test result
      const updatePayload: UpdatePayload = {
        last_verified_at: new Date().toISOString(),
        is_active: !errorMessage // Mark as active only if no errors
      };

      if (errorMessage) {
        updatePayload.last_error_message = errorMessage;
      } else {
        // Clear error message if test succeeds
        updatePayload.last_error_message = null;
      }

      console.debug('[testConnection] Updating exchange with:', {
        exchangeId: id,
        updatePayload,
        errorMessage
      });

      const { error: updateError } = await supabase
        .from('quant_exchanges')
        .update(updatePayload)
        .eq('id', id);

      if (updateError) {
        console.error('[testConnection] Error updating Supabase:', updateError);
        throw updateError;
      }

      console.debug('[testConnection] Successfully updated. Returning result:', {
        success: !errorMessage,
        error: errorMessage
      });

      return {
        success: !errorMessage,
        message: errorMessage || 'Connection successful',
        error: errorMessage,
        testResult,
        timestamp: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'exchanges'] });
    }
  });

  // Wrapper function to handle testConnection with callbacks
  const handleTestConnection = (id: string, callbacks?: TestConnectionCallbacks) => {
    testConnection.mutate(id, {
      onSuccess: (data: TestConnectionResponse) => {
        callbacks?.onSuccess?.(data);
      },
      onError: (error: Error) => {
        callbacks?.onError?.(error);
      }
    });
  };

  return {
    accounts,
    isLoading,
    error,
    connectExchange: connectExchange.mutate,
    isConnecting: connectExchange.isPending,
    testConnection: handleTestConnection,
    isTesting: testConnection.isPending,
    testResult: testConnection.data
  };
};
