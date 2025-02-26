export interface ProjectSettings {
  theme?: 'light' | 'dark' | 'system'
  notifications?: boolean
  autoSave?: boolean
}

export interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'archived' | 'deleted'
  userId: string
  settings: ProjectSettings
  createdAt: string
  updatedAt: string
}

export type ProjectCreate = Omit<
  Project,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
> & {
  settings?: Partial<ProjectSettings>
}

export interface ProjectUpdate extends Partial<ProjectCreate> {
  id: string
}
