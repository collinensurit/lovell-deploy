import {
  init,
  captureException,
  captureMessage,
  setUser,
  setTag,
} from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

const SENTRY_DSN = process.env.SENTRY_DSN

export const initSentry = () => {
  if (SENTRY_DSN) {
    init({
      dsn: SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
    })
  }
}

export const monitoring = {
  setUser(id: string, email?: string, username?: string) {
    setUser({ id, email, username })
  },

  setTag(key: string, value: string) {
    setTag(key, value)
  },

  captureError(error: Error, context?: Record<string, unknown>) {
    captureException(error, { extra: context })
  },

  captureMessage(message: string, context?: Record<string, unknown>) {
    captureMessage(message, { extra: context })
  },
}
