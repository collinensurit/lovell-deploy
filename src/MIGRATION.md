# Code Migration Plan

This document outlines the plan for migrating code to the new directory structure.

## Current Status

The codebase is in a transitional state with code spread across multiple directory structures:

1. Original structure:
   - `/src/utils/` - General utilities
   - `/src/hooks/` - React hooks
   - `/src/lib/` - Core libraries and utilities

2. New consolidated structure:
   - `/src/lib-new/utils/` - Domain-organized utilities
   - `/src/lib-new/hooks/` - React hooks
   - `/src/lib-new/context/` - React context providers

## Migration Timeline

### Phase 1: Consolidation (Current Phase)
- ✅ Create the new directory structure
- ✅ Add documentation for each directory
- ✅ Establish patterns and conventions
- ✅ Begin migrating utilities and hooks

### Phase 2: Implementation (In Progress)
- 🔄 Move all file-related utilities to `/src/lib-new/utils/file/`
- 🔄 Move all file-related hooks to `/src/lib-new/hooks/`
- 🔄 Consolidate UI components in `/src/components/ui/file/`
- 🔄 Update imports to reference new locations

### Phase 3: Cleanup (Upcoming)
- ⏳ Deprecate old directories with notices
- ⏳ Monitor and fix any broken imports
- ⏳ Remove duplicate implementations
- ⏳ Rename `/src/lib-new/` to `/src/lib/`

## Migration Guidelines

### For Developers

When working with the codebase during migration:

1. **New code** should always be added to the new structure
2. **Modified code** should be moved to the new structure when possible
3. **Imports** should be updated to reference the new locations
4. **Documentation** should be added for all new or migrated code

### Migration Checklist

For each component or utility being migrated:

1. ✓ Move the implementation to the new location
2. ✓ Update the file to follow established patterns
3. ✓ Add or update documentation
4. ✓ Add or update tests
5. ✓ Update imports in all files that use the component
6. ✓ Mark the old implementation as deprecated

## Directory Mapping

| Old Location | New Location |
|--------------|--------------|
| `/src/utils/` | `/src/lib-new/utils/` |
| `/src/hooks/` | `/src/lib-new/hooks/` |
| `/src/hooks-new/` | `/src/lib-new/hooks/` |
| `/src/lib/hooks/` | `/src/lib-new/hooks/` |
| `/src/components/ui/file-preview/` | `/src/components/ui/file/file-preview/` |
| `/src/components/ui/file-explorer/` | `/src/components/ui/file/file-explorer/` |

## Testing During Migration

During the migration, it's important to:

1. Run the full test suite after each migration
2. Manually test affected features
3. Watch for console errors related to missing imports

## Questions?

If you have questions about the migration process or where specific code should be placed, refer to the README.md files in each directory or contact the repository owner.
