
# File Uploader

**Description:** A drag-and-drop file upload zone. Includes file validation (type, size), list management, and simulated progress states.

## 🚀 Usage

```tsx
import { FileUploader } from './index';

<FileUploader 
  maxSizeInBytes={5 * 1024 * 1024} 
  acceptedTypes={['image/png', 'application/pdf']}
  onUpload={(files) => console.log(files)}
/>
```

## ⚙️ API & Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onUpload` | `(files: File[]) => void` | - | Callback when files are added. |
| `maxSizeInBytes` | `number` | `5MB` | Max size per file. |
| `acceptedTypes` | `string[]` | `['image/*', 'pdf']` | Allowed MIME types. |
| `className` | `string` | - | Additional CSS classes. |

## 🧠 Logic (useFileUploader)

Business logic is isolated in `useFileUploader.ts`.

**State:**
*   `files`: Array of `FileRecord` objects (includes progress, status, raw File).
*   `isDragging`: Boolean for visual feedback during drag operations.

**Methods:**
*   `handleFiles(FileList)`: Validates size/type, creates records, and initiates simulated upload.
*   `simulateUpload(id)`: A mock async process that updates the progress bar.
*   `removeFile(id)`: Removes item from state.
*   `dragEvents`: Set of event handlers (`onDrop`, `onDragOver`, etc.).

## 🧩 Atomic UI (components.tsx)

*   `UploadDropZone`: Interactive area. Handles drag states (visual highlight) and click-to-browse.
*   `FileListItem`: Row component for each file. Displays:
    *   **Icon:** Dynamic icon based on file type (Image vs PDF vs Generic).
    *   **Progress Bar:** Shows upload status.
    *   **Actions:** Cancel/Delete button.

## 🛡️ Enterprise Standards

*   **Validation:** Strictly enforces file types and size limits before processing.
*   **Feedback:** Provides clear visual cues for drag-over, success, and progress.
*   **Accessibility:** Drop zone is keyboard accessible (`Enter`/`Space` to trigger file dialog).
