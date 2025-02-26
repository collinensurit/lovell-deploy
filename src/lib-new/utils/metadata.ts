import { createClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client for database operations
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

/**
 * Possible states for a file in the system
 */
export type FileStatus = 'uploaded' | 'failed'

/**
 * Complete file metadata structure
 */
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

/**
 * Required input for creating a new file metadata record
 */
export interface CreateFileMetadataInput {
  userId: string
  path: string
  size: number
  type: string
  lastModified: number
  status: FileStatus
}

/**
 * Creates a new file metadata record in the database
 * 
 * @param input - The metadata information to create
 * @returns The created file metadata record
 */
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

/**
 * Updates an existing file metadata record
 * 
 * @param id - The ID of the file to update
 * @param updates - The fields to update
 * @returns The updated file metadata record
 */
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

/**
 * Retrieves a file metadata record by ID
 * 
 * @param id - The ID of the file to retrieve
 * @returns The file metadata or null if not found
 */
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

/**
 * Retrieves files for a specific user with optional filtering
 * 
 * @param userId - The ID of the user whose files to retrieve
 * @param options - Optional filters and pagination
 * @returns Object containing files and total count
 */
export async function getUserFiles(
  userId: string,
  options: {
    status?: FileStatus
    searchTerm?: string
    limit?: number
    offset?: number
  } = {}
): Promise<{ files: FileMetadata[]; total: number }> {
  const { status, searchTerm, limit = 50, offset = 0 } = options

  let query = supabase
    .from('file_metadata')
    .select('*', { count: 'exact' })
    .eq('userId', userId)
    .order('createdAt', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) {
    query = query.eq('status', status)
  }

  if (searchTerm) {
    query = query.or(
      `name.ilike.%${searchTerm}%,path.ilike.%${searchTerm}%`
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

/**
 * Deletes a file metadata record by ID
 * 
 * @param id - The ID of the file to delete
 */
export async function deleteFileMetadata(id: string): Promise<void> {
  const { error } = await supabase.from('file_metadata').delete().eq('id', id)

  if (error) {
    throw error
  }
}

/**
 * Updates a file's status by ID
 * 
 * @param id - The ID of the file to update
 * @param status - The new status
 * @returns The updated file metadata
 */
export async function updateFileStatus(
  id: string,
  status: FileStatus
): Promise<FileMetadata> {
  return updateFileMetadata(id, { status })
}

/**
 * Updates a file's status by its path and user ID
 * 
 * @param userId - The ID of the file's owner
 * @param path - The file path
 * @param status - The new status
 * @returns The updated file metadata
 */
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
