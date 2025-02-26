'use client'

import * as React from 'react'
import { uploadFile, uploadMultipleFiles, validateFile, FileUploadOptions, FileUploadResponse, FileValidationOptions, createDropZone } from '../utils/file/upload'

/**
 * Upload status
 */
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

/**
 * File upload state
 */
export interface FileUploadState<T = any> {
  /**
   * Current status of the upload
   */
  status: UploadStatus
  
  /**
   * Upload progress (0-100)
   */
  progress: number
  
  /**
   * Selected files awaiting upload
   */
  selectedFiles: File[]
  
  /**
   * Response data from successful uploads
   */
  data?: T
  
  /**
   * Error message if upload failed
   */
  error?: string
  
  /**
   * Upload history
   */
  history: {
    file: File
    response: FileUploadResponse<T>
    timestamp: number
  }[]
}

/**
 * File upload actions
 */
export interface FileUploadActions {
  /**
   * Select files for upload
   */
  selectFiles: (files: File[]) => void
  
  /**
   * Clear selected files
   */
  clearFiles: () => void
  
  /**
   * Upload selected files
   */
  upload: () => Promise<void>
  
  /**
   * Upload a single file
   */
  uploadFile: (file: File) => Promise<void>
  
  /**
   * Create a file input reference
   */
  getInputProps: () => {
    ref: React.RefObject<HTMLInputElement>
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    multiple: boolean
    accept?: string
  }
  
  /**
   * Create a drop zone
   */
  getDropZoneProps: () => {
    ref: React.RefObject<HTMLDivElement>
    onDragOver: (e: React.DragEvent) => void
    onDragEnter: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
  }
}

/**
 * Hook options for file upload
 */
export interface UseFileUploadOptions<T = any> extends FileUploadOptions, FileValidationOptions {
  /**
   * Whether to support multiple file uploads
   */
  multiple?: boolean
  
  /**
   * Accepted file types for file input
   */
  accept?: string
  
  /**
   * Auto-clear files after upload
   */
  autoClear?: boolean
  
  /**
   * Success callback
   */
  onSuccess?: (data: T, files: File[]) => void
  
  /**
   * Error callback
   */
  onError?: (error: string, files: File[]) => void
  
  /**
   * Status change callback
   */
  onStatusChange?: (status: UploadStatus) => void
}

/**
 * Hook for managing file uploads
 * 
 * @param options - Hook options
 * @returns Upload state and actions
 */
export function useFileUpload<T = any>(
  options: Partial<UseFileUploadOptions<T>> = {}
): [FileUploadState<T>, FileUploadActions] {
  const {
    multiple = false,
    accept,
    autoClear = true,
    onSuccess,
    onError,
    onStatusChange,
    endpoint = '/api/upload', // Default endpoint
    ...uploadOptions
  } = options as UseFileUploadOptions<T>
  
  // Create refs
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const dropZoneRef = React.useRef<HTMLDivElement>(null)
  
  // Create state
  const [state, setState] = React.useState<FileUploadState<T>>({
    status: 'idle',
    progress: 0,
    selectedFiles: [],
    history: []
  })
  
  // Update status with callback
  const updateStatus = React.useCallback((status: UploadStatus) => {
    setState(prev => ({ ...prev, status }))
    onStatusChange?.(status)
  }, [onStatusChange])
  
  // Handle file selection
  const selectFiles = React.useCallback((files: File[]) => {
    setState(prev => ({
      ...prev,
      selectedFiles: multiple ? [...prev.selectedFiles, ...files] : files,
      status: 'idle',
      error: undefined
    }))
  }, [multiple])
  
  // Clear selected files
  const clearFiles = React.useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedFiles: [],
      status: 'idle',
      progress: 0,
      error: undefined
    }))
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])
  
  // Handle file input change
  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    
    const files = Array.from(e.target.files)
    const validFiles: File[] = []
    
    // Validate each file
    files.forEach((file: File) => {
      const validation = validateFile(file, options)
      if (validation === true) {
        validFiles.push(file)
      }
    })
    
    selectFiles(validFiles)
  }, [options, selectFiles])
  
  // Upload selected files
  const upload = React.useCallback(async () => {
    if (!state.selectedFiles.length) return
    
    updateStatus('uploading')
    setState(prev => ({ ...prev, progress: 0 }))
    
    try {
      // Track progress
      const uploadOpts: FileUploadOptions = {
        ...uploadOptions,
        endpoint: options.endpoint || '/api/upload', // Ensure endpoint is always provided
        onProgress: (progress) => {
          setState(prev => ({ ...prev, progress }))
        }
      }
      
      // Perform the upload
      const results = await uploadMultipleFiles<T>(
        state.selectedFiles,
        uploadOpts
      )
      
      // Check if all uploads were successful
      const allSuccessful = results.every(r => r.success)
      const lastResponse = results[results.length - 1]
      
      if (allSuccessful) {
        updateStatus('success')
        setState(prev => ({ 
          ...prev, 
          data: lastResponse.data,
          error: undefined,
          history: [
            ...prev.history,
            ...state.selectedFiles.map((file, index) => ({
              file,
              response: results[index],
              timestamp: Date.now()
            }))
          ],
          // Clear files if autoClear is enabled
          selectedFiles: autoClear ? [] : prev.selectedFiles
        }))
        
        onSuccess?.(lastResponse.data as T, state.selectedFiles)
      } else {
        // At least one upload failed
        const errorMessage = results.find(r => !r.success)?.error || 'Upload failed'
        updateStatus('error')
        setState(prev => ({ 
          ...prev, 
          error: errorMessage,
          history: [
            ...prev.history,
            ...state.selectedFiles.map((file, index) => ({
              file,
              response: results[index],
              timestamp: Date.now()
            }))
          ]
        }))
        
        onError?.(errorMessage, state.selectedFiles)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      updateStatus('error')
      setState(prev => ({ ...prev, error: errorMessage }))
      onError?.(errorMessage, state.selectedFiles)
    }
  }, [state.selectedFiles, updateStatus, uploadOptions, autoClear, onSuccess, onError])
  
  // Upload a single file
  const uploadSingleFile = React.useCallback(async (file: File) => {
    updateStatus('uploading')
    setState(prev => ({ ...prev, progress: 0 }))
    
    try {
      // Track progress
      const uploadOpts: FileUploadOptions = {
        ...uploadOptions,
        endpoint: options.endpoint || '/api/upload', // Ensure endpoint is always provided
        onProgress: (progress) => {
          setState(prev => ({ ...prev, progress }))
        }
      }
      
      // Perform the upload
      const result = await uploadFile<T>(file, uploadOpts)
      
      if (result.success) {
        updateStatus('success')
        setState(prev => ({ 
          ...prev, 
          data: result.data,
          error: undefined,
          history: [
            ...prev.history,
            {
              file,
              response: result,
              timestamp: Date.now()
            }
          ]
        }))
        
        onSuccess?.(result.data as T, [file])
      } else {
        updateStatus('error')
        setState(prev => ({ 
          ...prev, 
          error: result.error,
          history: [
            ...prev.history,
            {
              file,
              response: result,
              timestamp: Date.now()
            }
          ]
        }))
        
        onError?.(result.error || 'Upload failed', [file])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      updateStatus('error')
      setState(prev => ({ ...prev, error: errorMessage }))
      onError?.(errorMessage, [file])
    }
  }, [updateStatus, uploadOptions, onSuccess, onError])
  
  // Set up drop zone handlers
  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])
  
  const handleDragEnter = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('dropzone-active')
    }
  }, [])
  
  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('dropzone-active')
    }
  }, [])
  
  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('dropzone-active')
    }
    
    if (!e.dataTransfer.files.length) return
    
    const files = Array.from(e.dataTransfer.files)
    const validFiles: File[] = []
    
    // Validate each file
    files.forEach((file: File) => {
      const validation = validateFile(file, options)
      if (validation === true) {
        validFiles.push(file)
      }
    })
    
    selectFiles(validFiles)
  }, [options, selectFiles])
  
  // Effect for drop zone setup
  React.useEffect(() => {
    if (!dropZoneRef.current) return
    
    const cleanup = createDropZone(
      dropZoneRef.current,
      (files) => selectFiles(files),
      options
    )
    
    return cleanup
  }, [dropZoneRef, options, selectFiles])
  
  // Get input props
  const getInputProps = React.useCallback(() => ({
    ref: fileInputRef,
    onChange: handleFileChange,
    multiple,
    accept
  }), [handleFileChange, multiple, accept])
  
  // Get drop zone props
  const getDropZoneProps = React.useCallback(() => ({
    ref: dropZoneRef,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop
  }), [handleDragOver, handleDragEnter, handleDragLeave, handleDrop])
  
  // Combine all actions
  const actions: FileUploadActions = {
    selectFiles,
    clearFiles,
    upload,
    uploadFile: uploadSingleFile,
    getInputProps,
    getDropZoneProps
  }
  
  return [state, actions]
}
