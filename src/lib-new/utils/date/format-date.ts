import { format, formatDistance, formatRelative, parseISO } from 'date-fns'

/**
 * Formats a date using the specified format string
 *
 * @param date - The date to format (string or Date object)
 * @param formatString - The format string to use (defaults to 'PPP')
 * @returns The formatted date string
 */
export function formatDate(date: string | Date, formatString = 'PPP'): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return format(parsedDate, formatString)
}

/**
 * Formats a date as a relative time (e.g., "2 days ago")
 *
 * @param date - The date to format (string or Date object)
 * @returns The formatted relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(parsedDate, new Date(), { addSuffix: true })
}

/**
 * Formats a date relative to the current date (e.g., "yesterday at 2:30 PM")
 *
 * @param date - The date to format (string or Date object)
 * @returns The formatted relative date string
 */
export function formatRelativeDate(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return formatRelative(parsedDate, new Date())
}

/**
 * Formats a date as a time ago string with custom short format (e.g., "5m ago")
 *
 * @param date - The date to format (string or Date object)
 * @returns The formatted time ago string
 */
export function formatTimeAgo(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  const seconds = Math.floor(
    (new Date().getTime() - parsedDate.getTime()) / 1000
  )

  if (seconds < 60) {
    return 'just now'
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days}d ago`
  }

  return formatDate(parsedDate, 'PP')
}
