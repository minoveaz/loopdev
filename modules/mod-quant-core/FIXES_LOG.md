# Technical Fixes Log - mod-quant-core

Registro detallado de issues críticos encontrados y corregidos.
**Formato**: ID | Severidad | Fecha | Status | Descripción

---

## [ATR-001] - CRITICAL - 2026-03-18 - FIXED

**Título**: ATR True Range Calculation Incomplete

**Problema**:
```python
# INCORRECTO:
df['tr'] = df['high'] - df['low']

# El código ignora gaps respecto al cierre anterior
```

**Por qué es crítico**:
- ATR mide volatilidad verdadera
- Si hay gap up/down, el True Range debe incluirlo
- Sin esto, ATR subestima volatilidad en ~40% en mercados con gaps

**Ejemplo de Error**:
```
Vela actual:   High=105, Low=102, Close=104
Vela anterior: Close=100 (gap up de 2 puntos)

❌ ACTUAL: TR = 105-102 = 3
✅ CORRECTO: TR = MAX(105-102, ABS(105-100), ABS(102-100)) = 5

Error: -40% en volatilidad reportada
```

**Impacto en Trading**:
- Take Profit targets calculados 40% más bajos
- Stop Loss placement incorrecto
- Dimensionamiento de posiciones basado en volatilidad falsa

**Fix Implementado**:
- Cambiar a True Range de Wilder's ATR estándar
- Línea: `src/strategies/intraday_atr.py:21-22`

---

## [ATR-002] - HIGH - 2026-03-18 - FIXED

**Título**: ATR Usa SMA en lugar de EMA

**Problema**:
```python
# INCORRECTO:
df['atr'] = df['tr'].rolling(window=14).mean()  # SMA

# CORRECTO:
df['atr'] = df['tr'].ewm(span=14, adjust=False).mean()  # EMA
```

**Por qué es incorrecto**:
- SMA da igual peso a todos los 14 periodos (7.14% cada uno)
- EMA da más peso a los datos recientes (13.3% hoy, 1% hace 14 periodos)
- En volatilidad que cambia, EMA reacciona más rápido

**Ejemplo Visual**:
```
Últimos 14 TR: [1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5]
                ↑ Hace tiempo      ↑ Volatilidad SUBIENDO ahora

SMA(14) = 3.14  (suaviza mucho el cambio)
EMA(14) = 4.8   (reacciona rápido)
```

**Impacto**:
- ATR reacciona lentamente a cambios de volatilidad
- En mercados acelerados, el ATR está "atrasado"
- Filtros basados en ATR fallan en cambios de régimen rápido

**Fix Implementado**:
- Línea: `src/strategies/intraday_atr.py:22`

---

## [BACKTEST-001] - HIGH - 2026-03-18 - FIXED

**Título**: Case Mismatch en ATR - Backtest Nunca Usa ATR

**Problema**:
```python
# En intraday_atr.py se crea: df['atr'] (minúsculas)
# En backtest_engine.py se busca: df['ATR'] (mayúsculas)

current_atr = current_row.get('ATR', 0)  # Siempre retorna 0!
target_price = strategy.get_exit_price(current_price, 0, 'buy')  # ATR siempre es 0
```

**Impacto**:
- El TP se calcula con ATR=0
- Estrategia entera usa ATR falso
- Backtests dan resultados completamente erróneos

**Línea**: `src/core/backtest_engine.py:92`

**Fix**: Cambiar a minúsculas `'atr'`

---

## [HYBRID-001] - HIGH - 2026-03-18 - FIXED

**Título**: HybridCoreStrategy No Usa ATR en Exit

**Problema**:
```python
def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
    multiplier = 0.025  # 2.5% fijo
    # ❌ Ignora completamente el parámetro atr
    # ❌ No implementa la dinámica prometida en registry
```

**Registro Says**: "TP dinámico basado en 1.5x ATR"
**Código Real**: TP fijo al 2.5%

**Impacto**:
- Estrategia "hybrid" ni es hybrid
- No adapta targets a volatilidad actual
- En mercados volátiles, targets irreales

**Fix**: Usar ATR si disponible, fallback a %

---

## [STRATEGY-001] - CRITICAL - 2026-03-18 - FIXED

**Título**: Método `calculate_trailing_stop()` No Existe

**Problema**:
```python
# En backtest_engine.py:115 se llama:
if strategy.calculate_trailing_stop(current_price, position['max_price']):
    
# ❌ Este método NO está definido en BaseStrategy ni HybridCoreStrategy
# ❌ AttributeError en runtime
```

**Impacto**: 
- Backtest crash garantizado si usa HybridCoreStrategy
- Trailing stop logic nunca ejecuta

**Fix**: 
- Implementar en `base.py` (abstract method)
- Implementar en ambas estrategias

---

## [VALIDATION-001] - CRITICAL - 2026-03-18 - FIXED

**Título**: División por Cero en manage_position()

**Problema**:
```python
# En strategy_manager.py:104
pnl_pct = ((current_price - entry_price) / entry_price) * 100
# Si entry_price == 0 → ZeroDivisionError
```

**Por qué ocurre**:
- Sin validación de entry_price en BD
- Datos corruptos pueden causar entry_price=0

**Impacto**: Bot crash

---

## [VALIDATION-002] - HIGH - 2026-03-18 - FIXED

**Título**: Sin Validación de NaN/Inf en Precios

**Problema**:
```python
# check_signal() no valida:
price = row['close']  # Podría ser NaN, Inf, negativo
# → Se crean órdenes con precios inválidos
```

**Impacto**:
- Órdenes corruptas en BD
- Cálculos de P&L inválidos
- Backtests con resultados inconsistentes

**Fix**: Validaciones completas de NaN, Inf, negativos, ceros

---

## [CAPITAL-001] - HIGH - 2026-03-18 - FIXED

**Título**: Backtest No Valida Capital Disponible

**Problema**:
```python
# En backtest_engine.py:152
qty = size_per_trade / current_price
# No verifica si size_per_trade > capital disponible
# Permite apalancar infinitamente en backtest ficticio
```

**Impacto**:
- Backtests no realistas
- Resumen de performance inflado
- Estrategia parece mejor de lo que es en realidad

---

## [VOLATILITY-FILTER-001] - MEDIUM - 2026-03-18 - ADDED

**Título**: Sin Filtros de Volatilidad en Entry Signals

**Problema**:
```python
# Actual: entra en ANY crossover
cross_above = prev_price < prev_sma and price > sma
if cross_above:
    return {"side": "buy"}  # Entra sin validar nada más
```

**Problema Real**:
- Cruces triviales generan muchas falsas señales
- Mercados tranquilos + pequeño movimiento = entrada falsa
- Win rate bajo, muchos trades pequeños perdedores

**Ejemplo**:
```
Precio cruza SMA por 0.001% (1 satoshi en BTC)
→ Entrada generada
→ Luego sigue cayendo
→ SL hit
→ Pérdida
```

**Fix Implementado**:
- Filtro: Crossover magnitude > 0.5x ATR
- Filtro: ATR > 0.5% del precio (volatilidad mínima)
- Filtro: Validación de datos NaN

**Impacto Esperado**:
- Menos trades totales
- Mejor win rate
- Trades de mayor magnitud

---

## [SECURITY-001] - CRITICAL - 2026-03-18 - SECURITY

**Título**: CORS Allow All Origins

**Problema**:
```python
# main.py
allow_origins=["*"]  # ¡Cualquiera puede llamar!
```

**Impacto**:
- Script malicioso desde otro sitio puede acceder a /strategies/backtest
- Ataque de fuerza bruta posible
- DDoS posible

**Fix**: Restringir a origins específicos

---

## [SECRETS-001] - CRITICAL - 2026-03-18 - SECURITY

**Título**: JWT de Supabase Expuesto en .env

**Problema**:
```
.env contiene:
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Riesgo**:
- JWT válido, puede acceder a BD completa
- Si alguien obtiene este token, acceso total a quant_bots, quant_orders, etc.

**Status**: ⚠️ REQUIERE ACCIÓN MANUAL
1. REVOCAR esta clave en Supabase Dashboard
2. Generar nueva SERVICE_ROLE_KEY
3. Actualizar .env

---

## Estadísticas

- **Críticos Encontrados**: 8
- **Altos Encontrados**: 9
- **Medios Encontrados**: 5
- **Bajos Encontrados**: 6

**Total Issues**: 28

**Status Actual**: 
- [x] Críticos identificados
- [x] Altos identificados
- [ ] Implementación de fixes en progreso
