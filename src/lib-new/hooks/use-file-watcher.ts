'use client'

import * as React from 'react'

/**
 * File watcher options
 */
export interface FileWatcherOptions {
  /**
   * Function to call when a file is changed
   */
  onChange?: (files: File[]) => void
  
  /**
   * Function to call when a file is added
   */
  onAdd?: (files: File[]) => void
  
  /**
   * Function to call when a file is removed
   */
  onRemove?: (fileIds: string[]) => void
  
  /**
   * Function to generate a unique ID for each file
   * Defaults to using file name + size + last modified time
   */
  getFileId?: (file: File) => string
  
  /**
   * Whether to enable watching
   * @default true
   */
  enabled?: boolean
}

/**
 * File with an assigned ID for tracking
 */
interface TrackedFile {
  id: string
  file: File
}

/**
 * Return value from useFileWatcher hook
 */
export interface FileWatcherResult {
  /**
   * All tracked files
   */
  files: File[]
  
  /**
   * Add files to the watcher
   */
  addFiles: (files: File | File[]) => void
  
  /**
   * Remove files from the watcher
   */
  removeFiles: (fileIds: string | string[]) => void
  
  /**
   * Clear all files
   */
  clearFiles: () => void
  
  /**
   * Update files in the watcher
   */
  updateFiles: (files: File | File[]) => void
  
  /**
   * Get a specific file by ID
   */
  getFile: (fileId: string) => File | undefined
  
  /**
   * Get all file IDs
   */
  getFileIds: () => string[]
}

/**
 * Hook to watch for file changes, additions, and removals
 * 
 * @param options - File watcher options
 * @returns File watcher methods and tracked files
 */
export function useFileWatcher(options: FileWatcherOptions = {}): FileWatcherResult {
  const {
    onChange,
    onAdd,
    onRemove,
    getFileId = defaultGetFileId,
    enabled = true,
  } = options
  
  // Store tracked files with IDs
  const [trackedFiles, setTrackedFiles] = React.useState<TrackedFile[]>([])
  
  // Default function to generate a unique ID for each file
  function defaultGetFileId(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`
  }
  
  // Add files to the watcher
  const addFiles = React.useCallback((newFiles: File | File[]) => {
    if (!enabled) return
    
    const filesArray = Array.isArray(newFiles) ? newFiles : [newFiles]
    if (filesArray.length === 0) return
    
    setTrackedFiles((prev) => {
      const addedFiles: TrackedFile[] = []
      
      // Only add files that aren't already tracked
      const filesToAdd = filesArray.filter((file) => {
        const fileId = getFileId(file)
        const exists = prev.some((tf) => tf.id === fileId)
        if (!exists) {
          addedFiles.push({ id: fileId, file })
          return true
        }
        return false
      })
      
      if (filesToAdd.length === 0) return prev
      
      const newTrackedFiles = [...prev, ...addedFiles]
      
      // Call onAdd callback if files were added
      if (onAdd && addedFiles.length > 0) {
        onAdd(addedFiles.map((tf) => tf.file))
      }
      
      // Call onChange callback
      if (onChange) {
        onChange(newTrackedFiles.map((tf) => tf.file))
      }
      
      return newTrackedFiles
    })
  }, [enabled, getFileId, onChange, onAdd])
  
  // Remove files from the watcher
  const removeFiles = React.useCallback((fileIds: string | string[]) => {
    if (!enabled) return
    
    const idsArray = Array.isArray(fileIds) ? fileIds : [fileIds]
    if (idsArray.length === 0) return
    
    setTrackedFiles((prev) => {
      const removedIds: string[] = []
      
      const newTrackedFiles = prev.filter((tf) => {
        const shouldRemove = idsArray.includes(tf.id)
        if (shouldRemove) {
          removedIds.push(tf.id)
          return false
        }
        return true
      })
      
      if (removedIds.length === 0) return prev
      
      // Call onRemove callback if files were removed
      if (onRemove && removedIds.length > 0) {
        onRemove(removedIds)
      }
      
      // Call onChange callback
      if (onChange) {
        onChange(newTrackedFiles.map((tf) => tf.file))
      }
      
      return newTrackedFiles
    })
  }, [enabled, onChange, onRemove])
  
  // Clear all files
  const clearFiles = React.useCallback(() => {
    if (!enabled) return
    
    setTrackedFiles((prev) => {
      if (prev.length === 0) return prev
      
      // Call onRemove callback with all file IDs
      if (onRemove && prev.length > 0) {
        onRemove(prev.map((tf) => tf.id))
      }
      
      // Call onChange callback with empty array
      if (onChange) {
        onChange([])
      }
      
      return []
    })
  }, [enabled, onChange, onRemove])
  
  // Update files in the watcher
  const updateFiles = React.useCallback((updatedFiles: File | File[]) => {
    if (!enabled) return
    
    const filesArray = Array.isArray(updatedFiles) ? updatedFiles : [updatedFiles]
    if (filesArray.length === 0) return
    
    setTrackedFiles((prev) => {
      let hasChanges = false
      const newTrackedFiles = prev.map((tf) => {
        // Find an updated file with the same ID
        const updatedFile = filesArray.find((file) => getFileId(file) === tf.id)
        if (updatedFile) {
          hasChanges = true
          return { ...tf, file: updatedFile }
        }
        return tf
      })
      
      // Call onChange callback if files were updated
      if (onChange && hasChanges) {
        onChange(newTrackedFiles.map((tf) => tf.file))
      }
      
      return hasChanges ? newTrackedFiles : prev
    })
  }, [enabled, getFileId, onChange])
  
  // Get a specific file by ID
  const getFile = React.useCallback((fileId: string): File | undefined => {
    return trackedFiles.find((tf) => tf.id === fileId)?.file
  }, [trackedFiles])
  
  // Get all file IDs
  const getFileIds = React.useCallback((): string[] => {
    return trackedFiles.map((tf) => tf.id)
  }, [trackedFiles])
  
  return {
    files: trackedFiles.map((tf) => tf.file),
    addFiles,
    removeFiles,
    clearFiles,
    updateFiles,
    getFile,
    getFileIds,
  }
}
