'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TemplatesContentProps {
  className?: string
  children?: React.ReactNode
}

interface Template {
  id: number
  name: string
  description: string
}

export function TemplatesContent({
  className,
  children,
}: TemplatesContentProps) {
  const [templates] = React.useState<Template[]>([
    { id: 1, name: 'Template 1', description: 'Description 1' },
    { id: 2, name: 'Template 2', description: 'Description 2' },
  ])

  const handleTemplateClick = () => {
    // Handle template click placeholder
  }

  return (
    <div className={cn('p-4', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Templates</h2>
        <Button>Create Template</Button>
      </div>

      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search templates..."
          className="w-full"
          aria-label="Search templates"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTemplateClick()
              }
            }}
            onClick={handleTemplateClick}
            className={cn(
              'cursor-pointer rounded-lg border p-4 hover:bg-gray-50',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            )}
            aria-label={template.name}
          >
            <h3 className="text-lg font-medium">{template.name}</h3>
            <p className="text-sm text-gray-500">{template.description}</p>
          </div>
        ))}
      </div>
      {children}
    </div>
  )
}
