/**
 * Capitalizes the first letter of a string
 * 
 * @param value - The string to capitalize
 * @returns The capitalized string
 */
export function capitalize(value: string): string {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 * 
 * @param value - The string to truncate
 * @param length - Maximum length before truncation
 * @param ellipsis - The ellipsis string to append (default "...")
 * @returns The truncated string
 */
export function truncate(
  value: string, 
  length: number, 
  ellipsis = '...'
): string {
  if (!value) return value
  if (value.length <= length) return value
  
  return value.slice(0, length) + ellipsis
}

/**
 * Formats a number with thousands separators
 * 
 * @param value - The number to format
 * @param locale - The locale to use for formatting (default "en-US")
 * @returns The formatted number string
 */
export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Formats a file size in bytes to a human-readable string
 * 
 * @param bytes - The size in bytes
 * @param decimals - Number of decimal places (default 2)
 * @returns The formatted file size string
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}
