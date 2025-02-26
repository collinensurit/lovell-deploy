/**
 * Validates if a string is valid JSON
 * 
 * @param value - The string to validate
 * @returns Whether the string can be parsed as JSON
 */
export function isValidJSON(value: string): boolean {
  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}
