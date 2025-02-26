import { z } from 'zod'
import { AppError } from '@/types'

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isStrongPassword(value: string): boolean {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(value)
  const hasLowerCase = /[a-z]/.test(value)
  const hasNumbers = /\d/.test(value)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)

  return (
    value.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  )
}

export function validateUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function sanitizeString(value: string): string {
  return value.trim().replace(/[<>]/g, '')
}

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

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize
}

export function isValidJSON(value: string): boolean {
  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}

export function isValidDate(value: string): boolean {
  const date = new Date(value)
  return date instanceof Date && !isNaN(date.getTime())
}

export function normalizeString(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
