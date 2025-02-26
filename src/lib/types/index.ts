import { User } from '@supabase/supabase-js'

export interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  userId: string
  status: 'active' | 'archived' | 'deleted'
  settings: ProjectSettings
}

export type ProjectInsert = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>

export interface ProjectSettings {
  theme?: 'light' | 'dark' | 'system'
  notifications?: boolean
  language?: string
  timezone?: string
  autoSave?: boolean
  defaultView?: 'grid' | 'list'
}

export interface ProjectListProps {
  projects: Project[]
  onSelect?: (project: Project) => void
  onDelete?: (projectId: string) => void
  onArchive?: (projectId: string) => void
}

export interface UserContextType {
  user: User | null
  loading: boolean
  error?: Error
}

export interface RequestError {
  code: string
  message: string
  error?: Error
}

export interface ApiResponse<T> {
  data?: T
  error?: RequestError
}

export * from './file'
export * from './template'
export * from './project'
export * from './logging'
export * from './user'
