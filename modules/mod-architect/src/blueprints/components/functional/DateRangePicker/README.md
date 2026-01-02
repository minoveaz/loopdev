
# Date Range Picker

**Description:** A comprehensive calendar interface for selecting a start and end date range. Features a custom single-month view with logic to handle range selection states.

## 🚀 Usage

```tsx
import { DateRangePicker } from './index';

<DateRangePicker 
  initialStartDate={new Date()}
  onRangeChange={(start, end) => console.log(start, end)}
/>
```

## ⚙️ API & Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialStartDate` | `Date` | `null` | Pre-selected start date. |
| `initialEndDate` | `Date` | `null` | Pre-selected end date. |
| `onRangeChange` | `(start, end) => void` | - | Callback fired when selection changes. |
| `className` | `string` | - | Additional CSS classes. |

## 🧠 Logic (useDateRangePicker)

Business logic is isolated in `useDateRangePicker.ts`.

**State:**
*   `startDate` / `endDate`: Tracks the selected range.
*   `viewDate`: Tracks the currently visible month in the calendar grid.

**Methods:**
*   `handleDateClick(day)`: Intelligent selection logic:
    *   If no dates selected: Sets Start.
    *   If Start exists but no End: Sets End (if after Start), or resets Start (if before).
    *   If range is complete: Resets to a new Start date.
*   `changeMonth(offset)`: Navigates calendar view.

## 🧩 Atomic UI (components.tsx)

*   `DateInputDisplay`: Visual read-only inputs showing selected values.
*   `CalendarHeader`: Month navigation controls.
*   `CalendarGrid`: Renders the days. Handles complex styling for:
    *   **Start/End Caps:** Rounded corners on range edges.
    *   **Range Span:** Continuous background highlight between start and end.
    *   **Today Indicator:** Specific dot for current day.

## 🛡️ Enterprise Standards

*   **Formatting:** Uses consistent `Intl.DateTimeFormat` for localization-friendly display.
*   **Styles:** Strict adherence to design tokens (`primary` for selection, `surface` for backgrounds).
