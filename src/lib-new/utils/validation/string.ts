/**
 * Validates if a string is a valid email address
 * 
 * @param value - The string to validate
 * @returns Whether the string is a valid email
 */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/**
 * Validates if a string is a strong password
 * Requires minimum length, uppercase, lowercase, numbers, and special characters
 * 
 * @param value - The string to validate
 * @returns Whether the string is a strong password
 */
export function isStrongPassword(value: string): boolean {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(value)
  const hasLowerCase = /[a-z]/.test(value)
  const hasNumbers = /\d/.test(value)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)

  return (
    value.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  )
}

/**
 * Sanitizes a string by removing potentially dangerous characters
 * 
 * @param value - The string to sanitize
 * @returns The sanitized string
 */
export function sanitizeString(value: string): string {
  return value.trim().replace(/[<>]/g, '')
}

/**
 * Normalizes a string by converting to lowercase, removing diacritics, and trimming
 * 
 * @param value - The string to normalize
 * @returns The normalized string
 */
export function normalizeString(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/**
 * Converts a string to a URL-friendly slug
 * 
 * @param value - The string to slugify
 * @returns The slugified string
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
