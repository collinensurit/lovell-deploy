export interface Project {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  owner_id: string
}

export interface ProjectInsert {
  name: string
  description: string
  owner_id: string
}

export interface Template {
  id: string
  name: string
  description: string
  content: string
  variables: TemplateVariable[]
  created_at: string
  updated_at: string
  owner_id: string
}

export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'boolean'
  default?: string | number | boolean
  description?: string
  required: boolean
}
