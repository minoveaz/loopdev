'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@loopdev/ui';

export interface RiskSettings {
  killSwitchActive: boolean;
  maxDailyLossUsdt: number;
  maxTotalExposureUsdt: number;
  maxConcurrentBots: number;
}

interface RiskSettingsPayload {
  kill_switch_active?: boolean;
  max_daily_loss_usdt?: number;
  max_total_exposure_usdt?: number;
  max_concurrent_bots?: number;
}

/**
 * @hook useRiskSettings
 * @description Governance hook for global safety parameters.
 */
export const useRiskSettings = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Global Settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['trading', 'risk-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quant_risk_settings')
        .select('*')
        .single();

      if (error) throw error;

      return {
        killSwitchActive: data.kill_switch_active,
        maxDailyLossUsdt: Number(data.max_daily_loss_usdt),
        maxTotalExposureUsdt: Number(data.max_total_exposure_usdt),
        maxConcurrentBots: data.max_concurrent_bots
      } as RiskSettings;
    }
  });

  // 2. Update Settings Mutation
  const updateSettings = useMutation({
    mutationFn: async (params: Partial<RiskSettings>) => {
      const payload: RiskSettingsPayload = {};
      if (params.killSwitchActive !== undefined) payload.kill_switch_active = params.killSwitchActive;
      if (params.maxDailyLossUsdt !== undefined) payload.max_daily_loss_usdt = params.maxDailyLossUsdt;
      if (params.maxTotalExposureUsdt !== undefined) payload.max_total_exposure_usdt = params.maxTotalExposureUsdt;
      if (params.maxConcurrentBots !== undefined) payload.max_concurrent_bots = params.maxConcurrentBots;

      const { error } = await supabase
        .from('quant_risk_settings')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('tenant_id', '00000000-0000-0000-0000-000000000000'); // Demo

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trading', 'risk-settings'] });
      toast.show({
        tenantId: 'loopdev',
        title: 'Governance_Updated',
        description: 'Global risk parameters have been committed to the engine.',
        variant: 'success'
      });
    }
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
    isUpdating: updateSettings.isPending
  };
};
