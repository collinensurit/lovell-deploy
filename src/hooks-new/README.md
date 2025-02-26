# Hooks-New Directory

## ⚠️ DEPRECATED ⚠️

This directory is part of a transitional structure and is deprecated. 

All hooks should now be added to the `/src/lib-new/hooks/` directory.

## Migration Plan

1. Move existing hooks from this directory to `/src/lib-new/hooks/`
2. Update imports in components to reference the new location
3. Once all hooks have been migrated, this directory will be removed

## Example Migration

```typescript
// Old import
import { useFeature } from '@/hooks-new/use-feature'

// New import
import { useFeature } from '@/lib-new/hooks/use-feature'
```

Please do not add new hooks to this directory.
