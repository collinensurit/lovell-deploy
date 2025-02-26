import { parseISO } from 'date-fns'

/**
 * Checks if a string can be parsed into a valid date
 *
 * @param date - The date string to validate
 * @returns Whether the string represents a valid date
 */
export function isValidDate(date: string): boolean {
  const parsedDate = parseISO(date)
  return !isNaN(parsedDate.getTime())
}

/**
 * Gets a date range from the current date going back a specified number of days
 *
 * @param days - Number of days to go back
 * @returns Object containing start and end dates
 */
export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  return { start, end }
}
