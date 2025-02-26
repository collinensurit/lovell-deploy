import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export type FileStatus = 'uploaded' | 'failed'

export interface FileMetadata {
  id: string
  name: string
  type: string
  size: number
  createdAt: string
  updatedAt: string
  userId: string
  projectId: string
  tags?: string[]
  customMetadata?: Record<string, unknown>
  path: string
  lastModified: number
  data: Blob | File
  status: FileStatus
}

export interface CreateFileMetadataInput {
  userId: string
  path: string
  size: number
  type: string
  lastModified: number
  status: FileStatus
}

export async function createFileMetadata(
  input: CreateFileMetadataInput
): Promise<FileMetadata> {
  const { data, error } = await supabase
    .from('file_metadata')
    .insert([input])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateFileMetadata(
  id: string,
  updates: Partial<Omit<FileMetadata, 'id' | 'userId' | 'createdAt'>>
): Promise<FileMetadata> {
  const { data, error } = await supabase
    .from('file_metadata')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getFileMetadata(
  id: string
): Promise<FileMetadata | null> {
  const { data, error } = await supabase
    .from('file_metadata')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw error
  }

  return data
}

export async function getUserFiles(
  userId: string,
  options: {
    status?: FileStatus
    searchTerm?: string
    limit?: number
    offset?: number
  } = {}
): Promise<{ files: FileMetadata[]; total: number }> {
  let query = supabase
    .from('file_metadata')
    .select('*', { count: 'exact' })
    .eq('userId', userId)

  if (options.status) {
    query = query.eq('status', options.status)
  }

  if (options.searchTerm) {
    query = query.or(`path.ilike.%${options.searchTerm}%`)
  }

  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    )
  }

  const { data, error, count } = await query

  if (error) {
    throw error
  }

  return {
    files: data || [],
    total: count || 0,
  }
}

export async function deleteFileMetadata(id: string): Promise<void> {
  const { error } = await supabase.from('file_metadata').delete().eq('id', id)

  if (error) {
    throw error
  }
}

export async function updateFileStatus(
  id: string,
  status: FileStatus
): Promise<FileMetadata> {
  const updates: Partial<FileMetadata> = {
    status,
  }

  return updateFileMetadata(id, updates)
}

export async function updateFileStatusByPath(
  userId: string,
  path: string,
  status: FileStatus
): Promise<FileMetadata> {
  const { data, error } = await supabase
    .from('file_metadata')
    .update({ status })
    .eq('userId', userId)
    .eq('path', path)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
