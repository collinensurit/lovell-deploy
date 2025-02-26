/**
 * Validates if a string is a valid URL
 * 
 * @param value - The string to validate
 * @returns Whether the string is a valid URL
 */
export function validateUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}
