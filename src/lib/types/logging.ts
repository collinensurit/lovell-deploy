export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LogCategory =
  | 'http'
  | 'auth'
  | 'db'
  | 'cache'
  | 'api'
  | 'system'
  | 'monitoring'
  | 'security'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  category: LogCategory
  message: string
  metadata?: Record<string, unknown>
  error?: Error
}

export interface Logger {
  debug(
    category: LogCategory,
    message: string,
    metadata?: Record<string, unknown>
  ): void
  info(
    category: LogCategory,
    message: string,
    metadata?: Record<string, unknown>
  ): void
  warn(
    category: LogCategory,
    message: string,
    metadata?: Record<string, unknown>
  ): void
  error(
    category: LogCategory,
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>
  ): void
}
