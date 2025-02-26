export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'boolean'
  description?: string
  default?: string | number | boolean
}

export interface Template {
  id: string
  name: string
  description?: string
  content: string
  category?: string
  variables: TemplateVariable[]
  createdAt: string
  updatedAt: string
}

export interface TemplateCreate {
  name: string
  description?: string
  content: string
  category?: string
  variables: TemplateVariable[]
}

export interface TemplateUpdate {
  name?: string
  description?: string
  content?: string
  category?: string
  variables?: TemplateVariable[]
}
