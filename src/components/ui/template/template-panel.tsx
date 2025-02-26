'use client'

import React from 'react'
import { useTemplates } from '@/hooks/use-templates'
import type { Template } from '@/lib/types'
import cn from 'classnames'

interface TemplatePanelProps {
  onSelect: (template: Template) => void
  className?: string
}

export function TemplatePanel({ onSelect, className }: TemplatePanelProps) {
  const { templates, loading, error } = useTemplates()
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredTemplates = React.useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === 'All' || template.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [templates, searchQuery, selectedCategory])

  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(templates.map((t) => t.category || 'Uncategorized'))
    )
    return ['All', ...uniqueCategories].sort()
  }, [templates])

  if (loading) {
    return <div className="p-4">Loading templates...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>
  }

  return (
    <div className={className}>
      <div className="space-y-4 p-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search templates..."
            className="flex-1 rounded border px-3 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search templates"
          />
          <select
            className="rounded border px-3 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Select category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              className={cn(
                'w-full rounded-lg border p-3 text-left transition-colors',
                'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                'cursor-pointer'
              )}
              onClick={() => onSelect(template)}
              aria-label={`Select template: ${template.name}`}
            >
              <h3 className="font-medium">{template.name}</h3>
              {template.description && (
                <p className="mt-1 text-sm text-gray-500">
                  {template.description}
                </p>
              )}
              <div className="mt-2 text-xs text-gray-400">
                Last updated:{' '}
                {new Date(template.updatedAt).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
