import { z } from 'zod'
import { AppError } from '@/lib/types'

/**
 * Validates data against a Zod schema with detailed error handling
 * 
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns The validated and typed data
 * @throws AppError with validation details if validation fails
 */
export function validateSchema<T>(schema: z.Schema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError: AppError = new Error('Validation failed')
      validationError.code = 'VALIDATION_ERROR'
      validationError.details = error.errors.reduce(
        (acc, err) => {
          const path = err.path.join('.')
          acc[path] = err.message
          return acc
        },
        {} as Record<string, string>
      )
      throw validationError
    }
    throw error
  }
}
