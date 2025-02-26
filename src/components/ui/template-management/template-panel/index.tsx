import * as React from 'react'
import { PlusCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Template {
  id: string
  name: string
  description: string
  content: string
}

interface TemplatePanelProps {
  className?: string
  onTemplateSelect?: (template: Template) => void
}

export function TemplatePanel({
  className,
  onTemplateSelect,
}: TemplatePanelProps) {
  const [templates, setTemplates] = React.useState<Template[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showCreateForm, setShowCreateForm] = React.useState(false)
  const [editingTemplate, setEditingTemplate] = React.useState<Template | null>(
    null
  )

  React.useEffect(() => {
    // Fetch templates from API
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates')
        const data = await response.json()
        setTemplates(data || [])
      } catch (error) {
        console.error('Error fetching templates:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  const handleSelectTemplate = (template: Template) => {
    onTemplateSelect?.(template)
  }

  const handleCreateTemplate = (newTemplate: Omit<Template, 'id'>) => {
    // This would normally send a request to the API
    // For now, just demonstrate the state update pattern
    setTemplates((prev) => [
      ...prev,
      { ...newTemplate, id: `temp-${Date.now()}` },
    ])
    setShowCreateForm(false)
  }

  const handleUpdateTemplate = (
    updatedTemplate: Template | Omit<Template, 'id'>
  ) => {
    // This would normally send a request to the API
    // For now, just demonstrate the state update pattern
    if ('id' in updatedTemplate) {
      // If it's a Template with an id
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === updatedTemplate.id ? (updatedTemplate as Template) : t
        )
      )
    } else if (editingTemplate) {
      // If it's an Omit<Template, 'id'> and we're editing a template
      const completeTemplate = { ...updatedTemplate, id: editingTemplate.id }
      setTemplates((prev) =>
        prev.map((t) => (t.id === editingTemplate.id ? completeTemplate : t))
      )
    }
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = (deleteId: string) => {
    // This would normally send a request to the API
    // For now, just demonstrate the state update pattern
    setTemplates((prev) => prev.filter((t) => t.id !== deleteId))
  }

  if (loading) {
    return <div className="p-4">Loading templates...</div>
  }

  return (
    <div className={cn('h-full overflow-auto p-4', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Templates</h2>
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="flex items-center rounded-md bg-primary p-2 text-sm text-primary-foreground hover:bg-primary/90"
          aria-label="Create new template"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>Create</span>
        </button>
      </div>

      {showCreateForm && (
        <TemplateForm
          onSubmit={handleCreateTemplate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editingTemplate && (
        <TemplateForm
          template={editingTemplate}
          onSubmit={handleUpdateTemplate}
          onCancel={() => setEditingTemplate(null)}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => handleSelectTemplate(template)}
            className="flex flex-col rounded-lg border p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label={`Select template: ${template.name}`}
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-lg font-medium">{template.name}</h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingTemplate(template)
                  }}
                  className="rounded p-1 hover:bg-gray-100"
                  aria-label={`Edit template: ${template.name}`}
                >
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTemplate(template.id)
                  }}
                  className="rounded p-1 hover:bg-gray-100"
                  aria-label={`Delete template: ${template.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500">{template.description}</p>
          </button>
        ))}
      </div>

      {templates.length === 0 && !showCreateForm && (
        <div className="text-center text-gray-500">
          <p>No templates available</p>
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="mt-2 underline"
            aria-label="Create your first template"
          >
            Create your first template
          </button>
        </div>
      )}
    </div>
  )
}

interface TemplateFormProps {
  template?: Template
  onSubmit: (template: Template | Omit<Template, 'id'>) => void
  onCancel: () => void
}

function TemplateForm({ template, onSubmit, onCancel }: TemplateFormProps) {
  const [name, setName] = React.useState(template?.name || '')
  const [description, setDescription] = React.useState(
    template?.description || ''
  )
  const [content, setContent] = React.useState(template?.content || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...(template?.id ? { id: template.id } : {}),
      name,
      description,
      content,
    } as Template)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-lg border p-4">
      <div className="mb-4">
        <label
          htmlFor="template-name"
          className="mb-1 block text-sm font-medium"
        >
          Name
        </label>
        <input
          id="template-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="template-description"
          className="mb-1 block text-sm font-medium"
        >
          Description
        </label>
        <input
          id="template-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border p-2"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="template-content"
          className="mb-1 block text-sm font-medium"
        >
          Content
        </label>
        <textarea
          id="template-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-32 w-full rounded-md border p-2"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          {template ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
