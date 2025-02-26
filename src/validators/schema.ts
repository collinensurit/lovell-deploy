import { z } from 'zod'

// Constants
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
] as const
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_TEMPLATE_SIZE = 1024 * 1024 // 1MB
const MAX_TEMPLATE_VARIABLES = 10

// User Schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  fontSize: z.number().min(12).max(24),
  notifications: z.boolean(),
  experimentalFeatures: z.boolean(),
})

// Template Schemas
export const templateVariableSchema = z.object({
  name: z.string().min(1, 'Variable name is required').max(50),
  type: z.enum(['string', 'number', 'boolean', 'date']),
  required: z.boolean().default(true),
  default: z.any().optional(),
})

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  description: z.string().max(500).optional(),
  content: z
    .string()
    .min(1, 'Template content is required')
    .max(MAX_TEMPLATE_SIZE, 'Template content is too large'),
  variables: z
    .array(templateVariableSchema)
    .max(MAX_TEMPLATE_VARIABLES, 'Too many variables')
    .optional(),
})

// File Schemas
export const fileSchema = z.object({
  file: z.any(),
  type: z.enum(ALLOWED_FILE_TYPES),
  size: z.number().max(MAX_FILE_SIZE, 'File is too large'),
  metadata: z.record(z.unknown()).optional(),
})

// Search Schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
  filters: z
    .object({
      type: z.enum(ALLOWED_FILE_TYPES).optional(),
      dateFrom: z.string().datetime().optional(),
      dateTo: z.string().datetime().optional(),
    })
    .optional(),
  sort: z
    .object({
      field: z.enum(['name', 'size', 'createdAt', 'updatedAt']),
      order: z.enum(['asc', 'desc']),
    })
    .optional(),
})

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

// Helper function to validate schema
export function validateSchema<T>(schema: z.Schema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.errors,
      }
    }
    throw error
  }
}

// Types
export type Pagination = z.infer<typeof paginationSchema>
export type FileUpload = z.infer<typeof fileSchema>
export type SearchParams = z.infer<typeof searchSchema>
export type Template = z.infer<typeof templateSchema>
