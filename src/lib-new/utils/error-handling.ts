import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { logging } from './logging'

/**
 * Interface for errors that include a code property
 */
interface ErrorWithCode extends Error {
  code?: string
  meta?: Record<string, unknown>
}

/**
 * Application-specific error class with standardized properties
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Interface for Prisma database errors
 */
interface PrismaError extends Error {
  code: string
  meta?: Record<string, unknown>
}

/**
 * Type guard to determine if an error is a Prisma error
 * 
 * @param error - The error to check
 * @returns Whether the error is a Prisma error
 */
function isPrismaError(error: unknown): error is PrismaError {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof (error as any).code === 'string'
  )
}

/**
 * Handles various error types and converts them to AppError
 * 
 * @param error - The error to handle
 * @returns An AppError instance
 */
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (isPrismaError(error)) {
    switch (error.code) {
      case 'P2002':
        return new AppError(
          'A unique constraint was violated.',
          'UNIQUE_VIOLATION',
          409
        )
      case 'P2025':
        return new AppError(
          'The requested resource was not found.',
          'NOT_FOUND',
          404
        )
      default:
        logging.error('Database error', error)
        return new AppError(
          'An unexpected database error occurred.',
          'DATABASE_ERROR',
          500
        )
    }
  }

  if (error instanceof Error) {
    logging.error('Unexpected error', error)
    return new AppError(error.message, 'INTERNAL_ERROR', 500)
  }

  const unknownError = new Error(String(error))
  logging.error('Unknown error', unknownError)
  return new AppError('An unexpected error occurred.', 'UNKNOWN_ERROR', 500)
}

/**
 * Converts an error to a NextResponse with appropriate status and body
 * 
 * @param error - The error to handle
 * @returns A NextResponse object
 */
export const errorHandler = (error: unknown) => {
  const appError = handleError(error)

  return NextResponse.json(
    {
      code: appError.code,
      message: appError.message,
      metadata: appError.metadata,
    },
    { status: appError.statusCode }
  )
}

/**
 * Asserts that a value is a user with an ID
 * 
 * @param user - The value to assert is a user
 * @throws AppError if the value is not a user with an ID
 */
export const assertUser = (user: unknown): asserts user is { id: string } => {
  if (!user || typeof user !== 'object' || !('id' in user)) {
    throw new AppError('Unauthorized', 'AUTHENTICATION_ERROR', 401)
  }
}

/**
 * Asserts that a condition is true (for authorization checks)
 * 
 * @param condition - The condition to check
 * @param message - The error message if the condition fails
 * @throws AppError if the condition is false
 */
export const assertPermission = (
  condition: boolean,
  message = 'Forbidden'
): asserts condition => {
  if (!condition) {
    throw new AppError(message, 'AUTHORIZATION_ERROR', 403)
  }
}
