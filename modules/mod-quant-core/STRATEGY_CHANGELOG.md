---

## [1.2.5] - 2026-03-23
### Strategy: Operational Safety Update
- **Feature**: Implemented `BE_SHIELD` (Auto Break-Even).
- **Logic**: Automatic migration of Stop Loss to Break-Even price once PnL hits `+0.25%`.
- **Reason**: Protect capital from round-trip fees and sudden market reversals during high-frequency trades. This ensures that any trade that starts well becomes "risk-free" as soon as possible.
- **Status**: DEPLOYED

---

## [1.2.0] - 2026-03-23
### Strategy: Global Scalping Optimization
- **Change**: Reduced default Take Profit from `5.0%` to `1.5%`.
- **Change**: Reduced Trailing Activation threshold from `2.0%` to `0.8%`.
- **Reason**: 5% TP was unrealistic for 1m timeframes. New targets align with statistical volatility of BTC/USDT on 1m charts, ensuring higher trade rotation and capital efficiency.
- **Status**: DEPLOYED

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
