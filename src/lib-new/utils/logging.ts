'use client'

/**
 * Define a type-safe logging interface
 */
interface Logger {
  debug: (message: string, ...meta: any[]) => void
  info: (message: string, ...meta: any[]) => void
  warn: (message: string, ...meta: any[]) => void
  error: (message: string, ...meta: any[]) => void
}

/**
 * A simple client-side logger that uses console
 */
const clientLogger: Logger = {
  debug: (message: string, ...meta: any[]) => {
    console.debug(message, ...meta)
  },
  info: (message: string, ...meta: any[]) => {
    console.info(message, ...meta)
  },
  warn: (message: string, ...meta: any[]) => {
    console.warn(message, ...meta)
  },
  error: (message: string, ...meta: any[]) => {
    console.error(message, ...meta)
  }
}

/**
 * Application logging utility with standardized logging methods
 */
export const logging = {
  /**
   * Log an informational message
   * 
   * @param message - The message to log
   * @param meta - Optional metadata to include
   */
  info: (message: string, ...meta: any[]) => {
    clientLogger.info(message, ...meta)
  },

  /**
   * Log an error with additional error details
   * 
   * @param message - The error message
   * @param error - Optional Error object
   * @param meta - Optional metadata to include
   */
  error: (message: string, error?: Error, ...meta: any[]) => {
    clientLogger.error(message, {
      ...meta,
      error: error
        ? {
            message: error.message,
            name: error.name,
            stack: error.stack,
          }
        : undefined,
    })
  },

  /**
   * Log a warning message
   * 
   * @param message - The warning message
   * @param meta - Optional metadata to include
   */
  warn: (message: string, ...meta: any[]) => {
    clientLogger.warn(message, ...meta)
  },

  /**
   * Log a debug message
   * 
   * @param message - The debug message
   * @param meta - Optional metadata to include
   */
  debug: (message: string, ...meta: any[]) => {
    clientLogger.debug(message, ...meta)
  },
}

// Export a client-safe logger
export const logger = clientLogger
