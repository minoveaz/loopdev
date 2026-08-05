# User Histories — KanbanBoard Component

## US-1: High-Density Reusable Kanban Layout
**As a** SaaS User  
**I want to** view a set of task/lead cards organized in columns representing stages  
**So that** I can get an instant high-density status breakdown of all items in the workspace.

### Acceptance Criteria:
* Columns must be rendered horizontally with a responsive layout (`overflow-x-auto`).
* Column headers show titles and card counts inside curly braces ` {count} `.
* If a metric label is supplied (e.g. money sum), it must render inside curly braces ` {sum} ` using a monospace font.
* Fits inside the standard Canvas layout of the `ModuleWorkspace`.

---

## US-2: HTML5 Drag & Drop Interactions
**As a** SaaS User  
**I want to** drag card items and drop them into a different stage column  
**So that** I can quickly transition tasks, leads, or states.

### Acceptance Criteria:
* Cards are draggable and dim during drag operations (`opacity-50`).
* Hovering a card over a column adds an amber active drag indicator border (`border-accent/40`) with a subtle glow.
* Dropping a card fires the `onCardDrop` callback with the item ID and target column ID.

---

## Bloque 0 ADN de Composición
1. **Trinidad Cromática:** 
   - Column frames use structural technical lines (`border-border-technical/30`).
   - Active hover target uses amber/yellow highlighting (`border-accent/40 shadow-[0_0_15px_rgba(245,158,11,0.08)]`).
2. **Sintaxis `{ }`:**
   - Headers and metrics must wrap variables in curly braces: `{count}`, `{valueLabel}`.
3. **Technical Canvas:**
   - Column body displays a semi-transparent panel with a subtle backdrop filter (`backdrop-blur-sm`).
4. **Surface Soul:**
   - Cards use elevated surfaces with glass borders (`bg-white/5 border-white/5 hover:border-white/10`).
