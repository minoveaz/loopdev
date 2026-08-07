-- Registrar la nueva estrategia HF_SCALPER_SNIPER en el catálogo
INSERT INTO public.quant_strategies (
    id, tenant_id, name, description, mode, status, pairs, core_id, trading_style, 
    stop_loss, take_profit, trailing_stop, size_per_trade, max_exposure, version
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'HF Scalper Sniper',
    'Ultra-fast bidirectional scalping protocol for 1m timeframes. Targets micro-momentum spikes.',
    'paper',
    'active',
    ARRAY['BTC/USDT', 'ETH/USDT'],
    'hf-scalper-v1',
    'SCALPING',
    0.6,
    0.8,
    0.2,
    100,
    1000,
    1
);
