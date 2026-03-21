ESTRATEGIA DE TRADING AUTÓNOMO — BTC/USDT
Documentación completa 

1. OBJETIVO Y ESTRUCTURA DE CUENTA
Objetivo de rentabilidad: 8-15% mensual (escenario base), con picos de 12-18% en meses con tendencia clara.
Cuenta dedicada: El bot opera con el 100% del saldo disponible en Binance. No hay dinero de otros portfolios en esa cuenta.
Distribución de capital:
50% del portfolio en BTC — reserve de venta para operar en corto en mercados bajistas sin futuros ni apalancamiento
50% del portfolio en USDT — capital para operaciones de compra en mercados alcistas
Par operado: BTC/USDT (Binance Spot)
Apalancamiento: Ninguno. Todo el riesgo es el porcentaje del capital vendido/comprado.

2. RÉGIMEN DE MERCADO
El bot clasifica el mercado en 5 estados antes de cada ciclo:
Régimen
Condición
Estrategias activas
strong_bull
Tendencia alcista fuerte + ADX > 25 + sentimiento > 0.65
Sentiment Momentum → Momentum
bull
Tendencia alcista moderada + ADX > 20
Momentum → Mean Reversion
ranging
Sin tendencia, ADX < 20
Mean Reversion → Scalping (fallback)
bear
Tendencia bajista moderada + ADX > 20
Bear Sentiment → Momentum SELL
strong_bear
Tendencia bajista fuerte + ADX > 25
Bear Sentiment → Momentum SELL

Regla ADX: Si ADX < 20 y el régimen calculado es tendencial, se fuerza a ranging. El ADX es el árbitro final del régimen.

3. ESTRATEGIAS — CONDICIONES DE ENTRADA
3.1 Sentiment Momentum (BUY only — strong_bull)
Timeframe: 1h
Sentimiento de liquidez > 0.65 (calculado desde datos públicos de Binance Futures: funding rate, Long/Short ratio, taker buy/sell ratio, open interest)
EMA10 > EMA20 en 1h
Volumen ≥ 1.1× SMA10
Stop Loss: 2.5× ATR por encima de entrada
Take Profit: 5.0× ATR por debajo de entrada (R:R 1:2)
3.2 Momentum MACD (BUY o SELL — bull, bear, strong_bear)
Timeframe: 5m
MACD(12,26,9) cruce en la dirección de la tendencia
Precio al lado correcto de EMA50 (por encima para BUY, por debajo para SELL)
Volumen ≥ 1.3× SMA20
Stop Loss: 2× ATR
Take Profit: 4× ATR (R:R 1:2)
3.3 Mean Reversion Bollinger (BUY o SELL — ranging, primaria; bull, secundaria)
Timeframe: 15m
BUY: precio ≤ banda inferior BB(20, 2σ) + RSI(14) < 35
SELL: precio ≥ banda superior BB(20, 2σ) + RSI(14) > 65
Target natural: precio medio de las Bollinger Bands
Stop Loss: 1.5× ATR
Take Profit: precio → media BB (R:R variable, normalmente 1:2.5)
3.4 Scalping RSI+Vol (BUY o SELL — solo ranging y solo como fallback)
Condición de activación: Mean Reversion ha dicho HOLD (precio no está en extremo de BB). El scalper revisa si hay micro-movimientos válidos en la zona central del rango.
Timeframe: 1m / 5m
Cruce de EMA detecto con precisión (no solo cruce, sino cruce confirmado)
RSI(14) en zona favorable (no sobrecomprado/vendido)
Volumen ≥ 1.2× SMA20
Stop Loss: 1.5× ATR
Take Profit: 3.0× ATR (R:R 1:2)
3.5 Bear Sentiment (SELL only — bear, strong_bear)
Timeframe: 1h
Régimen bear o strong_bear con ADX > 18
Liquidez bajista: score < 0.38 o funding rate < -0.02% (longs siendo liquidados)
EMA10 < EMA20 en 1h
Volumen ≥ 1.1× SMA10
RSI entre 42-68 (entrada temprana, no tarde en la caída)
Stop Loss: 2.5× ATR por encima de entrada
Take Profit: 5.0× ATR por debajo (R:R 1:2)
Mecánica: vende BTC del reserve. Si el precio cae, recompra más barato. Sin futuros ni apalancamiento.

4. SISTEMA DE SALIDA BIFÁSICO (todas las estrategias)
Cada posición tiene un sistema de cierre en dos fases diseñado para proteger beneficios y capturar movimientos extendidos.
Fase 1 — Take Profit inicial (50% de la posición)
Cuando el precio alcanza el TP calculado por la estrategia, se cierra el 50% de la posición
El beneficio de esa mitad queda garantizado
Se activa inmediatamente la Fase 2
Fase 2 — Trailing Take Profit (50% restante)
El Trailing TP arranca exactamente en el precio del TP inicial (nunca por debajo)
Garantía absoluta: el 50% restante nunca cierra por debajo del precio al que cerró la primera mitad
El TTP sigue el precio a 0.7% de distancia desde el máximo alcanzado
Si el precio sigue subiendo (BUY) → el TTP sube con él, siempre 0.7% por debajo del máximo
Cierra cuando el precio retrocede hasta el TTP
Ejemplo BTC — entrada a $100,000:
TP inicial:  $103,000 → cierra 50% aquí (beneficio +3% en esa mitad)
TTP arranca: $103,000 (= precio Phase 1, suelo garantizado)
Precio sube a $106,000 → TTP = $106,000 × 0.993 = $105,258
Precio sube a $108,000 → TTP = $108,000 × 0.993 = $107,244
Precio cae a $107,244  → cierra 50% restante aquí
Resultado total: 50%×3% + 50%×7.24% = 1.5% + 3.62% = +5.12% bruto


Trailing Stop Loss (protección desde +1.5%)
Se activa cuando la posición supera +1.5% de beneficio
Sube el Stop Loss al 0.8% por debajo del precio actual
Se actualiza en cada ciclo si el precio sigue subiendo
Prioridad: si se activa antes de llegar al TP inicial, cierra toda la posición
Validación fee-aware del TP
El TP mínimo calculado siempre cubre 2× el fee de ejecución + la distancia del SL
TP_mínimo = precio × (1 + 2×fee_rate + sl_pct) para BUY
Nunca se abre una operación que no pueda ser rentable después de fees

5. SIZING DE POSICIONES
Parámetro
Valor por defecto
Configurable
Tamaño base por operación
6% del portfolio
BASE_POSITION_PCT
Tamaño máximo por operación
10% del portfolio
MAX_POSITION_PCT
Exposición simultánea máxima
25% del portfolio
MAX_TOTAL_EXPOSURE_PCT
Reserve mínimo de BTC intocable
25% del portfolio
Calculado: BTC_RESERVE_PCT - 0.25

Regla de no-duplicado: no puede haber dos posiciones abiertas en el mismo par al mismo tiempo.

6. CIRCUIT BREAKER — REDUCCIÓN DE SIZE POR PÉRDIDA DIARIA
El circuit breaker reduce automáticamente el tamaño de las operaciones según las pérdidas acumuladas del día. No bloquea el bot, lo hace más conservador.
Pérdida diaria
Multiplicador de size
0% a -2%
×100% (normal)
-2% a -3.5%
×60%
-3.5% a -5%
×30%
> -5%
×0% — nuevas entradas bloqueadas


7. HALT DIARIO POR RACHAS DE PÉRDIDAS
Distinto al circuit breaker. Mientras el día va bien, no hay límite de operaciones. Si hay una racha de pérdidas consecutivas, el bot para de abrir nuevas posiciones hasta medianoche UTC.
Umbral por defecto: 5 pérdidas consecutivas (DAILY_HALT_STREAK)
Cuando se activa: notificación inmediata por Telegram
Las posiciones ya abiertas siguen gestionándose con SL y TTP normalmente
Reset automático a las 00:00 UTC
Configurable: DAILY_HALT_STREAK=5 en .env

8. UMBRAL DE CONFIANZA DINÁMICO
Cada señal generada tiene un score de confianza [0-1]. El umbral mínimo para ejecutar varía según sesión y circunstancias:
Por sesión horaria (UTC):
Sesión
Horas UTC
Umbral
Asia
00:00-08:00
0.68 (más exigente — liquidez baja)
Europa
08:00-14:00
0.62 (base)
NY overlapping
14:00-20:00
0.60 (más permisivo — máxima liquidez)
Tarde NY
20:00-24:00
0.65

Ajuste por racha de pérdidas:
Si hay 3+ pérdidas consecutivas (STREAK_THRESHOLD): umbral + 0.08 adicional
Obliga al bot a ser más selectivo tras una racha mala (antes de llegar al halt)
Umbral efectivo final: umbral_sesión + (boost_si_racha)

9. FILTROS DE EJECUCIÓN
Antes de lanzar cualquier orden al mercado, se validan:
Filtro 1 — Spread bid-ask:
Se calcula: (ask - bid) / mid
Si spread > 0.05% (MAX_SPREAD_PCT): operación cancelada
Protege contra condiciones de liquidez baja, noticias, flash crashes
En BTC/USDT en Binance el spread normal es 0.01-0.02%
Filtro 2 — Balance suficiente:
BUY: verifica USDT libre ≥ coste + fees
SELL: verifica BTC libre ≥ cantidad a vender y que la venta no rompa el reserve mínimo de BTC
Filtro 3 — No duplicado:
Si ya hay una posición abierta en BTC/USDT, no se abre otra hasta cerrarla
Tipo de orden por estrategia:
Scalping: market order (velocidad crítica)
Mean Reversion y Momentum: limit order al mejor precio disponible (reduce fees potencialmente)
Sentiment y BearSentiment: market order (entry en momentum, no puede esperar)

10. ANÁLISIS DE LIQUIDEZ (sustituto del sentimiento social)
En vez de scraping de redes sociales, el bot usa datos de mercado reales de Binance Futures (endpoints públicos, sin autenticación):
Fuente
Peso en score
Interpretación
Funding Rate
35%
< -0.02%: shorts dominan (bullish contrarian) / > 0.05%: longs extremos (bearish)
Long/Short Ratio
30%
> 2.0: demasiados longs → riesgo flush bajista / < 0.7: squeeze alcista posible
Taker Buy/Sell Ratio
25%
> 1.3: presión compradora real / < 0.7: presión vendedora
Open Interest Change
10%
Aumento + precio sube: confirmación tendencia / Disminución: posibles cierres

Score compuesto [0-1]:
< 0.25: longs_crowded — riesgo de liquidación masiva alcista
0.78: shorts_crowded — riesgo de short squeeze
0.35-0.65: zona neutral
Cache de 5 minutos por símbolo para no sobrecargar la API.

11. RECOMENDACIÓN DE PARADA (human-in-the-loop)
El único punto de intervención humana en todo el sistema. El bot evalúa cada 2 minutos si las condiciones son lo suficientemente críticas para recomendar una parada manual.
Condiciones que activan la recomendación:
Pérdida diaria > 7% (el circuit breaker ya cubrió hasta -5%)
6+ pérdidas consecutivas (el halt diario ya paró tras 5)
Mecánica:
Envía mensaje Telegram con botón "Confirmar parada" / "Ignorar"
Timeout de 10 minutos — si no hay respuesta, el bot continúa operando
Si el usuario confirma: el bot para ordenadamente
No bloqueante: el bot no espera la respuesta para continuar sus ciclos normales
Se envía como máximo una vez por día (se resetea a medianoche)

12. PERSISTENCIA DE ESTADO
El bot sobrevive a reinicios y apagones sin perder el hilo.
Guardado automático: cada 5 minutos (y en apagado ordenado)
Posiciones abiertas con su estado completo (entry, SL, TTP, phase, amount)
Métricas del día (PnL, racha, trades)
Fecha del estado
Al reiniciar:
Carga el estado guardado
Comprueba si es el mismo día — si es otro día, resetea métricas
Reconcilia posiciones contra el balance real de Binance:
Si el balance tiene BTC/ETH ≈ lo que había guardado (tolerancia 95%): posición sigue abierta
Si el balance no coincide: la posición se cerró mientras el bot estaba parado — estima el PnL, actualiza rachas
Reanuda la operativa normal
Guardado atómico: escribe en .tmp → os.replace() para evitar estados corruptos si se corta la luz en mitad de la escritura.

13. CICLO DE OPERACIÓN
El ciclo principal es adaptativo — la velocidad cambia según las condiciones:
Situación
Intervalo
Evento relevante detectado
15 segundos
Mercado activo con señales
30 segundos
Mercado normal
60 segundos
Mercado lateral sin señales (ADX bajo)
90 segundos

Loops paralelos activos 24/7:
main_trading_loop — ciclo principal de análisis y ejecución
stop_recommendation_loop — monitoreo de condiciones críticas (cada 2 min)
daily_reset_loop — reset a medianoche UTC
state_save_loop — guardado de estado (cada 5 min)
performance_reporting_loop — reporte Telegram (cada 1h)
event_monitoring_loop — monitoreo de eventos económicos (cada 10 min)

14. PARÁMETROS CONFIGURABLES (.env)
# Sizing
BASE_POSITION_PCT=0.06          # Tamaño base por operación (6% portfolio)
MAX_POSITION_PCT=0.10           # Tamaño máximo por operación (10% portfolio)
MAX_TOTAL_EXPOSURE_PCT=0.25     # Exposición simultánea máxima (25% portfolio)
BTC_RESERVE_PCT=0.50            # % portfolio a mantener en BTC como reserve de venta

# Circuit Breaker
DAILY_LOSS_SOFT_PCT=0.02        # -2% diario → size ×60%
DAILY_LOSS_MEDIUM_PCT=0.035     # -3.5% diario → size ×30%
DAILY_LOSS_HARD_PCT=0.05        # -5% diario → nuevas entradas bloqueadas

# Halt por rachas
DAILY_HALT_STREAK=5             # Pérdidas consecutivas para parar el día
STREAK_THRESHOLD=3              # Pérdidas consecutivas para subir umbral de confianza
STREAK_CONFIDENCE_BOOST=0.08    # Incremento del umbral por racha

# Confianza
CONFIDENCE_THRESHOLD=0.62       # Umbral base (ajustado por sesión)

# Trailing TP
PARTIAL_CLOSE_PCT=0.50          # % posición a cerrar en TP inicial (50%)
TRAILING_TP_DISTANCE=0.007      # Distancia trailing desde máximo (0.7%)

# Ejecución
MAX_SPREAD_PCT=0.0005           # Spread bid-ask máximo permitido (0.05%)

# APIs externas
CRYPTOPANIC_TOKEN=              # Token API CryptoPanic (opcional)
BINANCE_API_KEY=                # Clave API Binance
BINANCE_API_SECRET=             # Secreto API Binance
TELEGRAM_BOT_TOKEN=             # Token bot Telegram
TELEGRAM_CHAT_ID=               # Chat ID Telegram



15. RESUMEN EJECUTIVO
ENTRADA:
  Señal generada por estrategia según régimen
  + Confianza ≥ umbral dinámico (sesión + racha)
  + Spread ≤ 0.05%
  + Balance suficiente (respetando reserves)
  + No hay posición abierta en el mismo par
  + Circuit breaker no bloqueado
  + Halt diario no activo

GESTIÓN:
  Trailing SL: se activa a partir de +1.5% beneficio
  Trailing TP bifásico:
    - Phase 1: cierre 50% en TP inicial
    - Phase 2: 50% restante con TTP a 0.7% del máximo,
               nunca por debajo del precio de Phase 1

SALIDA:
  - SL alcanzado (cierre total)
  - Phase 1 TP alcanzado (cierre 50%)
  - Trailing TP Phase 2 alcanzado (cierre 50% restante)

PROTECCIÓN DEL DÍA:
  - Circuit breaker reduce sizes progresivamente hasta -5%
  - Halt diario para nuevas entradas tras 5 pérdidas consecutivas
  - Recomendación de parada manual si pérdida > 7% o 6+ pérdidas seguidas

RÉGIMEN → ESTRATEGIA:
  strong_bull  → Sentiment Momentum BUY
  bull         → Momentum BUY (+MR pullbacks)
  ranging      → Mean Reversion primaria / Scalping fallback
  bear         → Bear Sentiment SELL / Momentum SELL
  strong_bear  → Bear Sentiment SELL



