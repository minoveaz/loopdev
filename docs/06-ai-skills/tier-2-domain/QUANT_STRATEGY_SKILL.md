# 📈 QUANT STRATEGY SKILL v1.0

> **Authority:** Quant Engineering
> **Status:** ✅ Published
> **Last Updated:** 2026-03-21
> **Applicable to:** Trading strategy development and validation

---

## 🎯 Rol de la IA

Eres un **Senior Trading Strategy Engineer** especializado en crear estrategias de trading consistentes, auditables y backtestables. Tu responsabilidad es:

1. **Crear estrategias** que heredan de BaseStrategy
2. **Implementar entrada/salida** con lógica clara y determinista
3. **Parametrizar** de modo que sea tunable sin cambios de código
4. **Documentar** cada decisión y regla
5. **Estructurar** para que sean organizables por asset

---

## ⏱️ CUÁNDO USAR ESTA SKILL

✅ **USA esta skill cuando:**
- Has completado skill-discovery para la estrategia
- Has definido entry/exit logic claramente
- Necesitas estructura consistente con otras estrategias
- Quieres que sea backtestable y auditable
- Necesitas que sea parametrizable

❌ **NO uses esta skill cuando:**
- Aún estás explorando entry/exit lógica (usa discovery)
- La estrategia es un one-off experimental (crea en otra rama)

---

## 📥 INPUT (What the Human Provides)

Proporciona SIEMPRE:

```markdown
## Strategy Name
[e.g., Bitcoin Trend Following]

## Asset Class & Timeframe
[BTC / ETH / ALT, plus 1m/5m/15m/1h/4h/1d]

## Entry Conditions
[Clear boolean logic with indicators]

## Exit Conditions
[Clear boolean logic with indicators]

## Risk Management
[Stop loss, position sizing, max loss per trade]

## Parameters
[What can be tuned: indicator periods, thresholds]

## Indicators Used
[What TA indicators, with their calculations]
```

### Ejemplo Input:

```markdown
## Strategy: Bitcoin RSI Mean Reversion

## Asset & Timeframe
BTC / 1h candles

## Entry Conditions
RSI(14) < 30 (oversold)
AND price > SMA(200) (not in downtrend)

## Exit Conditions
RSI(14) > 70 (overbought)
OR price < entry_price - 2% (stop loss)
OR trade open > 48 hours (time exit)

## Risk Management
Stop loss: 2% below entry
Position size: Risk max 1% per trade
Max exposure: $1000 per trade

## Parameters
- rsi_period: 14 (tunable: 10-20)
- rsi_entry_threshold: 30 (tunable: 20-40)
- rsi_exit_threshold: 70 (tunable: 60-80)
- sma_period: 200 (tunable: 50-500)

## Indicators
RSI: RSI = 100 - (100 / (1 + RS))
     where RS = avg_gain / avg_loss
SMA: Simple Moving Average over N periods
```

---

## 📤 OUTPUT (What This Skill Produces)

Entregar SIEMPRE un archivo Python siguiente estructura:

### 1. 📝 STRATEGY FILE STRUCTURE

```python
# File: src/strategies/bitcoin/btc_rsi_mean_reversion.py

from typing import Optional, Dict, Any
from .base import BaseStrategy
from datetime import datetime

class BTCRSIMeanReversion(BaseStrategy):
    """
    Bitcoin RSI Mean Reversion Strategy.
    
    Entry: RSI < 30 (oversold) + price > SMA(200) (not downtrend)
    Exit: RSI > 70 (overbought) OR stop loss triggered
    
    This strategy exploits oversold conditions in Bitcoin by entering
    when RSI crosses below 30, with confirmation from longer-term trend.
    
    Performance Target:
    - Win Rate: 55-65%
    - Sharpe Ratio: 1.0+
    - Max Drawdown: <20%
    """
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Entry parameters (tunable)
        self.rsi_period: int = kwargs.get('rsi_period', 14)
        self.rsi_entry_threshold: int = kwargs.get('rsi_entry_threshold', 30)
        self.rsi_exit_threshold: int = kwargs.get('rsi_exit_threshold', 70)
        self.sma_period: int = kwargs.get('sma_period', 200)
        
        # Risk management (fixed per spec)
        self.stop_loss_pct: float = 0.02  # 2% below entry
        self.max_trade_duration_hours: int = 48
        self.position_size_pct: float = 0.01  # 1% risk per trade
```

### 2. 📊 IMPLEMENT base_signal() METHOD

```python
    def base_signal(self, candles: list) -> Dict[str, Any]:
        """
        Generate trading signal based on RSI + SMA logic.
        
        Args:
            candles: List of OHLCV candles with at least:
                    {timestamp, open, high, low, close, volume}
        
        Returns:
            Dict with:
            {
                'signal': 'BUY' | 'SELL' | 'HOLD',
                'confidence': 0.0-1.0,
                'reason': 'Entry condition description',
                'entry_price': float,
                'stop_loss': float,
                'rsi_value': float,
                'sma_value': float,
            }
        """
        
        if not self._has_enough_data(candles, self.sma_period + 50):
            return {'signal': 'HOLD', 'reason': 'Insufficient data'}
        
        # Calculate indicators
        closes = [c['close'] for c in candles]
        rsi = self._calculate_rsi(closes, self.rsi_period)
        sma = self._calculate_sma(closes, self.sma_period)
        
        current_price = closes[-1]
        current_rsi = rsi[-1]
        current_sma = sma[-1]
        
        # ===== ENTRY LOGIC =====
        if self._should_enter(closes, rsi, sma):
            entry_price = current_price
            stop_loss = entry_price * (1 - self.stop_loss_pct)
            
            return {
                'signal': 'BUY',
                'confidence': self._calculate_confidence(current_rsi, current_sma),
                'reason': f'RSI({current_rsi:.1f}) < {self.rsi_entry_threshold} + SMA confirmation',
                'entry_price': entry_price,
                'stop_loss': stop_loss,
                'rsi_value': current_rsi,
                'sma_value': current_sma,
            }
        
        # ===== EXIT LOGIC =====
        if self._should_exit(closes, rsi, current_price):
            return {
                'signal': 'SELL',
                'reason': f'RSI({current_rsi:.1f}) > {self.rsi_exit_threshold}',
                'rsi_value': current_rsi,
            }
        
        return {'signal': 'HOLD'}
    
    # ===== HELPER METHODS =====
    
    def _should_enter(self, closes: list, rsi: list, sma: list) -> bool:
        """Entry condition: RSI oversold + above trend"""
        current_price = closes[-1]
        current_rsi = rsi[-1]
        current_sma = sma[-1]
        
        # Condition 1: RSI < entry threshold (oversold)
        rsi_oversold = current_rsi < self.rsi_entry_threshold
        
        # Condition 2: Price > SMA (not in downtrend)
        above_trend = current_price > current_sma
        
        # Condition 3: RSI was previously higher (rising from oversold)
        rsi_rising = len(rsi) >= 2 and rsi[-1] > rsi[-2]
        
        return rsi_oversold and above_trend and rsi_rising
    
    def _should_exit(self, closes: list, rsi: list, entry_price: float) -> bool:
        """Exit condition: RSI overbought OR stop loss"""
        current_price = closes[-1]
        current_rsi = rsi[-1]
        
        # Condition 1: RSI > exit threshold (overbought)
        rsi_overbought = current_rsi > self.rsi_exit_threshold
        
        # Condition 2: Stop loss hit
        stop_loss_hit = current_price < (entry_price * (1 - self.stop_loss_pct))
        
        return rsi_overbought or stop_loss_hit
    
    def _calculate_confidence(self, rsi: float, sma_ratio: float) -> float:
        """Confidence: How strong is the signal?"""
        # RSI further from threshold = higher confidence
        rsi_confidence = min(abs(rsi - 50) / 50, 1.0)
        
        # How much above SMA = higher confidence
        sma_confidence = min(max(sma_ratio, 1.0), 1.5) / 1.5
        
        return (rsi_confidence * 0.6 + sma_confidence * 0.4)
    
    def _calculate_rsi(self, closes: list, period: int) -> list:
        """Calculate RSI indicator"""
        if len(closes) < period + 1:
            return [None] * len(closes)
        
        rsi_values = []
        for i in range(len(closes)):
            if i < period:
                rsi_values.append(None)
                continue
            
            gains = 0
            losses = 0
            for j in range(i - period, i):
                change = closes[j + 1] - closes[j]
                if change > 0:
                    gains += change
                else:
                    losses -= change
            
            avg_gain = gains / period
            avg_loss = losses / period
            
            if avg_loss == 0:
                rsi = 100 if avg_gain > 0 else 0
            else:
                rs = avg_gain / avg_loss
                rsi = 100 - (100 / (1 + rs))
            
            rsi_values.append(rsi)
        
        return rsi_values
    
    def _calculate_sma(self, closes: list, period: int) -> list:
        """Calculate Simple Moving Average"""
        if len(closes) < period:
            return [None] * len(closes)
        
        sma_values = []
        for i in range(len(closes)):
            if i < period - 1:
                sma_values.append(None)
            else:
                avg = sum(closes[i - period + 1:i + 1]) / period
                sma_values.append(avg)
        
        return sma_values
    
    def _has_enough_data(self, candles: list, min_required: int) -> bool:
        """Verify we have minimum data for calculations"""
        return len(candles) >= min_required
```

### 3. 📋 DOCSTRINGS & PARAMETERS

```python
    """Strategy parameters:
    
    Tunable (can change per backtest):
    - rsi_period: RSI lookback period (default 14, range 10-20)
    - rsi_entry_threshold: RSI level for entry (default 30, range 20-40)
    - rsi_exit_threshold: RSI level for exit (default 70, range 60-80)
    - sma_period: SMA lookback for trend (default 200, range 50-500)
    
    Fixed (per risk management):
    - stop_loss_pct: 2% below entry (fixed)
    - max_trade_duration_hours: 48 hours (fixed)
    - position_size_pct: 1% risk per trade (fixed)
    
    Expected Performance:
    - Win Rate: 55-65%
    - Profit Factor: 1.5-2.0
    - Sharpe Ratio: 1.0-1.5
    - Max Drawdown: <20%
    
    Warning:
    - Not suitable for sideways markets (RSI gets stuck mid-range)
    - Needs trend confirmation (SMA) to avoid false signals
    - Best on 1h-4h timeframes
    """
```

---

## 📁 FOLDER STRUCTURE

Todas las estrategias deben estar organizadas por asset:

```
src/strategies/
├── baseline/                    # Legacy v0 (deprecated)
│   ├── __init__.py
│   ├── rsi_mean_reversion.py
│   └── ...
│
├── bitcoin/                     # ✅ Active
│   ├── __init__.py
│   ├── btc_trend_following.py
│   ├── btc_rsi_mean_reversion.py  ← Your strategy here
│   ├── btc_volatility_breakout.py
│   └── README.md (strategies by asset)
│
├── ethereum/                    # Future
│   ├── __init__.py
│   └── README.md
│
└── altcoins/                    # Future
    ├── __init__.py
    └── README.md
```

---

## ✅ STRATEGY CHECKLIST

Antes de considerar la estrategia "completa":

- [ ] Inherita de BaseStrategy correctamente
- [ ] base_signal() retorna señales BUY/SELL/HOLD
- [ ] Entry logic es clara y documentada
- [ ] Exit logic es clara y documentada
- [ ] Parámetros son tuneables (no hardcodeados)
- [ ] Docstrings completos
- [ ] Helper methods son testables
- [ ] En carpeta correcta (bitcoin/, ethereum/, etc)
- [ ] Agregada a StrategyRegistry
- [ ] Backtest genera >10 señales en 90 días
- [ ] Win rate >50%, profit factor >1.2

---

## 🧪 VALIDATION CHECKLIST

Después de backtest:

- [ ] Backtest corre sin errores
- [ ] Genera >5 señales (no stuck)
- [ ] Win rate ≥50%
- [ ] Profit factor ≥1.2
- [ ] Sharpe ratio ≥0.5
- [ ] Max drawdown <50%

If ANY metric is red, strategy needs debugging.

---

## 🚨 COMMON MISTAKES

❌ **DON'T:** Hardcode parameters
```python
WRONG:
def base_signal(self):
    rsi = calculate_rsi(14)  # Hardcoded!
    if rsi < 30:  # Hardcoded!
        return 'BUY'

RIGHT:
def __init__(self, **kwargs):
    self.rsi_period = kwargs.get('rsi_period', 14)
    self.rsi_threshold = kwargs.get('rsi_threshold', 30)

def base_signal(self):
    rsi = calculate_rsi(self.rsi_period)
    if rsi < self.rsi_threshold:
        return 'BUY'
```

❌ **DON'T:** Forget edge cases
```python
WRONG:
def base_signal(self, candles):
    rsi = calculate_rsi(candles)  # What if <period data?
    
RIGHT:
def base_signal(self, candles):
    if len(candles) < self.rsi_period + 1:
        return {'signal': 'HOLD', 'reason': 'Insufficient data'}
    rsi = calculate_rsi(candles)
```

❌ **DON'T:** Circular logic
```python
WRONG:
Entry: RSI < 30
Exit: RSI < 30  # ❌ Will exit immediately!

RIGHT:
Entry: RSI < 30
Exit: RSI > 70  # ✅ Clear opposing condition
```

---

## 🎓 NEXT SKILL

After strategy implementation:
→ **skill-qa-testing** to create backtest + unit tests

---

**Skill Version:** 1.0
**Created:** 2026-03-21
**Authority:** Quant Engineering
**Status:** ✅ Ready to Use
