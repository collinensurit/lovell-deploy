export const APP_CONFIG = {
  name: 'Lovell',
  version: '1.0.0',
  apiVersion: 'v1',
} as const

export const AUTH = {
  SESSION_KEY: 'lovell_session',
  REFRESH_KEY: 'lovell_refresh',
  TOKEN_EXPIRY: '7d',
  REFRESH_EXPIRY: '30d',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  TEMPLATES: '/templates',
  API: {
    BASE: '/api',
    AUTH: '/api/auth',
    TEMPLATES: '/api/templates',
    FILES: '/api/files',
    HEALTH: '/api/health',
  },
} as const

export const UI = {
  SIDEBAR_WIDTH: 240,
  HEADER_HEIGHT: 60,
  TOAST_DURATION: 5000,
  ANIMATION_DURATION: 200,
  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
} as const

export const FILE = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  UPLOAD_PATH: '/uploads',
} as const

export const TEMPLATE = {
  MAX_SIZE: 1024 * 1024, // 1MB
  MAX_VARIABLES: 50,
  PREVIEW_TIMEOUT: 5000,
} as const

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You must be logged in to access this resource',
  FORBIDDEN: 'You do not have permission to access this resource',
  NOT_FOUND: 'The requested resource was not found',
  VALIDATION: 'Please check your input and try again',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later',
} as const

export const FEATURE_FLAGS = {
  EXPERIMENTAL_FEATURES:
    process.env.NEXT_PUBLIC_EXPERIMENTAL_FEATURES === 'true',
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
} as const
