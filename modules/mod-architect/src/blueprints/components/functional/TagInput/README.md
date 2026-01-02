
# TagInput (Multi-Value Input)

**Description:** A versatile input component for managing lists of values (tags). Supports keyboard interaction, validation hooks, and visual customization.

## 🚀 Usage

```tsx
import { TagInput } from './index';

<TagInput 
  label="Skills" 
  placeholder="Add a skill..." 
  initialTags={[{ id: '1', label: 'React', variant: 'primary' }]}
/>
```

## ✨ Features

*   **Keyboard Navigation:** `Enter` to add, `Backspace` to remove the last item.
*   **Duplicate Prevention:** Automatically blocks duplicate entries (case-insensitive).
*   **Limit Enforcement:** respects `maxTags` prop to prevent overflow.
*   **Visual Variants:** Supports `primary` and `warning` tag styles.

## ⚙️ API & Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialTags` | `Tag[]` | `DEFAULT_TAGS` | Initial state of the list. |
| `label` | `string` | `"Team Members"` | Label text above the input. |
| `placeholder` | `string` | `"Add member..."` | Placeholder text when input is empty. |
| `maxTags` | `number` | `10` | Maximum number of allowable tags. |
| `onTagsChange` | `(tags: Tag[]) => void` | - | Callback fired when tags are added or removed. |

### Type Definition: Tag
```typescript
interface Tag {
  id: string;
  label: string;
  variant?: 'primary' | 'warning';
}
```

## 🧠 Logic (useTagInput)

Business logic is isolated in `useTagInput.ts`.

**State:**
*   `tags`: Array of current tag objects.
*   `inputValue`: Current text in the input field.

**Handlers:**
*   `addTag(label)`: Validates input (not empty, unique, under limit) and adds to state.
*   `removeTag(id)`: Removes item by ID.
*   `handleKeyDown`: Manages Enter/Backspace behavior.

## 🧩 Atomic UI (components.tsx)

*   `InputWrapper`: Container with focus ring styling.
*   `TagItem`: Renders individual pills with remove buttons.
*   `ApiInfo`: Display component for documentation purposes (from original design).
