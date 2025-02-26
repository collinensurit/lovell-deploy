import { ERROR_MESSAGES } from '@/constants'

/**
 * Converts API errors to user-friendly error messages
 * 
 * @param error - The error object from the API
 * @returns A user-friendly error message
 */
export function handleApiError(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const { code, message } = error as { code?: string; message?: string }

    switch (code) {
      case '401':
        return ERROR_MESSAGES.UNAUTHORIZED
      case '403':
        return ERROR_MESSAGES.FORBIDDEN
      case '404':
        return ERROR_MESSAGES.NOT_FOUND
      case 'VALIDATION_ERROR':
        return ERROR_MESSAGES.VALIDATION
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection.'
      default:
        return message || ERROR_MESSAGES.SERVER_ERROR
    }
  }

  return ERROR_MESSAGES.SERVER_ERROR
}
