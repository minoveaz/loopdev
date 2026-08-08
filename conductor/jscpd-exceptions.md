# Matriz de excepciones jscpd

**Revisión:** 2026-08-07  
**Comando:** `jscpd --config .jscpd.json --reporters json`  
**Resultado:** 24 clones, 291 líneas duplicadas (0,68%), 1.736 tokens (0,78%) y 0 clones nuevos.

Esta matriz documenta los clones detectados con el umbral vigente (`minLines: 8`, `minTokens: 50`). Ninguno debe extraerse por similitud sintáctica: cada caso conserva diferencias de dominio, contrato o ciclo operativo. Se revisará cuando cambie el disparador indicado.

| # | Archivos y líneas | Motivo de excepción | Revisar cuando |
|---|---|---|---|
| 1 | `health-os/layout.tsx:1` ↔ `sales-crm/layout.tsx:1` | Shells de suites con navegación, providers y composición propios. | Dos suites compartan un contrato real de shell. |
| 2 | `health-os/layout.tsx:121` ↔ `quant-ops/layout.tsx:34` | Cabeceras con identidad y acciones de dominio distintas. | Se unifique la configuración de cabecera de suites. |
| 3 | `health-os/layout.tsx:124` ↔ `sales-crm/layout.tsx:150` | Bloques visuales similares con navegación clínica y comercial diferente. | Exista una API de navegación común. |
| 4 | `health-os/layout.tsx:148` ↔ `sales-crm/layout.tsx:172` | Elementos de navegación definidos por modelos de suite distintos. | Las suites adopten el mismo modelo de navegación. |
| 5 | `health-os/layout.tsx:166` ↔ `quant-ops/layout.tsx:49` | Indicadores operativos con señales y acciones diferentes. | Se comparta un contrato de indicadores. |
| 6 | `health-os/layout.tsx:186` ↔ `quant-ops/layout.tsx:70` | Guards y permisos de suites diferentes. | Se generalice el layout de suite sin perder permisos explícitos. |
| 7 | `health-os/layout.tsx:186` ↔ `sales-crm/layout.tsx:209` | Guards con permisos de dominio diferentes. | El guard sea el único fragmento repetido tras refactorizar layouts. |
| 8 | `health-os/layout.tsx:198` ↔ `quant-ops/layout.tsx:82` | Contenido contextual de Health y Quant no intercambiable. | Se modele una superficie contextual común. |
| 9 | `health-os/layout.tsx:198` ↔ `sales-crm/layout.tsx:221` | Contenido contextual clínico y CRM con props distintas. | Las props y datos se vuelvan idénticos por diseño. |
| 10 | `health-os/layout.tsx:238` ↔ `quant-ops/layout.tsx:126` | Pie y estado de suite con metadatos distintos. | Se estabilice un contrato de pie de suite. |
| 11 | `ClosedTradesTable.tsx:49` ↔ `OrdersTable.tsx:40` | Columnas de operación y de trades son modelos distintos. | Las tablas compartan columnas y acciones, no solo estructura. |
| 12 | `ClosedTradesTable.tsx:95` ↔ `OrdersTable.tsx:79` | Estados de tabla parecidos para entidades distintas. | Se introduzca un estado de tabla con semántica común. |
| 13 | `quant-ops/layout.tsx:92` ↔ `sales-crm/layout.tsx:231` | Layouts de suite con módulos y navegación no equivalentes. | Cambie el contrato del shell común. |
| 14 | `CertificationStamp/index.tsx:47` ↔ `InfraStamp/index.tsx:57` | Sellos representan certificación e infraestructura, no una misma métrica. | Se defina un modelo semántico único de sello. |
| 15 | `CertificationStamp/index.tsx:70` ↔ `InfraStamp/index.tsx:80` | Variantes visuales ancladas a estados de dominio diferentes. | Se comparta su API, tokens y estados. |
| 16 | `UserMenu/index.tsx:31` ↔ `QuickActionMenu/index.tsx:24` | Menú de identidad y lanzador de acciones tienen interacción distinta. | Compartan intención, accesibilidad y contrato de acciones. |
| 17 | `ScanningState.tsx:71` ↔ `WaitingState.tsx:71` | Estados de BotCard con transiciones operativas diferentes. | Los estados se conviertan en una única máquina de estados. |
| 18 | `deep_loss_analyser_v2.py:41` ↔ `loss_analyser.py:27` | Analizadores con objetivos y salida de diagnóstico distintos. | Se unifique el pipeline de análisis de pérdidas. |
| 19 | `fetch_latest_order.py:21` ↔ `trades_report.py:18` | Scripts de consulta puntual e informe periódico con ciclos distintos. | Compartan cliente, formato y ciclo de ejecución. |
| 20 | `aggressive_rsi.py:47` ↔ `hybrid_core.py:50` | Estrategias de trading independientes con parámetros y riesgo propios. | Se extraiga una primitiva de estrategia validada por backtests. |
| 21 | `aggressive_rsi.py:83` ↔ `hybrid_core.py:84` | Cálculo similar dentro de estrategias que deben evolucionar separadas. | Exista una regla de riesgo común comprobada. |
| 22 | `start_book_ingestor.py:10` ↔ `start_ingestor.py:9` | Ingestores para fuentes y arranques diferentes. | Ambos adopten el mismo protocolo de ingesta. |
| 23 | `start_book_ingestor.py:38` ↔ `start_ingestor.py:50` | Gestión de ciclo de vida específica de cada ingestor. | Se comparta el mismo worker y configuración. |
| 24 | `start_book_ingestor.py:52` ↔ `start_ingestor.py:64` | Manejo de arranque y reintentos con dependencias distintas. | Se normalicen sus reintentos y observabilidad. |

## Criterio de mantenimiento

- No se aumentará el umbral ni se ignorarán rutas para ocultar duplicación.
- Un clone deja de ser excepción solo si aparece un contrato semántico y una API compartida clara.
- Cualquier clone adicional o cambio en esta matriz se revisa en el PR que lo introduzca.
