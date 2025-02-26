import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Template } from '@/lib/types'

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setTemplates(data || [])
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch templates')
      )
    } finally {
      setLoading(false)
    }
  }

  const createTemplate = async (
    template: Omit<Template, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert([template])
        .select()
        .single()

      if (error) {
        throw error
      }

      setTemplates((prev) => [data, ...prev])
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create template')
    }
  }

  const updateTemplate = async (id: string, updates: Partial<Template>) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      )
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update template')
    }
  }

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase.from('templates').delete().eq('id', id)

      if (error) {
        throw error
      }

      setTemplates((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete template')
    }
  }

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
