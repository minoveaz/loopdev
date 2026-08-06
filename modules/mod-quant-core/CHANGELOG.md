# Changelog - mod-quant-core

Todos los cambios notables en este módulo serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Volatility filters for entry signals (crossover magnitude validation)
- Better error handling for Supabase queries
- Input validation for NaN, Inf, and negative values in price/quantity calculations

### Fixed
- **[CRITICAL]** ATR True Range calculation now includes close-to-close gaps (Wilder's ATR standard)
- **[CRITICAL]** ATR now uses EMA (exponential moving average) instead of SMA
- **[HIGH]** Case mismatch in backtest_engine.py: changed 'ATR' to 'atr'
- **[HIGH]** HybridCoreStrategy now properly uses ATR in exit price calculation
- **[HIGH]** Added missing `calculate_trailing_stop()` method to strategies
- Division by zero protection in position management (entry_price validation)
- Capital validation to prevent over-leveraging in backtests
- CORS security: restricted to specific origins instead of allow-all

### Changed
- Strategy entry signal logic now includes ATR-based volatility filters
- Exit price validation ensures TP > entry price for buy signals

### Security
- Hardcoded API keys removed from strategy_manager.py
- CORS middleware restricted from wildcard origins
- Supabase credential handling improved

---

## [1.0.0] - 2026-03-18

### Initial Release
- FastAPI server with /health, /strategies/registry, /exchanges/test, /strategies/backtest endpoints
- BacktestEngine with OHLCV data fetching and trade simulation
- StrategyManager for live paper trading with Supabase sync
- Two implemented strategies: IntradayATR and HybridCore
- Market regime filters (bullish/bearish/neutral detection)
- Async exchange connector via CCXT

---

## Notas sobre Versionado

- **MAJOR (X.0.0)**: Breaking changes en API o arquitectura
- **MINOR (0.X.0)**: Nuevas features sin breaking changes
- **PATCH (0.0.X)**: Bug fixes

## [1.1.0] - 2026-03-18

### Added
- **RSI Mean Reversion Pro (rsi-mean-rev-v1)** - New scalping strategy
  - 70-75% expected win rate
  - Mean reversion entry logic (RSI < 30 / > 70)
  - SMA50 trend confirmation
  - ATR-based dynamic risk management
  - Supports both LONG and SHORT positions
  - Timeframe: 5m, 15m (intraday scalping)
- Backtest validation script for strategy testing
- Quick start guide for RSI Mean Reversion setup

### Improved
- Strategy architecture now supports multiple concurrent strategies
- Enhanced test coverage with standalone backtest engine
- Better documentation for strategy development

### Fixed
- [No new fixes in this release]

