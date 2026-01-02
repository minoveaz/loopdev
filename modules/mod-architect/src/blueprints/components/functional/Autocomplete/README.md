
# Autocomplete & Search

**Description:** A production-ready smart search input. It features real-time filtering, keyboard navigation, dynamic text highlighting, and rich result visualization (icons/types).

## 🚀 Usage

```tsx
import { Autocomplete } from './index';

<Autocomplete initialQuery="" className="w-full" />
```

## ✨ Features

*   **Real-time Filtering:** Filters results based on title and subtitle as you type.
*   **Keyboard Navigation:**
    *   `ArrowDown` / `ArrowUp`: Navigate through the result list.
    *   `Enter`: Select the currently highlighted item.
    *   `Escape`: Close the dropdown.
*   **Smart Highlighting:** Dynamically bolds the portion of the text that matches the search query.
*   **Rich Results:** Supports different entity types (Folder, File, Person) with specific icons and colors.
*   **Focus Management:** Automatically highlights the first result on type; syncs mouse hover with keyboard focus.

## ⚙️ API & Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `initialQuery` | `string` | No | Initial value for the input field. |
| `className` | `string` | No | Additional CSS classes for the container. |

## 🧠 Logic (useAutocomplete)

Business logic is isolated in `useAutocomplete.ts`.

**State:**
*   `query`: Current input value.
*   `isOpen`: Dropdown visibility state.
*   `activeId`: ID of the *selected* item (clicked or Enter pressed).
*   `highlightedIndex`: Index of the item currently focused via keyboard or mouse hover.
*   `filteredResults`: Array of items matching the query.

**Key Methods:**
*   `handleKeyDown`: Manages keyboard interactions (Arrows, Enter, Escape).
*   `handleInputChange`: Updates query, resets highlight index, opens dropdown.
*   `handleSelect`: Finalizes selection, updates query to match title, closes dropdown.

## 🧩 Atomic UI (components.tsx)

*   `AutocompleteContainer`: Main wrapper.
*   `SearchInput`: Handles `onChange`, `onFocus`, and `onKeyDown`.
*   `DropdownContainer`: Conditionally rendered list wrapper.
*   `ResultItem`: 
    *   Handles **Active State** (Selection).
    *   Handles **Highlighted State** (Keyboard focus/Hover).
    *   Uses `HighlightedText` helper to visually split string based on query.
*   `NoResults`: Visual feedback when filter returns empty.

## ⚠️ Integration Notes

*   **Data Source:** Currently uses `MOCK_RESULTS` in `index.tsx`. To use with an API, update `index.tsx` to accept a `results` prop or fetch data within the hook.
