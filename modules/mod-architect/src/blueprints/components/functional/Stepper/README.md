
# Stepper

**Description:** A horizontal workflow indicator that guides users through a multi-step process. It visualizes progress using a connected track and atomic step indicators.

## 🚀 Usage

```tsx
import { Stepper } from './index';

const steps = [
  { id: '1', label: 'Account', content: <div>Account Form</div> },
  { id: '2', label: 'Details', content: <div>Details Form</div> },
  { id: '3', label: 'Review', content: <div>Review Summary</div> }
];

<Stepper steps={steps} onComplete={() => console.log('Done')} />
```

## ⚙️ API & Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepItem[]` | `DEFAULT_STEPS` | Array of step objects. |
| `initialStep` | `number` | `0` | Starting index. |
| `showControls` | `boolean` | `true` | Whether to render Next/Prev buttons. |
| `onComplete` | `() => void` | - | Callback when "Finish" is clicked on the last step. |

### Type Definition: StepItem
```typescript
interface StepItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  content?: React.ReactNode;
}
```

## 🧠 Logic (useStepper)

Business logic is isolated in `useStepper.ts`.

**State:**
*   `currentStep`: Number. Tracks current index.
*   `progressPercentage`: Calculated percentage for the background bar width.

**Methods:**
*   `next()`, `prev()`, `goTo(index)`: Navigation helpers with boundary checks.
*   `isComplete(index)`: Boolean helper for UI styling.

## 🧩 Atomic UI (components.tsx)

*   `StepperContainer`: Layout wrapper.
*   `ProgressBar`: Background track + dynamic foreground fill.
*   `StepIndicator`: The interactive circle. Handles 3 visual states (Pending, Active, Complete) using Design System tokens.
*   `StepperControls`: Standard footer with Back/Continue buttons.

## 🛡️ Enterprise Standards

*   **Keyboard Navigation:** Indicators are interactive/focusable (`tabIndex="0"`).
*   **Theming:** Strict usage of `primary` and `slate` tokens with dark mode support.
*   **Flexibility:** Accepts custom content per step.
