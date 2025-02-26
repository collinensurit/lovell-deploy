'use client'

import { useState, useEffect } from 'react'
import type { Template, TemplateCreate, TemplateUpdate } from '@/lib/types'

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/templates')
      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }
      const data = await response.json()
      setTemplates(data)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch templates')
      )
    } finally {
      setLoading(false)
    }
  }

  const createTemplate = async (template: TemplateCreate) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      })
      if (!response.ok) {
        throw new Error('Failed to create template')
      }
      const data = await response.json()
      setTemplates((prev) => [...prev, data])
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create template')
    }
  }

  const updateTemplate = async (id: string, updates: TemplateUpdate) => {
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error('Failed to update template')
      }
      const data = await response.json()
      setTemplates((prev) => prev.map((t) => (t.id === id ? data : t)))
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update template')
    }
  }

  const deleteTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete template')
      }
      setTemplates((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete template')
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates,
  }
}
