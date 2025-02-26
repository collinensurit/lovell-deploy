# File Explorer Component

## ⚠️ DEPRECATED ⚠️

This directory contains a legacy file explorer component that has been replaced by the newer implementation in `/src/components/ui/file/file-explorer/`.

## Migration Notice

All code that imports from this directory should be updated to use the newer component:

```jsx
// Old import
import { FileExplorer } from '@/components/ui/file-explorer'

// New import
import { FileExplorer } from '@/components/ui/file/file-explorer'
```

The new implementation provides additional features like:
- Directory selection events
- File path support
- File size and modification time display
- Improved styling and icons

This directory will be removed in future updates.
