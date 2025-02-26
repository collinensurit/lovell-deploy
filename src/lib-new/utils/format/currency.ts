/**
 * Format a number as currency
 * 
 * @param value - The number value to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  options: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' }
): string {
  return new Intl.NumberFormat('en-US', options).format(value)
}

/**
 * Format a number with specified number of decimal places
 * 
 * @param value - The number to format
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @param options - Additional Intl.NumberFormat options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  decimalPlaces = 2,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    ...options,
  }).format(value)
}

/**
 * Format a number as a percentage
 * 
 * @param value - The decimal value to format as percentage (e.g., 0.25 for 25%)
 * @param decimalPlaces - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatPercent(value: number, decimalPlaces = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value)
}

/**
 * Format a number with compact notation (e.g., 1.2K, 5.3M)
 * 
 * @param value - The number to format
 * @param maximumFractionDigits - Maximum fraction digits to show (default: 1)
 * @returns Formatted compact number string
 */
export function formatCompactNumber(
  value: number,
  maximumFractionDigits = 1
): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits,
  }).format(value)
}

/**
 * Parse a currency string back to a number
 * 
 * @param currencyString - The currency string to parse (e.g., "$1,234.56")
 * @returns Parsed number value
 */
export function parseCurrency(currencyString: string): number {
  // Remove currency symbols, commas, and other non-numeric characters except decimal point
  const numericString = currencyString.replace(/[^0-9.-]/g, '')
  return parseFloat(numericString)
}
