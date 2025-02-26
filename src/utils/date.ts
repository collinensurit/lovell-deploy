import { format, formatDistance, formatRelative, parseISO } from 'date-fns'

export function formatDate(date: string | Date, formatString = 'PPP'): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return format(parsedDate, formatString)
}

export function formatRelativeTime(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(parsedDate, new Date(), { addSuffix: true })
}

export function formatRelativeDate(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return formatRelative(parsedDate, new Date())
}

export function isValidDate(date: string): boolean {
  const parsedDate = parseISO(date)
  return !isNaN(parsedDate.getTime())
}

export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  return { start, end }
}

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
