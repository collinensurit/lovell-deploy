import { type ReactNode } from 'react'

// Auth Types
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  preferences?: UserPreferences
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  fontSize: number
  notifications: boolean
  experimentalFeatures: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

// UI Types
export interface LayoutProps {
  children: ReactNode
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

// Template Types
export interface Template {
  id: string
  name: string
  description?: string
  content: string
  variables: TemplateVariable[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required: boolean
  defaultValue?: unknown
}

// File Types
export interface File {
  id: string
  name: string
  type: string
  size: number
  url: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

// API Types
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

// Error Types
export interface AppError extends Error {
  code?: string
  details?: Record<string, unknown>
}

// Theme Types
export interface Theme {
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    muted: string
    accent: string
    error: string
    success: string
    warning: string
  }
  fonts: {
    body: string
    heading: string
    mono: string
  }
  fontSizes: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
}
