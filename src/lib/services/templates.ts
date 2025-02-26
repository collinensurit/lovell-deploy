import { supabase } from '@/lib/supabase'

export interface Template {
  id: string
  name: string
  description: string
  content: string
  category: string
  created_at: string
  updated_at: string
  last_modified: string
  user_id: string
}

export async function createTemplate(
  template: Omit<Template, 'id' | 'created_at' | 'updated_at' | 'last_modified'>
) {
  const { data, error } = await supabase
    .from('templates')
    .insert({
      ...template,
      last_modified: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function updateTemplate(
  id: string,
  template: Partial<
    Omit<Template, 'id' | 'created_at' | 'updated_at' | 'last_modified'>
  >
) {
  const { data, error } = await supabase
    .from('templates')
    .update({
      ...template,
      last_modified: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function deleteTemplate(id: string) {
  const { error } = await supabase.from('templates').delete().eq('id', id)

  if (error) throw error
}

export async function getTemplate(id: string) {
  const { data, error } = await supabase
    .from('templates')
    .select()
    .eq('id', id)
    .single()

  if (error) throw error

  return data
}

export async function getTemplates() {
  const { data, error } = await supabase
    .from('templates')
    .select()
    .order('last_modified', { ascending: false })

  if (error) throw error

  return data
}
