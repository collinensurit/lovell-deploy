# Utils Directory

This directory contains organized utility functions grouped by domain.

## Directory Structure

```
utils/
├── analytics.ts         # Analytics tracking utilities
├── api/                 # API interaction utilities
├── auth/                # Authentication utilities
├── cache.ts             # Caching utilities
├── clipboard.ts         # Clipboard interaction utilities
├── cn.ts                # Class name utilities
├── color.ts             # Color manipulation utilities
├── date/                # Date formatting and validation
├── error-handling.ts    # Error handling utilities
├── events.ts            # Event system
├── file/                # File operation utilities
├── form.ts              # Form handling utilities
├── format/              # Formatting utilities (currency, etc.)
├── keyboard.ts          # Keyboard shortcut utilities
├── logging.ts           # Logging utilities
├── media-query.ts       # Media query utilities
├── metadata.ts          # Metadata utilities
├── notification.ts      # Notification system
├── responsive.ts        # Responsive design utilities
├── search.ts            # Search and filtering utilities
├── storage.ts           # Storage utilities
├── string/              # String manipulation utilities
├── theme.ts             # Theme management utilities
├── url.ts               # URL handling utilities
└── validation/          # Validation utilities
```

## Migrating from Old Structure

This directory is part of the new, organized structure that replaces:

1. `/src/utils/` - General utilities
2. `/src/lib/utils/` - Library-specific utilities

When migrating code:

1. Place utilities in domain-specific files or subdirectories
2. Update imports to reference the new location
3. Add proper TypeScript typing and documentation
4. Add unit tests in corresponding `__tests__` directories

## Example Migration

```typescript
// Old import
import { formatDate } from '@/utils/date'

// New import
import { formatDate } from '@/lib-new/utils/date'
```

## Documentation

Each utility or group of utilities should have:

1. Clear TypeScript types
2. JSDoc comments
3. Examples of usage
4. Unit tests

See the `/file/` directory for an example of well-organized utilities with proper documentation and tests.
