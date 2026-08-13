> **DEPRECATED:** Experimental trading product exploration; not current product direction.

Blueprint UX — Plataforma de Trading Bot v1
1. Nombre del producto
Nombre de trabajo
Loopdev Trade
Racional
Aprovecha la continuidad de marca de Loopdev y transmite:
producto tecnológico
automatización
operativa y control
posibilidad de evolución a plataforma
Otras opciones de naming
Loopdev Alpha
Loopdev Pilot
Loopdev Orbit
Loopdev Flow
Loopdev Signal
Recomendación
Usar de momento Loopdev Trade como nombre funcional de producto y validar luego naming comercial con diseño y branding.

2. Posicionamiento UX del producto
La aplicación no debe percibirse como “un bot que compra solo”, sino como:
una consola personal de trading automatizado con control, visibilidad y seguridad.
Principios de experiencia
Control antes que emoción
Claridad antes que complejidad
Riesgo visible en todo momento
Acciones críticas siempre confirmadas
El usuario debe entender qué hace el sistema y por qué
El diseño debe inspirar confianza, no casino

3. Perfil de usuario inicial
Usuario principal
Inversor particular avanzado o semitécnico que:
opera su propio capital
quiere automatizar parte de su operativa
necesita entender posiciones, riesgo y resultados
no quiere un panel excesivamente técnico
Nivel de experiencia esperado
entiende conceptos como PnL, órdenes, stop loss y drawdown
no necesariamente sabe programar
Implicación UX
La aplicación debe equilibrar:
lenguaje profesional
visuales limpios
profundidad operativa
curva de aprendizaje razonable

4. Reutilización de Loopdev
Se reutiliza la base visual de Loopdev en:
estilo sobrio y moderno
interfaz limpia
componentes consistentes
sensación de producto premium
uso de tarjetas, tablas, badges, tabs, modales y side navigation
Adaptación específica para trading
La capa visual debe incorporar:
jerarquía fuerte de datos
color de riesgo semántico
métricas en tiempo real
estados operativos visibles
feedback constante del sistema

5. Paleta de color
Objetivo visual
Transmitir:
confianza
precisión
tecnología
calma
control financiero
Paleta base
Neutros
Background Primary: #0B1020
Background Secondary: #12182B
Surface Card: #161E33
Surface Elevated: #1B2540
Border Soft: #28324D
Border Strong: #36415F
Text Primary: #F5F7FB
Text Secondary: #A9B4CC
Text Muted: #7D89A6
Colores de marca
Brand Primary: #6D5EF9
Brand Hover: #7C70FA
Brand Soft: #2C245E
Brand Accent: #8B7CFF
Semánticos de trading
Profit / Success: #16C784
Profit Soft: #123C2E
Loss / Danger: #EA3943
Loss Soft: #451E25
Warning: #F0B90B
Warning Soft: #4A3A10
Info: #4DA3FF
Info Soft: #132B4A
Regla UX importante
No abusar del verde y rojo. Solo deben señalar:
PnL
cambio de precio
estado de riesgo
alertas críticas
El resto del producto debe apoyarse principalmente en neutros + color de marca.

6. Tipografía
Propuesta
Inter como tipografía principal
JetBrains Mono para números, precios, IDs, órdenes y logs
Escala sugerida
Display: 40/48
H1: 32/40
H2: 24/32
H3: 20/28
H4: 18/24
Body Large: 16/24
Body: 14/20
Small: 12/16
Caption: 11/14
Principio
Datos financieros y operativos deben tener legibilidad extrema. Se prioriza alineación, spacing y contraste.

7. Sistema de layout
Grid
12 columnas desktop
8 columnas tablet
4 columnas mobile
Breakpoints sugeridos
Mobile: 360–767
Tablet: 768–1279
Desktop: 1280+
Espaciado base
Sistema 4pt:
4
8
12
16
20
24
32
40
48
Radios
cards: 16px
inputs: 12px
modales: 20px
pills/badges: 999px

8. Arquitectura general del front
Módulos principales visibles para el usuario
Dashboard
Portfolio
Positions
Orders
Strategies
Market
Risk Center
Activity / Logs
Notifications
Exchange Accounts
Settings
Onboarding
Navegación principal recomendada
Sidebar izquierda persistente en desktop.
Sidebar
Overview
Portfolio
Positions
Orders
Strategies
Market
Risk
Activity
Notifications
Accounts
Settings
Top bar
selector de cuenta
estado del sistema
búsqueda global
alert center
perfil de usuario
botón rápido “Pause all”

9. Dashboard / Overview
Objetivo
Responder en menos de 10 segundos:
cuánto capital hay
cuánto está en riesgo
qué está haciendo el bot
si todo funciona bien
qué ha pasado hoy
Estructura
Hero stats row
Cards con:
Equity total
PnL del día
PnL no realizado
Capital desplegado
Riesgo actual
Estado del sistema
Gráfico principal
Equity curve
selector temporal: 1D / 7D / 30D / 90D / YTD / All
Bloque “Bot status”
modo: live / paper / paused
exchange conectado
estrategias activas
posiciones abiertas
órdenes pendientes
último sync con exchange
Bloque “Open risk”
exposición por activo
exposición por estrategia
concentración máxima
drawdown actual
Bloque “Today activity”
Timeline con:
compras
ventas
stops
rechazos de riesgo
errores
alertas
Bloque “Top movers / top contributors”
mejor estrategia hoy
peor estrategia hoy
par con mejor PnL
par con peor PnL
Interacciones
cada card enlaza a su módulo
hover muestra breakdown
métricas con delta vs periodo anterior

10. Portfolio
Objetivo
Dar visión agregada de capital, distribución y performance.
Componentes
total balance
available cash
deployed capital
realized PnL
unrealized PnL
allocation chart
asset allocation table
strategy allocation chart
exchange balances table
Visualizaciones
donut de asignación por activo
barras por estrategia
área de evolución de patrimonio
Tabla principal
Columnas:
Asset
Quantity
Avg Cost
Mark Price
Market Value
Unrealized PnL
% Portfolio
Strategy
Risk Tag
Acciones
exportar CSV
rebalancear manualmente
cerrar exposición
filtrar por estrategia / exchange

11. Positions
Objetivo
Ver cada posición viva o cerrada con detalle operativo.
Tabs
Open Positions
Closed Positions
Archived
Tabla open positions
Columnas:
Pair
Side
Strategy
Entry Price
Current Price
Size
Value
Unrealized PnL
Stop
Take Profit
Open Time
Status
Actions
Acciones por fila
View detail
Pause strategy on pair
Close position
Adjust stop
Add note
Vista detalle de posición
Panel lateral o página detalle con:
resumen de la posición
thesis / razón de entrada
historial de órdenes
fills
cambios de stop
alertas
gráfico con anotaciones de entry / exit / stop
timeline de eventos
Estados visuales
healthy
at risk
stop nearby
orphaned / needs reconciliation
paused

12. Orders
Objetivo
Dar transparencia de ejecución.
Tabs
Open Orders
Filled
Cancelled
Rejected
Tabla
Columnas:
Time
Pair
Order Type
Side
Quantity
Price
Status
Exchange Status
Slippage
Strategy
Source
Filtros
fecha
par
estado
estrategia
tipo de orden
Vista detalle
order intent
risk decision
payload enviado al exchange
response exchange
fills asociados
timestamps

13. Strategies
Objetivo
Centro de control de estrategias.
Listado de estrategias
Cards o tabla con:
Strategy name
Version
Status
Mode
Pairs
Capital allocated
Open positions
PnL 7d / 30d
Drawdown
Risk score
Acciones
activate
pause
clone
edit parameters
archive
backtest
paper test
Detalle de estrategia
Secciones:
Summary
Parameters
Pairs
Performance
Risk rules
Activity
Version history
Parámetros configurables visibles
size per trade
max positions
max exposure
entry filters
stop loss
take profit
trailing rules
cooldown
rebuy policy
daily loss limit
Requisito UX clave
No mostrar parámetros excesivamente técnicos sin contexto. Añadir:
descripción corta
valor recomendado
warning si el parámetro aumenta mucho el riesgo

14. Market
Objetivo
Contexto de mercado y watchlist.
Secciones
Watchlist
Market regime
Top volatility
Signals feed
Pair details
Componentes
heatmap de pares
lista de señales recientes
overview BTC / ETH / mercado general
volatilidad y volumen
régimen detectado: bullish / neutral / bearish / high volatility
Vista detalle de par
mini chart
price stats
spread
volatility
open positions using this pair
recent signals
risk restrictions applied

15. Risk Center
Objetivo
Que el usuario entienda y controle riesgo antes de resultados.
Bloques
Global risk status
Daily loss limit
Strategy risk usage
Exposure concentration
Correlated exposure
Risk events
Emergency actions
Cards principales
Current exposure %
Daily PnL vs daily stop
Max drawdown active
Highest concentration asset
Highest concentration strategy
Positions near stop
Tabla de eventos de riesgo
timestamp
severity
category
affected object
message
action taken
Acciones críticas
Pause all trading
Pause strategy
Close all open positions
Disable new entries
Enable safe mode
Requisito UX
Todas las acciones destructivas requieren confirmación fuerte y resumen del impacto.

16. Activity / Logs
Objetivo
Auditoría legible del sistema.
Vista principal
Timeline o tabla filtrable con eventos:
signal_detected
risk_rejected
order_submitted
order_filled
stop_triggered
position_closed
sync_completed
api_error
websocket_error
Columnas
Time
Event
Severity
Module
Pair
Strategy
Summary
Detail
Niveles
info
warning
error
critical
Vista detalle
JSON expandible + interpretación humana.

17. Notifications
Objetivo
Centralizar avisos útiles, no ruido.
Tipos
execution
risk
system health
strategy
account
Preferencias
in-app
email
Telegram
push futuro
Vista
Inbox por prioridad con filtros.

18. Exchange Accounts
Objetivo
Gestionar conexiones a exchanges y estado de sincronización.
Listado
Exchange
Account label
Mode: live / paper
Status
Last sync
Permissions
Base currency
Acciones
connect
reconnect
rotate keys
disable
test connection
Seguridad UX
Nunca mostrar secretos completos.
Mostrar solo:
label
exchange
created at
last verified
permission scope

19. Settings
Secciones
Profile
Security
Preferences
Notifications
Trading defaults
Appearance
Audit
Security
change password
2FA
active sessions
device history
Preferences
base currency
timezone
number formatting
light/dark, si aplica
language futuro
Trading defaults
default slippage tolerance
default confirmation behaviour
safe mode on startup

20. Onboarding
Objetivo
Reducir fricción inicial y evitar configuración peligrosa.
Flujo sugerido
Welcome
Create profile
Connect exchange
Choose mode: paper / live
Set risk profile
Activate first strategy
Review safety checklist
Open dashboard
Seguridad
Por defecto proponer:
paper trading
límites de riesgo conservadores
notificaciones activas

21. Inventario de componentes de la aplicación
El sistema de diseño debe dividir los componentes en dos grandes familias:
componentes base
componentes especializados de trading y control operativo
La meta es que diseño y front trabajen sobre un inventario único, con componentes reutilizables, consistentes y escalables.
21.1 Componentes base de layout y navegación
App shell
AppShell
Sidebar
SidebarSection
SidebarItem
Topbar
TopbarActions
PageHeader
PageTitleBlock
PageToolbar
Breadcrumbs
Tabs
SegmentedControl
SecondaryNav
StickyActionBar
SplitPaneLayout
DrawerLayout
ResponsiveContainer
Grid
Stack
Section
Divider
Utilidad esperada
Sirven para construir toda la estructura principal del producto y mantener consistencia entre módulos.
21.2 Componentes base de contenido y visualización
Cards y contenedores
Card
MetricCard
DetailCard
SummaryCard
ChartCard
TableCard
StatusCard
ExpandableCard
EmptyStateCard
DangerZoneCard
Tipografía y contenido
Heading
Subheading
BodyText
Caption
Label
HelperText
CodeText
MetricValue
DeltaValue
InlineStat
KeyValueList
DefinitionList
Utilidad esperada
Permiten presentar datos financieros, textos operativos y bloques explicativos con una jerarquía clara.
21.3 Componentes base de formularios
Inputs
TextInput
PasswordInput
NumberInput
CurrencyInput
PercentInput
SearchInput
TextArea
PinInput
OTPInput
Selección
Select
MultiSelect
ComboBox
RadioGroup
Checkbox
CheckboxGroup
ToggleSwitch
SegmentedToggle
PairSelector
StrategySelector
ExchangeSelector
Control avanzado
Slider
RangeSlider
Stepper
DatePicker
DateRangePicker
TimePicker
TagInput
ChipsInput
FormSection
FormRow
FieldGroup
ValidationMessage
Utilidad esperada
Soportan configuración de estrategias, ajustes de riesgo, conexión de exchanges y preferencias del usuario.
21.4 Componentes base de feedback y estado
Badge
Pill
StatusDot
StatusBadge
AlertBanner
InlineAlert
Toast
Snackbar
ProgressBar
ProgressRing
LoadingSpinner
Skeleton
Tooltip
Popover
Modal
ConfirmationModal
SidePanel
Drawer
ContextMenu
DropdownMenu
CommandPalette
Utilidad esperada
Comunican estado del sistema, acciones completadas, errores, confirmaciones y ayudas contextuales.
21.5 Componentes base de datos y tablas
DataTable
SortableTableHeader
FilterBar
FilterChip
ColumnManager
Pagination
TableToolbar
RowActionsMenu
ExpandableRow
EmptyTableState
BulkActionBar
QuickFilters
Utilidad esperada
Base para órdenes, posiciones, actividad, balances, cuentas y estrategia.
21.6 Componentes base de visualización analítica
LineChartContainer
AreaChartContainer
BarChartContainer
DonutChartContainer
PieChartContainer
HeatmapContainer
Sparkline
MiniTrendChart
Histogram
DistributionChart
Timeline
EventStream
KPIGroup
DeltaIndicator
ComparisonLegend
Utilidad esperada
Visualizan evolución de equity, distribución de cartera, contribución por estrategia y eventos operativos.
21.7 Componentes base de interacción global
GlobalSearch
GlobalAccountSwitcher
ThemeToggle
NotificationBell
QuickActionMenu
GlobalPauseButton
GlobalResumeButton
HelpMenu
UserMenu
WorkspaceSwitcher
Utilidad esperada
Dan acceso rápido a acciones frecuentes y al estado global de la aplicación.
22. Componentes especializados de trading
22.1 Componentes de mercado y activos
AssetBadge
PairBadge
PairIdentity
AssetIcon
PriceTicker
LivePriceLabel
MarketRegimeBadge
SpreadIndicator
VolatilityIndicator
LiquidityIndicator
MarketHealthChip
WatchlistRow
WatchlistTable
MarketHeatmapTile
SignalChip
SignalStrengthBar
RegimeSummaryCard
Uso
Se usan en Market, Dashboard, Positions y Strategies para mostrar contexto de mercado en tiempo real.
22.2 Componentes de PnL y rendimiento
PnLBadge
PnLValue
RealizedPnLCard
UnrealizedPnLCard
DailyPnLCard
WeeklyPnLCard
MonthlyPnLCard
PnLSparkline
DrawdownCard
ProfitFactorCard
WinRateCard
SharpeLikeCard
StrategyPerformanceCard
PortfolioContributionChart
Uso
Permiten mostrar resultados de forma legible, con suficiente detalle sin convertir la UI en una terminal.
22.3 Componentes de posiciones
PositionCard
PositionRow
PositionStateBadge
PositionExposureBar
PositionRiskBadge
EntryExitMarker
PositionTimeline
PositionSummaryPanel
PositionDetailHeader
PositionEventsList
PositionChartPanel
PositionActionsMenu
ClosePositionModal
AdjustStopModal
AdjustTakeProfitModal
PositionHealthIndicator
Uso
Se usan en el módulo Positions y en paneles laterales desde Dashboard o Risk.
22.4 Componentes de órdenes y ejecución
OrderRow
OrderCard
OrderTypeBadge
OrderStatusBadge
FillStatusChip
SlippageIndicator
ExecutionTimeline
ExecutionDetailPanel
OrderIntentCard
RiskDecisionCard
ExchangeResponseCard
CancelOrderModal
ManualOrderPanel
OrderSourceBadge
Uso
Sirven para entender qué quiso hacer la estrategia, qué aprobó el riesgo y qué ejecutó realmente el exchange.
22.5 Componentes de estrategias
StrategyCard
StrategyStatusBadge
StrategyVersionBadge
StrategyModeBadge
StrategyPerformanceMiniCard
StrategyAllocationBar
StrategyParametersPanel
StrategyPairsTable
StrategyRiskPanel
StrategyHistoryTimeline
StrategyCloneModal
StrategyEditorSection
StrategyActivationModal
StrategyPauseModal
StrategyHealthCard
StrategyTag
Uso
Centro visual de configuración, análisis y control de cada estrategia.
22.6 Componentes de riesgo
RiskStatusCard
RiskMeter
RiskBudgetBar
RiskExposureChart
RiskEventRow
RiskSeverityBadge
CorrelationWarningCard
ConcentrationWarningCard
DailyLossGauge
MaxDrawdownIndicator
RiskRuleCard
RiskOverrideModal
SafeModeBanner
EmergencyActionPanel
RiskApprovalStatus
RiskRejectionReason
Uso
Se emplean principalmente en Risk Center, pero también deben aparecer de forma transversal en Dashboard, Positions y Strategies.
22.7 Componentes de cuentas y exchange
ExchangeAccountCard
ExchangeStatusBadge
ConnectionHealthIndicator
LastSyncLabel
PermissionScopeList
APIKeyMaskedField
ExchangeTestResultCard
AccountModeBadge
ReconnectExchangeModal
RotateKeysModal
SyncNowButton
ExchangeConnectionWizard
Uso
Permiten gestionar conexiones de forma segura y comprensible.
22.8 Componentes de actividad, logs y auditoría
EventRow
EventSeverityBadge
EventModuleBadge
EventDetailDrawer
AuditTrailTable
LogJsonViewer
HumanReadableExplanation
ErrorTracePanel
SyncEventTimeline
SystemStatusPanel
Uso
Dan trazabilidad completa del sistema y ayudan a soporte, debug y confianza del usuario.
22.9 Componentes de alertas y notificaciones
NotificationCard
NotificationRow
NotificationTypeBadge
NotificationPriorityBadge
NotificationPreferenceForm
AlertDigestCard
AlertInboxTable
MarkAsReadAction
SnoozeNotificationAction
EscalationNotice
Uso
Unifican notificaciones in-app y preferencias por canal.
23. Componentes especializados de configuración y seguridad
23.1 Seguridad y acceso
LoginForm
PasswordResetForm
TwoFactorSetupPanel
SessionList
DeviceHistoryTable
SecurityAlertBanner
SensitiveActionConfirmModal
TypedConfirmationInput
AccessScopeTable
23.2 Perfil y preferencias
UserProfileCard
TimezoneSelector
CurrencyPreferenceSelector
AppearanceSelector
LanguageSelector futuro
NotificationPreferencesPanel
TradingDefaultsPanel
23.3 Onboarding
OnboardingStepper
SetupChecklist
ExchangeConnectStep
RiskProfileStep
StrategyStarterCard
SafetyChecklistCard
FirstRunSuccessScreen
24. Componentes compuestos prioritarios para el MVP
Estos son los componentes compuestos que más valor aportan y que conviene diseñar primero porque construyen buena parte de la app.
Prioridad alta
AppShell
Sidebar
Topbar
MetricCard
DataTable
FilterBar
ChartCard
StatusBadge
AlertBanner
ConfirmationModal
PositionRow
PositionDetailPanel
OrderRow
StrategyCard
StrategyParametersPanel
RiskStatusCard
RiskEventRow
ExchangeAccountCard
NotificationCard
Prioridad media
HeatmapContainer
MarketRegimeBadge
ExecutionTimeline
PositionTimeline
StrategyHistoryTimeline
EmergencyActionPanel
ExchangeConnectionWizard
AuditTrailTable
Prioridad futura
ManualOrderPanel
WorkspaceSwitcher
CommandPalette avanzada
CorrelationWarningCard avanzado
PortfolioContributionChart avanzado
StrategyVersionDiffViewer
25. Librería de componentes: criterios de calidad
Todo componente del sistema debe cumplir estas reglas:
responsive
accesible
tematizable
con estados empty/loading/error/success
reutilizable
documentado
con variantes de tamaño
con variante disabled y read-only cuando aplique
Estados mínimos por componente
default
hover
focus
active
disabled
loading
error si aplica
success si aplica
Props comunes sugeridas
size
variant
state
tooltip
icon
loading
disabled
testId
26. Convención recomendada para el equipo de diseño y front
Organización propuesta
Foundations
Layout
Navigation
Forms
Feedback
Data Display
Charts
Trading
Risk
Strategies
Accounts
Security
Notifications
Resultado esperado
Diseño y desarrollo deben poder mapear cada pantalla del producto a una combinación de estos componentes, evitando crear UI ad hoc para cada módulo.
27. Estados vacíos
Estados vacíos
La app debe tener empty states útiles:
no positions yet
no strategy active
no exchange connected
no alerts
no orders in period
Cada empty state debe incluir:
mensaje claro
explicación breve
CTA principal
CTA secundaria opcional

23. Estados del sistema
Estados globales
Live
Paper
Paused
Safe mode
Degraded
Disconnected
Representación
Badge persistente en topbar con color + tooltip + última actualización.

24. Acciones rápidas globales
Botón flotante o dropdown superior:
Pause all
Resume trading
Disable new entries
Close selected positions
Run sync now
Open risk center

25. Patrones de interacción clave
1. Ver → entender → actuar
Toda pantalla debe responder:
qué pasa
si hay riesgo
qué puedo hacer ahora
2. Drill-down progresivo
Primero resumen, luego detalle. No saturar de inicio.
3. Confirmación contextual
Si el usuario cierra una posición o pausa una estrategia, mostrar impacto esperado.
4. Transparencia algorítmica
Siempre que sea posible mostrar:
por qué entró
por qué salió
qué regla aplicó
qué riesgo bloqueó algo

26. Prioridades para el equipo UX
Pantallas prioritarias para diseñar primero
Login / onboarding mínimo
Dashboard overview
Portfolio
Open positions
Strategies list + strategy detail
Risk center
Orders table
Exchange connection flow
Design system prioritario
sidebar + topbar
cards
tables
charts containers
modals
forms
badges / pills / alerts

27. Tono visual y de producto
Debe sentirse
premium
técnico
confiable
sobrio
contemporáneo
No debe sentirse
casino
hiperagresivo
lleno de luces y colores
orientado a hype
excesivamente retail

28. Copys UX de referencia
Tono
directo
profesional
claro
sin promesas de rentabilidad
Ejemplos
“Trading paused successfully”
“New entries are disabled until you re-enable them”
“Daily loss threshold is close”
“This strategy is using 62% of its allocated risk budget”
“Exchange sync completed 12 seconds ago”

29. Requisitos de diseño responsive
Mobile
No intentar meter toda la operativa compleja.
Priorizar:
overview
posiciones abiertas
alertas
pausa global
cierre manual puntual
Desktop
Debe ser la experiencia principal de trabajo.

30. Blueprint resumido de navegación
Sidebar principal
Overview
Portfolio
Positions
Orders
Strategies
Market
Risk
Activity
Notifications
Accounts
Settings
Flujo central esperado del usuario
entra al Overview
valida estado del sistema
revisa PnL y riesgo
abre Positions o Strategies
actúa si hace falta
vuelve al dashboard

31. Catálogo de componentes por prioridad
Este catálogo organiza los componentes según impacto en el MVP, dependencia transversal y valor para diseño + desarrollo.
La prioridad se divide en:
P0: imprescindible para diseñar y construir el MVP
P1: muy importante para flujos principales
P2: complementario, mejora profundidad y eficiencia operativa
P3: avanzado o evolutivo
Cada componente debe documentarse con:
propósito
dónde se usa
variantes
estados
notas de UX
31.1 Prioridad P0 — Núcleo del producto
Estos componentes permiten construir la estructura principal, las pantallas core y las acciones críticas.
Layout y navegación
AppShell
Propósito: estructura principal de la aplicación
Uso: todas las pantallas autenticadas
Variantes: desktop, tablet, mobile
Estados: default, collapsed-sidebar, loading
Notas UX: debe soportar sidebar fija, topbar y área central scrollable
Sidebar
Propósito: navegación principal del producto
Uso: acceso a módulos principales
Variantes: expanded, collapsed, mobile drawer
Estados: active item, hover, collapsed
Notas UX: icono + label, soporte para badge de alertas
Topbar
Propósito: acceso a acciones globales y estado del sistema
Uso: parte superior persistente
Variantes: default, compact
Estados: normal, degraded, disconnected
Notas UX: incluir account switcher, notification bell, user menu y quick actions
PageHeader
Propósito: título, descripción y acciones de cada pantalla
Uso: cabecera de módulo
Variantes: simple, with-actions, with-tabs
Estados: default
Notas UX: debe mantener consistencia visual entre módulos
Tabs
Propósito: alternar vistas relacionadas
Uso: Positions, Orders, Settings, Strategies
Variantes: underline, pill
Estados: active, inactive, disabled
Notas UX: no usar más de 5 tabs visibles sin overflow controlado
Contenido y datos
MetricCard
Propósito: mostrar KPI principal
Uso: Dashboard, Portfolio, Risk
Variantes: plain, with-delta, with-mini-chart
Estados: normal, positive, negative, warning, loading
Notas UX: prioridad alta en jerarquía visual, usar números grandes y delta clara
ChartCard
Propósito: encapsular visualizaciones con header y acciones
Uso: equity, allocation, pnl, drawdown
Variantes: line, area, bar, donut
Estados: normal, empty, loading, error
Notas UX: incluir rango temporal y export cuando aplique
DataTable
Propósito: mostrar listas operativas complejas
Uso: positions, orders, activity, accounts
Variantes: dense, regular
Estados: default, loading, empty, filtered-empty, error
Notas UX: debe soportar sorting, filtros, paginación y row actions
FilterBar
Propósito: filtrar tablas y listas
Uso: Orders, Activity, Positions
Variantes: inline, stacked
Estados: default, active-filters
Notas UX: mostrar filters count y clear all
StatusBadge
Propósito: representar estados operativos
Uso: posiciones, órdenes, estrategias, cuenta, sistema
Variantes: success, danger, warning, info, neutral
Estados: default
Notas UX: semántica consistente en toda la app
AlertBanner
Propósito: destacar mensajes importantes a nivel pantalla o global
Uso: riesgo, desconexión exchange, safe mode
Variantes: info, warning, error, success
Estados: dismissible, persistent
Notas UX: reservar para mensajes realmente relevantes
ConfirmationModal
Propósito: confirmar acciones sensibles
Uso: pause all, close all positions, rotate keys
Variantes: standard, danger, typed-confirmation
Estados: default, submitting, success, error
Notas UX: debe mostrar impacto esperado de la acción
Trading y operativa
PositionRow
Propósito: representar una posición en tabla/lista
Uso: Open Positions, Closed Positions
Variantes: compact, full
Estados: healthy, at-risk, paused, reconciling
Notas UX: incluir acciones rápidas y lectura clara de entry/current/pnl
PositionDetailPanel
Propósito: ver detalle de una posición sin salir del contexto
Uso: panel lateral o drawer
Variantes: summary-first, analytics-first
Estados: loading, populated, error
Notas UX: debe incluir reason of entry, events, orders y chart anotado
OrderRow
Propósito: representar una orden
Uso: Orders table, Position detail
Variantes: compact, full
Estados: open, filled, cancelled, rejected, partial
Notas UX: mostrar tipo, side, qty, status y slippage cuando exista
StrategyCard
Propósito: resumen accionable de estrategia
Uso: Strategies list, Dashboard highlights
Variantes: compact, full, selectable
Estados: active, paused, paper, archived, degraded
Notas UX: debe resumir status, capital, pnl y riesgo
StrategyParametersPanel
Propósito: visualizar y editar parámetros de estrategia
Uso: detalle de estrategia
Variantes: read-only, editable
Estados: clean, dirty, saving, error
Notas UX: cada parámetro debe tener explicación contextual
RiskStatusCard
Propósito: mostrar estado general de riesgo
Uso: Dashboard, Risk Center
Variantes: global, strategy, position
Estados: healthy, caution, danger, blocked
Notas UX: debe ser fácil de leer en menos de 3 segundos
RiskEventRow
Propósito: mostrar evento de riesgo
Uso: Risk Center, Activity
Variantes: compact, detailed
Estados: info, warning, error, critical
Notas UX: incluir severidad, origen y acción tomada
ExchangeAccountCard
Propósito: resumir estado de una cuenta conectada
Uso: Accounts
Variantes: live, paper, disconnected
Estados: healthy, warning, error
Notas UX: mostrar permisos, último sync y acciones de mantenimiento
NotificationCard
Propósito: representar una notificación importante
Uso: Notifications, Dashboard digest
Variantes: risk, execution, system, account
Estados: unread, read, escalated
Notas UX: priorizar claridad y acción asociada
31.2 Prioridad P1 — Flujos principales ampliados
Layout y navegación
Breadcrumbs
SegmentedControl
SidePanel
Drawer
StickyActionBar
GlobalAccountSwitcher
QuickActionMenu
Formularios
CurrencyInput
PercentInput
Select
MultiSelect
ToggleSwitch
DateRangePicker
Stepper
ValidationMessage
Datos y feedback
EmptyStateCard
Tooltip
Popover
Toast
Skeleton
RowActionsMenu
Pagination
BulkActionBar
DeltaValue
KeyValueList
Trading
MarketRegimeBadge
Propósito: mostrar régimen de mercado detectado
Uso: Dashboard, Market, Strategy detail
Variantes: bullish, neutral, bearish, high-volatility
Estados: default
Notas UX: semántica consistente y no excesivamente colorista
PnLValue
Propósito: mostrar PnL monetario o porcentual
Uso: casi toda la app
Variantes: absolute, percent, combined
Estados: positive, negative, neutral
Notas UX: usar mono font para legibilidad
PositionStateBadge
Propósito: estado específico de posición
Uso: tables, detail panels
Variantes: open, paused, near-stop, reconciling, closed
Estados: default
Notas UX: complementar a StatusBadge general
PositionTimeline
Propósito: historial de eventos de una posición
Uso: detalle de posición
Variantes: compact, full
Estados: populated, empty
Notas UX: útil para entender por qué ocurrió cada acción
PositionChartPanel
Propósito: gráfico de precio con anotaciones de la posición
Uso: detalle de posición
Variantes: price-only, annotated
Estados: loading, populated, no-data
Notas UX: marcar entry, stop, take profit, exits parciales
OrderStatusBadge
Propósito: estado de orden
Uso: tables y detalle
Variantes: open, partial, filled, cancelled, rejected
Estados: default
Notas UX: color y texto deben ser inequívocos
ExecutionTimeline
Propósito: explicar secuencia orden → fill → resultado
Uso: detalle de orden
Variantes: compact, expanded
Estados: complete, partial, error
Notas UX: clave para trazabilidad
StrategyStatusBadge
Propósito: estado de estrategia
Uso: cards, tables, details
Variantes: active, paused, paper, archived, error
Estados: default
Notas UX: debe distinguir modo y salud
StrategyRiskPanel
Propósito: resumen de límites y consumo de riesgo de estrategia
Uso: Strategy detail
Variantes: summary, detailed
Estados: healthy, caution, breached
Notas UX: incluir usage vs budget
DailyLossGauge
Propósito: visualizar consumo del límite de pérdida diaria
Uso: Risk Center, Dashboard
Variantes: global, per-strategy
Estados: healthy, near-limit, breached
Notas UX: uno de los componentes más útiles para autocontrol
EmergencyActionPanel
Propósito: concentrar acciones críticas
Uso: Risk Center
Variantes: compact, full
Estados: armed, disabled
Notas UX: separar claramente acciones reversibles e irreversibles
ExchangeConnectionWizard
Propósito: conectar exchange paso a paso
Uso: onboarding, accounts
Variantes: first-connect, reconnect
Estados: idle, testing, success, error
Notas UX: reducir miedo y errores de configuración
AuditTrailTable
Propósito: historial auditable de eventos relevantes
Uso: Activity, Settings/Audit
Variantes: compact, full
Estados: populated, empty, loading
Notas UX: debe permitir filtrado por severidad y módulo
31.3 Prioridad P2 — Profundidad operativa y analítica
Base y soporte
SecondaryNav
CommandPalette
ExpandableCard
DangerZoneCard
ExpandableRow
ColumnManager
QuickFilters
KPIGroup
MiniTrendChart
Sparkline
HeatmapContainer
EventStream
Trading avanzado
AssetBadge
PairBadge
PairIdentity
PriceTicker
LivePriceLabel
SpreadIndicator
VolatilityIndicator
LiquidityIndicator
SignalChip
SignalStrengthBar
WatchlistRow
WatchlistTable
MarketHeatmapTile
RegimeSummaryCard
RealizedPnLCard
UnrealizedPnLCard
DrawdownCard
ProfitFactorCard
WinRateCard
StrategyPerformanceCard
PositionExposureBar
PositionRiskBadge
PositionEventsList
PositionActionsMenu
ClosePositionModal
AdjustStopModal
AdjustTakeProfitModal
FillStatusChip
SlippageIndicator
ExecutionDetailPanel
OrderIntentCard
RiskDecisionCard
ExchangeResponseCard
StrategyVersionBadge
StrategyModeBadge
StrategyAllocationBar
StrategyPairsTable
StrategyHistoryTimeline
StrategyCloneModal
StrategyActivationModal
StrategyPauseModal
StrategyHealthCard
RiskMeter
RiskBudgetBar
RiskExposureChart
RiskSeverityBadge
ConcentrationWarningCard
CorrelationWarningCard
MaxDrawdownIndicator
RiskRuleCard
SafeModeBanner
RiskApprovalStatus
RiskRejectionReason
ExchangeStatusBadge
ConnectionHealthIndicator
LastSyncLabel
PermissionScopeList
APIKeyMaskedField
ExchangeTestResultCard
ReconnectExchangeModal
RotateKeysModal
EventSeverityBadge
EventModuleBadge
EventDetailDrawer
LogJsonViewer
HumanReadableExplanation
ErrorTracePanel
SyncEventTimeline
SystemStatusPanel
NotificationTypeBadge
NotificationPriorityBadge
NotificationPreferenceForm
AlertInboxTable
EscalationNotice
31.4 Prioridad P3 — Evolutivos y orientados a futura plataforma
WorkspaceSwitcher
ManualOrderPanel
PortfolioContributionChart
SharpeLikeCard
ComparisonLegend
DistributionChart
Histogram
StrategyVersionDiffViewer
RiskOverrideModal
SyncNowButton
AccessScopeTable
SessionList
DeviceHistoryTable
TwoFactorSetupPanel
TypedConfirmationInput
OnboardingStepper
SetupChecklist
RiskProfileStep
StrategyStarterCard
SafetyChecklistCard
FirstRunSuccessScreen
ThemeToggle
HelpMenu
NotificationBell avanzada con digest
31.5 Orden recomendado para diseño
Fase 1 — Fundaciones
Diseñar primero:
AppShell
Sidebar
Topbar
PageHeader
MetricCard
StatusBadge
AlertBanner
ConfirmationModal
DataTable
FilterBar
ChartCard
Fase 2 — Core trading
Diseñar después:
PositionRow
PositionDetailPanel
OrderRow
StrategyCard
StrategyParametersPanel
RiskStatusCard
RiskEventRow
ExchangeAccountCard
NotificationCard
Fase 3 — Profundidad
Diseñar a continuación:
MarketRegimeBadge
PnLValue
PositionTimeline
PositionChartPanel
ExecutionTimeline
StrategyRiskPanel
DailyLossGauge
EmergencyActionPanel
ExchangeConnectionWizard
AuditTrailTable
Fase 4 — Escalado
Diseñar al final:
CommandPalette
ManualOrderPanel
WorkspaceSwitcher
CorrelationWarningCard
StrategyVersionDiffViewer
PortfolioContributionChart
31.6 Formato de ficha para cada componente
Cada componente debería documentarse en una ficha de diseño con esta estructura:
Nombre
Ejemplo: StrategyCard
Propósito
Qué problema resuelve y qué comunica.
Contextos de uso
En qué pantallas aparece.
Jerarquía
Si es componente base, compuesto o especializado.
Variantes
Compact / full / danger / editable / loading, etc.
Estados
Default, hover, focus, active, loading, disabled, empty, error.
Contenido mínimo
Qué datos debe mostrar obligatoriamente.
Acciones posibles
Botones, menús o enlaces disponibles.
Reglas UX
Qué debe priorizar, qué errores evitar y cómo debe leerse.
Reglas responsive
Cómo se comporta en mobile, tablet y desktop.
Dependencias
Qué otros componentes usa internamente.
Eventos de tracking
Qué eventos conviene medir en producto.
32. Próximos entregables UX recomendados
sitemap detallado
user flows principales
wireframes low fidelity
design system base reutilizando Loopdev
pantallas high fidelity de módulos prioritarios
prototipo clickable de Dashboard + Positions + Strategies + Risk

32. Decisiones cerradas para arrancar
Nombre de trabajo
Loopdev Trade
Estilo visual
Dark premium dashboard
Stack de front esperado
React / Next.js
Base de experiencia
Control, trazabilidad, riesgo visible y claridad operativa
Reutilización Loopdev
Sí, con adaptación al contexto financiero y de trading automatizado
