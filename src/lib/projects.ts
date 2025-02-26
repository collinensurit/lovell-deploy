import { supabase } from './supabase'
import type { Project, ProjectCreate } from './types/project'

export async function listProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false })

  if (error) throw error
  return data
}

export async function getProject(
  id: string,
  userId: string
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('userId', userId)
    .single()

  if (error) throw error
  return data
}

export async function createProject(
  project: ProjectCreate,
  userId: string
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert([{ ...project, userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(
  id: string,
  project: Partial<ProjectCreate>,
  userId: string
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .eq('userId', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('userId', userId)

  if (error) throw error
}
