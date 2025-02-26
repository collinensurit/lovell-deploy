# Lib-New Directory

This directory contains the consolidated application libraries, utilities, and hooks that were previously spread across multiple directories.

## Directory Structure

```
lib-new/
├── context/        # React context providers
│   └── README.md   # Documentation for contexts
├── hooks/          # React hooks
│   ├── __tests__/  # Hook tests
│   └── README.md   # Documentation for hooks
└── utils/          # Utility functions
    ├── api/        # API interaction utilities
    ├── auth/       # Authentication utilities
    ├── date/       # Date formatting utilities
    ├── file/       # File operation utilities
    ├── string/     # String manipulation utilities
    ├── validation/ # Validation utilities
    └── README.md   # Documentation for utilities
```

## Purpose

This directory is part of a codebase reorganization effort to:

1. Consolidate similar functionality
2. Improve code organization and findability
3. Reduce duplication
4. Establish consistent patterns
5. Improve maintainability

## Naming and Organization

All code in this directory follows these patterns:

1. **Comprehensive TypeScript typing**
2. **Thorough JSDoc documentation**
3. **Clean separation of concerns**
4. **Singleton patterns** where appropriate for global state
5. **React hooks** for component integration
6. **Clear, consistent naming conventions**

## Migration from Old Structure

This directory replaces:

1. `/src/lib/` - Core libraries
2. `/src/utils/` - General utilities
3. `/src/hooks/` and `/src/hooks-new/` - React hooks

The migration is ongoing. See individual subdirectory README files for specific migration guidelines.

## Usage Guidelines

1. **When adding new code:**
   - Place it in the appropriate subdirectory
   - Follow established patterns for that subdirectory
   - Add documentation and tests

2. **When using existing code:**
   - Import from the specific subdirectory
   - Use the main exports where available (e.g., `utils/index.ts`)

## Example Usage

```typescript
// Importing hooks
import { useFileUpload, useFileMetadata } from '@/lib-new/hooks'

// Importing utilities
import { validateFile, uploadFile } from '@/lib-new/utils/file'

// Importing context
import { FileUploadProvider } from '@/lib-new/context/file-upload-context'
```
