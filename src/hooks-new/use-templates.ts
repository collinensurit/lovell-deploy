'use client'

import { useState, useEffect } from 'react'
import type { Template, TemplateCreate, TemplateUpdate } from '@/lib/types'

/**
 * Hook for managing templates with CRUD operations
 * 
 * @returns Template data and methods for manipulating templates
 */
export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Fetches all templates from the API
   */
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

  /**
   * Creates a new template
   * 
   * @param template - The template data to create
   * @returns The newly created template
   */
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

  /**
   * Updates an existing template
   * 
   * @param id - The ID of the template to update
   * @param updates - The template data to update
   * @returns The updated template
   */
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

  /**
   * Deletes a template by ID
   * 
   * @param id - The ID of the template to delete
   */
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

  // Load templates on mount
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
