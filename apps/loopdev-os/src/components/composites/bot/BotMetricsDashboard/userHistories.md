# User Histories - BotMetricsDashboard Component

**Component**: BotMetricsDashboard  
**Category**: Composites / Bot  
**Scope**: Industrial real-time metrics monitoring  
**Status**: Production Ready  

---

## 🧬 Bloque 0: ADN de Composición (LOOPDEV OBLIGATORIO)

### 1. Trinidad Cromática
- **Azul (Estructura)**: Borders, primary text, gauge background
- **Amarillo (Actividad)**: Entry signal readiness indicators, warning states
- **Morado (IA/Innovación)**: Overbought zone, short entry signals

### 2. Sintaxis { }
- Metrics are presented in **technical brackets** via `font-mono`
- Cards act as **data containers** with clear boundaries
- Progress bars show **signal readiness as visual operators** (fill %)

### 3. Technical Canvas (Superficies)
- **Líneas** for structure: 0.5px borders on `border-technical`
- **Puntos** for IA context: Status indicator pulse animation
- Cards use `backdrop-blur-sm` para efecto glass

### 4. Surface Soul
- **Cristal estético**: `bg-surface-dark bg-opacity-50` with backdrop blur
- **Bordes técnicos**: `border-border-technical` consistent across all cards
- **Elevación visual**: Nested containers with subtle depth

---

## 📖 User Stories (Fase Básica: "Qué" y "Para Qué")

### US-1: Display Real-Time RSI Gauge
**AS A** trader monitoring the bot  
**I WANT** to see the current RSI value as a visual circular gauge  
**SO THAT** I can quickly identify if price is oversold, neutral, or overbought

**Acceptance Criteria**:
- [ ] Gauge renders with 0-100 scale
- [ ] Color changes based on RSI status (red/green/purple zones)
- [ ] Center displays numeric value with 1 decimal
- [ ] Zones clearly marked (oversold < 30, neutral 30-70, overbought > 70)
- [ ] Smooth animations when RSI changes
- [ ] Responsive sizing (sm/md/lg)

### US-2: Monitor SMA50 Relationship
**AS A** trader  
**I WANT** to see current price vs SMA50 and distance  
**SO THAT** I can understand trend direction and entry confirmation logic

**Acceptance Criteria**:
- [ ] SMA50 value displayed with current price
- [ ] Distance shown both in $ and %
- [ ] Visual indicator shows if price is above/below SMA50 (↑/↓)
- [ ] Responsive card layout

### US-3: Track Entry Signal Readiness
**AS A** trader waiting for an entry signal  
**I WANT** to see how close RSI is to triggering long/short entry  
**SO THAT** I can anticipate when the bot will enter a position

**Acceptance Criteria**:
- [ ] Two signal cards (LONG / SHORT)
- [ ] Shows required RSI level, current RSI, and gap
- [ ] Visual progress bar (0-100%) showing signal readiness
- [ ] Changes color when signal is ready (green for long, purple for short)
- [ ] Gap displayed as percentage
- [ ] Real-time updates

### US-4: View Position Preview
**AS A** a trader in extended view  
**I WANT** to see calculated TP/SL prices for both LONG and SHORT  
**SO THAT** I can understand the risk/reward before entry

**Acceptance Criteria**:
- [ ] Only visible when `showExtended={true}`
- [ ] Two position cards (LONG / SHORT)
- [ ] Entry price, TP (green), SL (red) clearly separated
- [ ] All prices with $ currency symbol
- [ ] ATR-based calculation (not hardcoded)

### US-5: Monitor Volatility Status
**AS A** trader  
**I WANT** to see ATR and volatility classification (low/normal/high)  
**SO THAT** I can adjust expectations for position sizing

**Acceptance Criteria**:
- [ ] ATR value displayed with precision (4 decimals)
- [ ] ATR shown as % of current price
- [ ] Status badge (low/normal/high) with appropriate color
- [ ] Real-time updates

### US-6: Real-Time Connection Status
**AS A** trader  
**I WANT** to know if the dashboard is getting live data (WebSocket) or polling  
**SO THAT** I can trust the freshness of metrics

**Acceptance Criteria**:
- [ ] Live indicator with pulsing green dot when WebSocket connected
- [ ] "Polling" indicator when fallback is active
- [ ] Timestamp showing when metrics were last updated
- [ ] Stale data warning if age > 10 seconds

### US-7: Handle Errors and Failures
**AS A** trader  
**I WANT** to see clear error messages if metrics can't be fetched  
**SO THAT** I can take appropriate action

**Acceptance Criteria**:
- [ ] Error state displays with red border
- [ ] Error message clearly explains the issue
- [ ] Retry button is available
- [ ] Loading state with skeleton while fetching
- [ ] Graceful fallback when WebSocket drops

---

## 🧪 User Stories (Fase Estrés: Puntos de Quiebre Técnicos)

### STRESS-1: Contenido Masivo (Textos Largos y Traducciones)
**GIVEN** bot name is very long ("My Ultra Long Trading Bot Name ABCDEF")  
**WHEN** BotMetricsDashboard renders  
**THEN** header should not overflow and text should truncate gracefully

**Test Cases**:
- [ ] 100+ character bot name doesn't break layout
- [ ] Translated labels (ES, FR, DE) don't cause reflow
- [ ] Multi-line bot name in mobile view

### STRESS-2: Contenedores Estrechos (Adaptabilidad Visual)
**GIVEN** viewport width is 320px (mobile phone)  
**WHEN** BotMetricsDashboard renders  
**THEN** all metrics should stack vertically and remain readable

**Test Cases**:
- [ ] Single column layout on mobile
- [ ] Cards don't shrink below 280px min-width
- [ ] Fonts scale appropriately (text-nano, text-micro)
- [ ] Touch targets are > 44px for accessibility

### STRESS-3: Contraste Extremo (WCAG 2.1 AA)
**GIVEN** user has set Light Mode OR Dark Mode  
**WHEN** all metrics and indicators render  
**THEN** text contrast ratio must be ≥ 4.5:1 (AA standard)

**Test Cases**:
- [ ] Primary text on `text-primary` token: AAA (7:1)
- [ ] Secondary text on `text-primary-light`: AA (4.5:1)
- [ ] Status indicators are distinguishable by shape (not color alone)
- [ ] Focus states have visible borders

### STRESS-4: Datos Inválidos o Edge Cases
**GIVEN** API returns NaN, Infinity, or null values  
**WHEN** metrics are displayed  
**THEN** component should render gracefully without crashes

**Test Cases**:
- [ ] NaN values display as "—"
- [ ] Infinity values display as "—"
- [ ] null/undefined metrics show loading skeleton
- [ ] Division by zero in gap calculations handled
- [ ] Stale timestamps show "Unknown"

### STRESS-5: Actualización Rápida de Datos (WebSocket Floods)
**GIVEN** metrics update every 100ms (10x normal rate)  
**WHEN** BotMetricsDashboard receives updates  
**THEN** component should throttle renders and not flicker

**Test Cases**:
- [ ] No more than 1 render per second
- [ ] Gauge animations stay smooth (no jitter)
- [ ] No memory leaks from rapid WebSocket messages

---

## 🎨 Fase Multitenancy: Adaptabilidad a 100+ Clientes

**Decision**: All metric parameters (RSI period, thresholds, SMA period, ATR multipliers) are fetched from `strategy_registry`, ensuring each client's config is automatically respected.

**Validation**:
- [ ] Component works with RSI periods 7-21 (parameter range)
- [ ] Oversold/Overbought thresholds 15-85 (any range)
- [ ] SMA periods 20-100 supported
- [ ] ATR multipliers 1.0-3.0 work correctly
- [ ] No hardcoded magic numbers anywhere in component code

---

## 🔍 Audit Checklist (Pre-Certification)

Before applying `CertificationStamp`, verify:

### Code Quality
- [ ] Zero hardcoded colors (all from design tokens)
- [ ] Zero hardcoded values (all from strategy_registry)
- [ ] Brain/Body pattern consistently applied
- [ ] TypeScript types complete (no `any`)
- [ ] All hooks properly memoized
- [ ] No console.errors in production build

### Visual Correctness
- [ ] Bloque 0 (4 pillars) correctly implemented
- [ ] Responsive at all breakpoints (320px, 768px, 1024px)
- [ ] Light/Dark modes render correctly
- [ ] WCAG 2.1 AA contrast validated
- [ ] Borders consistent (0.5px technical)

### Testing
- [ ] Vitest coverage > 80%
- [ ] All user stories have passing tests
- [ ] Stress tests pass (edge cases, stale data, errors)
- [ ] A11y tests pass (keyboard nav, screen reader)

### Documentation
- [ ] Storybook stories for all states
- [ ] userHistories.md complete
- [ ] InlineComments for complex logic
- [ ] Props documentation complete

### Performance
- [ ] Bundle size < 50KB (component + dependencies)
- [ ] Initial render < 200ms
- [ ] WebSocket reconnection < 5s
- [ ] No memory leaks (tested with Chrome DevTools)

---

## 📋 Notas de Implementación

- **Real-time**: REST initial load + WebSocket for updates
- **Fallback**: If WebSocket fails, automatic switch to REST polling
- **Reconnection**: Exponential backoff (max 5 attempts)
- **Validation**: metricsValidator.ts ensures data integrity
- **Formatting**: metricsFormatter.ts handles all numeric display

---

**Status**: Ready for UAT and Certification  
**Approval Date**: [TO BE FILLED AFTER AUDIT]  
**Certification Stamp**: [TO BE APPLIED POST-AUDIT]
