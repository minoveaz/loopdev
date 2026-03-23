# Quant Strategy Audit Trail & Change Management

This log tracks all architectural and parameter adjustments made to standardized trading protocols.

---

## [1.1.0] - 2026-03-22
### Strategy: `IntradayATRStrategy` (atr-breakout-v1)
- **Change**: Reduced ATR Volatility Filter from `0.002` (0.2%) to `0.0005` (0.05%).
- **Reason**: The 0.2% threshold was too restrictive for current BTC volatility on 1m timeframes, causing "99% proximity hangs" where the price crossed the SMA but the volatility filter rejected the trade.
- **Impact**: Expected 3x increase in signal frequency during stable market regimes.
- **Status**: DEPLOYED

---

## [1.0.0] - 2026-03-21
### Strategy: `RSIMeanReversionStrategy` (rsi-mean-rev-v1)
- **Change**: Initial release of the standardized RSI protocol.
- **Status**: PRODUCTION_READY
