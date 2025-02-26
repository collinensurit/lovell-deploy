# Hooks Directory

## ⚠️ TRANSITIONING ⚠️

This directory contains React hooks that are being migrated to the new `/src/lib-new/hooks/` directory.

## Migration Plan

1. New hooks should be added to `/src/lib-new/hooks/`
2. Existing hooks will be gradually migrated to `/src/lib-new/hooks/`
3. Imports will be updated across the codebase
4. Once all hooks have been migrated, this directory will be deprecated

## Example Migration

```typescript
// Old import
import { useFeature } from '@/hooks/use-feature'

// New import
import { useFeature } from '@/lib-new/hooks/use-feature'
```

Please add new hooks to `/src/lib-new/hooks/` instead of this directory.
