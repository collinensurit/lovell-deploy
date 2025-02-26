import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
})

export const logging = {
  info: (message: string, meta?: Record<string, unknown>) => {
    logger.info(message, meta)
  },

  error: (message: string, error?: Error, meta?: Record<string, unknown>) => {
    logger.error(message, {
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

  warn: (message: string, meta?: Record<string, unknown>) => {
    logger.warn(message, meta)
  },

  debug: (message: string, meta?: Record<string, unknown>) => {
    logger.debug(message, meta)
  },
}
