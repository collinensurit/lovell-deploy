/**
 * File metadata utilities
 */

import { supabase } from '@/lib/supabase'

/**
 * File status
 */
export type FileStatus = 'uploaded' | 'failed' | 'processing' | 'ready'

/**
 * File metadata interface
 */
export interface FileMetadata {
  id: string
  userId: string
  name: string
  path: string
  size: number
  type: string
  createdAt: string
  updatedAt: string
  data: Blob | File
  status: FileStatus
  thumbnail?: string
  description?: string
}

/**
 * Input for creating file metadata
 */
export interface CreateFileMetadataInput {
  name: string
  path: string
  size: number
  type: string
  userId: string
  status: FileStatus
  description?: string
}

/**
 * Creates file metadata in the database
 * 
 * @param input - File metadata input
 * @returns Promise resolving to the created file metadata
 */
export async function createFileMetadata(
  input: CreateFileMetadataInput
): Promise<FileMetadata> {
  const { data, error } = await supabase
    .from('file_metadata')
    .insert({
      name: input.name,
      path: input.path,
      size: input.size,
      type: input.type,
      user_id: input.userId,
      status: input.status,
      description: input.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  return transformFileMetadata(data)
}

/**
 * Updates file metadata in the database
 * 
 * @param id - File metadata ID
 * @param updates - Partial metadata updates
 * @returns Promise resolving to the updated file metadata
 */
export async function updateFileMetadata(
  id: string,
  updates: Partial<Omit<FileMetadata, 'id' | 'userId' | 'createdAt'>>
): Promise<FileMetadata> {
  const { data, error } = await supabase
    .from('file_metadata')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return transformFileMetadata(data)
}

/**
 * Gets file metadata by ID
 * 
 * @param id - File metadata ID
 * @returns Promise resolving to the file metadata or null if not found
 */
export async function getFileMetadata(
  id: string
): Promise<FileMetadata | null> {
  const { data, error } = await supabase
    .from('file_metadata')
    .select()
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return transformFileMetadata(data)
}

/**
 * Gets file metadata by path
 * 
 * @param path - File path
 * @returns Promise resolving to the file metadata or null if not found
 */
export async function getFileMetadataByPath(
  path: string
): Promise<FileMetadata | null> {
  const { data, error } = await supabase
    .from('file_metadata')
    .select()
    .eq('path', path)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return transformFileMetadata(data)
}

/**
 * Gets all files for a user with pagination and filtering
 * 
 * @param userId - User ID
 * @param limit - Number of items per page
 * @param offset - Pagination offset
 * @param status - Optional status filter
 * @param type - Optional file type filter
 * @returns Promise resolving to the files and total count
 */
export async function getUserFiles(
  userId: string,
  limit = 10,
  offset = 0,
  status?: FileStatus,
  type?: string
): Promise<{ files: FileMetadata[]; total: number }> {
  let query = supabase
    .from('file_metadata')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (status) {
    query = query.eq('status', status)
  }
  
  if (type) {
    query = query.eq('type', type)
  }
  
  const { data, error, count } = await query
  
  if (error) throw error
  
  return {
    files: data?.map(transformFileMetadata) || [],
    total: count || 0,
  }
}

/**
 * Deletes file metadata from the database
 * 
 * @param id - File metadata ID
 */
export async function deleteFileMetadata(id: string): Promise<void> {
  const { error } = await supabase.from('file_metadata').delete().eq('id', id)
  
  if (error) throw error
}

/**
 * Updates file status
 * 
 * @param id - File metadata ID
 * @param status - New status
 * @returns Promise resolving to the updated file metadata
 */
export async function updateFileStatus(
  id: string,
  status: FileStatus
): Promise<FileMetadata> {
  const updates: Partial<FileMetadata> = {
    status,
    updatedAt: new Date().toISOString(),
  }
  
  return updateFileMetadata(id, updates)
}

/**
 * Updates file status by path
 * 
 * @param path - File path
 * @param userId - User ID
 * @param status - New status
 * @returns Promise resolving to the updated file metadata
 */
export async function updateFileStatusByPath(
  path: string,
  userId: string,
  status: FileStatus
): Promise<FileMetadata> {
  const { data, error } = await supabase
    .from('file_metadata')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('path', path)
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) throw error
  
  return transformFileMetadata(data)
}

/**
 * Transforms database file metadata to the FileMetadata interface
 * 
 * @param data - Database file metadata
 * @returns Transformed file metadata
 */
function transformFileMetadata(data: any): FileMetadata {
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    path: data.path,
    size: data.size,
    type: data.type,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    status: data.status,
    data: data.data,
    thumbnail: data.thumbnail,
    description: data.description,
  }
}
