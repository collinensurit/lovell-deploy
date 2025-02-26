# Hooks Directory

This directory contains all React hooks for the application, organized by functionality.

## Current Hooks

### File Hooks
- `use-file-metadata.ts` - Hook for extracting and managing file metadata
- `use-file-upload.ts` - Hook for handling file uploads with validation and progress tracking

## Adding New Hooks

When adding new hooks:

1. Create a new file with the format `use-[feature-name].ts`
2. Add appropriate TypeScript types and JSDoc comments
3. Add unit tests in the `__tests__` directory
4. Export the hook from `index.ts`

## Migration from Other Hook Directories

This directory is the consolidated location for all hooks in the application. Hooks are being migrated from:

1. `/src/hooks/` - Original hooks directory
2. `/src/hooks-new/` - Transitional hooks directory
3. `/src/lib/hooks/` - Library-specific hooks

When migrating hooks:

1. Move the hook implementation to this directory
2. Update imports across the codebase
3. Add or update unit tests
4. Update the export in `index.ts`

## Best Practices

1. **Keep hooks focused** - Each hook should have a single responsibility
2. **Use TypeScript** - All hooks should be fully typed
3. **Add documentation** - Include JSDoc comments explaining the hook's purpose and usage
4. **Write tests** - Each hook should have corresponding unit tests
5. **Prefer composition** - Compose complex hooks from smaller, reusable hooks

## Example

```typescript
/**
 * Hook for tracking window size
 * @returns Current window dimensions
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```
