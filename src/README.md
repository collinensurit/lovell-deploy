# Source Directory

This directory contains the core application code.

## Directory Structure

```
src/
├── components/       # React components
├── constants/        # Application constants
├── hooks/           # Custom React hooks
├── pages/           # Next.js pages
├── styles/          # Global styles and themes
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── validators/      # Schema validation
```

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
