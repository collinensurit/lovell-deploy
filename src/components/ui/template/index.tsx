'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface Template {
  id: string
  name: string
  description: string
  content: string
}

interface TemplateProps {
  className?: string
  template: Template
  onSelect?: (template: Template) => void
}

export function TemplatePanel({
  onSelect,
}: {
  onSelect: (template: Template) => void
}) {
  const [templates] = React.useState<Template[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // TODO: Implement template fetching
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="p-4">Loading templates...</div>
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-medium">Templates</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Template key={template.id} template={template} onSelect={onSelect} />
        ))}
        {templates.length === 0 && (
          <div className="text-center text-gray-500">
            <p>No templates available</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Template({ className, template, onSelect }: TemplateProps) {
  const handleClick = () => {
    onSelect?.(template)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick()
        }
      }}
      className={cn(
        'cursor-pointer rounded-lg border p-4 hover:bg-gray-50',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        className
      )}
      aria-label={template.name}
    >
      <h3 className="text-lg font-medium">{template.name}</h3>
      <p className="mt-1 text-sm text-gray-500">{template.description}</p>
    </div>
  )
}
