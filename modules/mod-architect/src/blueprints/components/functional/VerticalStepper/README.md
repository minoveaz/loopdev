
# Vertical Stepper

**Description:** A vertical progress indicator useful for complex setups, wizards, or timelines. It displays a list of steps with their state (Completed, Active, Pending) and supports arbitrary content injection for the active step.

## 🚀 Usage

```tsx
import { VerticalStepper } from './index';

const steps = [
  { id: '1', title: 'Setup', description: 'Init project' },
  { id: '2', title: 'Config', description: 'Set variables', content: <MyForm /> },
  { id: '3', title: 'Done', description: 'Review' }
];

<VerticalStepper steps={steps} initialStep={1} />
```

## ⚙️ API & Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `VerticalStep[]` | `PROJECT_SETUP_STEPS` | Array of step objects. |
| `initialStep` | `number` | `1` | Index of the initially active step. |
| `className` | `string` | `""` | Container class names. |
| `onStepClick` | `(index: number) => void` | - | Callback when a step is clicked. |

### Type Definition: VerticalStep
```typescript
interface VerticalStep {
  id: string;
  title: string;
  description?: string;
  content?: React.ReactNode; // Rendered only when active
}
```

## 🧠 Logic (useVerticalStepper)

*   **State:** Tracks `activeStep`.
*   **Helper:** `getStepState(index)` returns `'completed' | 'active' | 'pending'` based on the current index relative to the active step.

## 🧩 Atomic UI (components.tsx)

*   **StepRow:** Flex container aligning rail and content.
*   **StepLeftRail:** Holds the circle and vertical connector line.
*   **StepIndicator:** Visual circle. Handles 3 generic states.
*   **StepContentWrapper:** The right-side text. It handles the `pb-8` spacing to ensure the vertical line extends correctly to the next step's start.

## 🎨 Visual Design

Matches the "Project Setup" card:
*   **Completed:** Solid Primary.
*   **Active:** White with Primary Border.
*   **Pending:** Slate Gray.
*   **Connectors:** Dynamic coloring (Primary if traversing completed steps).
