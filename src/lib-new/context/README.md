# Context Directory

This directory contains React context providers that manage global application state.

## Current Contexts

### File Upload Context
- `file-upload-context.tsx` - Context for managing global file upload settings and configuration

## Adding New Contexts

When adding new context providers:

1. Create a new file with the format `[feature-name]-context.tsx`
2. Export both the context and a provider component
3. Include a hook for accessing the context (e.g., `useFileUploadContext`)
4. Add appropriate TypeScript types and JSDoc comments

## Best Practices

1. **Singleton Pattern** - Contexts should follow the singleton pattern for global state
2. **TypeScript Support** - All contexts should be fully typed
3. **Default Values** - Provide sensible default values for context
4. **Custom Hooks** - Create custom hooks for accessing context to improve type safety
5. **Documentation** - Include JSDoc comments explaining the context's purpose and usage

## Example Usage

```tsx
// Context definition
export const MyFeatureContext = React.createContext<MyFeatureContextType>({
  // Default values
});

export function MyFeatureProvider({ children }: { children: React.ReactNode }) {
  // State and logic
  const value = { /* context value */ };
  
  return (
    <MyFeatureContext.Provider value={value}>
      {children}
    </MyFeatureContext.Provider>
  );
}

// Custom hook for accessing context
export function useMyFeature() {
  const context = React.useContext(MyFeatureContext);
  
  if (context === undefined) {
    throw new Error('useMyFeature must be used within a MyFeatureProvider');
  }
  
  return context;
}
```

## Integration with Other Utilities

Contexts in this directory should work closely with:

1. Hooks in `/src/lib-new/hooks/`
2. Utilities in `/src/lib-new/utils/`
3. UI components that consume the context

This integration helps create a cohesive architecture for managing global state.
