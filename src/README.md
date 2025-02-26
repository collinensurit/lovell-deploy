# Source Directory

This directory contains the core application code.

## Directory Structure

```
src/
├── components/       # React components
├── constants/        # Application constants
├── hooks/           # Custom React hooks
├── lib/             # Core libraries and utilities
├── lib-new/         # Consolidated libraries, hooks, and utilities
│   ├── context/     # React contexts and providers
│   ├── hooks/       # Custom React hooks
│   └── utils/       # Organized utility functions by domain
├── pages/           # Next.js pages
├── styles/          # Global styles and themes
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── validators/      # Schema validation
```

## Directory Structure Migration

The project is currently undergoing a directory structure reorganization:

### Old Structure (Being Phased Out)
```
src/
├── hooks/           # Custom React hooks
├── lib/             # Core libraries and utilities
├── utils/           # Utility functions
```

### New Structure (Recommended)
```
src/
├── lib-new/         # Consolidated libraries, hooks, and utilities
│   ├── context/     # React contexts and providers
│   ├── hooks/       # Custom React hooks
│   └── utils/       # Organized utility functions by domain
```

### Migration Guidelines

1. **New code** should be added to the `/lib-new/` structure
2. **Existing code** should be gradually migrated from the old directories
3. All utilities from `/utils/` are being moved to appropriate subdirectories in `/lib-new/utils/`
4. All hooks should be consolidated in `/lib-new/hooks/`

### Consolidated Directories
- File-related UI components: `/components/ui/file/`
- File utilities: `/lib-new/utils/file/`
- File-related hooks: `/lib-new/hooks/`

These changes will improve organization, reduce duplication, and make the codebase more maintainable.

## Guidelines

### Components
- Use functional components with TypeScript
- Follow atomic design principles
- Include prop types and documentation
- Write unit tests

### Constants
- Use uppercase for constant names
- Group related constants
- Use TypeScript const assertions
- Document any magic numbers

### Hooks
- Follow React Hooks guidelines
- Include TypeScript types
- Add JSDoc documentation
- Write unit tests

### Pages
- Follow Next.js conventions
- Include SEO metadata
- Handle loading and error states
- Add analytics events

### Styles
- Use CSS modules or styled-components
- Follow design system
- Support dark mode
- Consider accessibility

### Types
- Write comprehensive types
- Use TypeScript features
- Document complex types
- Keep types close to usage

### Utils
- Write pure functions
- Include error handling
- Add TypeScript types
- Write unit tests

### Validators
- Use Zod for validation
- Include error messages
- Handle edge cases
- Document schemas
