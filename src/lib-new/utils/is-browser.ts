/**
 * Utility to safely check if code is running in a browser environment.
 * Use this instead of directly checking for window/document to prevent
 * issues during server-side rendering.
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}
