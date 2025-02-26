# Utils Directory

## ⚠️ DEPRECATED ⚠️

This directory is deprecated and being replaced by the more organized structure in `/src/lib-new/utils/`.

## Migration Plan

1. Utilities in this directory are being moved to appropriate subdirectories in `/src/lib-new/utils/`
2. Imports are being updated across the codebase
3. Once all utilities have been migrated, this directory will be removed

## Current Status

The following utilities have been migrated:
- File operations → `/src/lib-new/utils/file/`
- Date formatting → `/src/lib-new/utils/date/`
- String manipulation → `/src/lib-new/utils/string/`

## Example Migration

```typescript
// Old import
import { validateDate } from '@/utils/validation'

// New import
import { validateDate } from '@/lib-new/utils/validation'
```

Please do not add new utilities to this directory. Instead, add them to the appropriate subdirectory in `/src/lib-new/utils/`.
