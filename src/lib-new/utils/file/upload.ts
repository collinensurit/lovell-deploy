'use client'

import { notifications } from '../notification'
import { FILE_TYPES, FILE_SIZE_LIMITS } from './types'

/**
 * File validation options
 */
export interface FileValidationOptions {
  /**
   * Maximum file size in bytes
   */
  maxSize?: number
  
  /**
   * Allowed MIME types
   */
  allowedTypes?: string[]
  
  /**
   * Custom validation function
   */
  customValidator?: (file: File) => boolean | string
}

/**
 * File upload options
 */
export interface FileUploadOptions extends FileValidationOptions {
  /**
   * Upload endpoint URL
   */
  endpoint: string
  
  /**
   * HTTP method (POST or PUT)
   */
  method?: 'POST' | 'PUT'
  
  /**
   * Extra headers to include
   */
  headers?: Record<string, string>
  
  /**
   * Form field name for the file
   */
  fieldName?: string
  
  /**
   * Extra form data to include
   */
  extraData?: Record<string, string | Blob>
  
  /**
   * Whether to include credentials
   */
  withCredentials?: boolean
  
  /**
   * Progress callback
   */
  onProgress?: (progress: number) => void
}

/**
 * File upload response
 */
export interface FileUploadResponse<T = any> {
  /**
   * Whether the upload was successful
   */
  success: boolean
  
  /**
   * Response data from the server
   */
  data?: T
  
  /**
   * Error message if upload failed
   */
  error?: string
  
  /**
   * HTTP status code
   */
  status?: number
}

/**
 * Validates a file against size and type constraints
 * 
 * @param file - The file to validate
 * @param options - Validation options
 * @returns true if valid, error message string if invalid
 */
export function validateFile(file: File, options: FileValidationOptions = {}): true | string {
  const { maxSize, allowedTypes, customValidator } = options
  
  // Check file size
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    return `File is too large (${fileSizeMB}MB). Maximum size is ${maxSizeMB}MB.`
  }
  
  // Check file type
  if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    const formattedTypes = allowedTypes.join(', ')
    return `Invalid file type. Allowed types: ${formattedTypes}`
  }
  
  // Run custom validator if provided
  if (customValidator) {
    const customResult = customValidator(file)
    if (typeof customResult === 'string') {
      return customResult
    } else if (customResult === false) {
      return 'File validation failed'
    }
  }
  
  return true
}

/**
 * Uploads a file to a server
 * 
 * @param file - The file to upload
 * @param options - Upload options
 * @returns Promise resolving to the upload response
 */
export async function uploadFile<T = any>(
  file: File, 
  options: FileUploadOptions
): Promise<FileUploadResponse<T>> {
  try {
    // Validate the file first
    const validation = validateFile(file, options)
    if (validation !== true) {
      return { 
        success: false, 
        error: validation 
      }
    }
    
    const {
      endpoint,
      method = 'POST',
      headers = {},
      fieldName = 'file',
      extraData = {},
      withCredentials = true,
      onProgress
    } = options
    
    // Create form data
    const formData = new FormData()
    formData.append(fieldName, file)
    
    // Add extra data
    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, value)
    })
    
    // Create and configure request
    const xhr = new XMLHttpRequest()
    xhr.open(method, endpoint)
    
    // Set headers (excluding Content-Type which is set automatically for FormData)
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })
    
    // Set credentials flag
    xhr.withCredentials = withCredentials
    
    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          onProgress(percentComplete)
        }
      })
    }
    
    // Return promise for handling response
    return new Promise((resolve) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Success
          try {
            const data = JSON.parse(xhr.responseText)
            resolve({
              success: true,
              data,
              status: xhr.status
            })
          } catch (err) {
            // Response wasn't JSON
            resolve({
              success: true,
              data: xhr.responseText as any,
              status: xhr.status
            })
          }
        } else {
          // Error
          let errorMessage = `Upload failed with status: ${xhr.status}`
          
          try {
            const response = JSON.parse(xhr.responseText)
            errorMessage = response.message || response.error || errorMessage
          } catch (e) {
            // Not JSON, use default error
          }
          
          resolve({
            success: false,
            error: errorMessage,
            status: xhr.status
          })
        }
      }
      
      xhr.onerror = () => {
        resolve({
          success: false,
          error: 'Network error occurred while uploading',
          status: 0
        })
      }
      
      // Send the request
      xhr.send(formData)
    })
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

/**
 * Helper function to upload multiple files
 * 
 * @param files - Array of files to upload
 * @param options - Upload options
 * @param showNotifications - Whether to show notifications for each upload
 * @returns Promise resolving to array of upload responses
 */
export async function uploadMultipleFiles<T = any>(
  files: File[],
  options: FileUploadOptions,
  showNotifications = true
): Promise<FileUploadResponse<T>[]> {
  const results: FileUploadResponse<T>[] = []
  
  for (const file of files) {
    if (showNotifications) {
      notifications.info(`Uploading ${file.name}...`, 'Upload')
    }
    
    const result = await uploadFile<T>(file, options)
    results.push(result)
    
    if (showNotifications) {
      if (result.success) {
        notifications.success(`Successfully uploaded ${file.name}`, 'Upload')
      } else {
        notifications.error(result.error || `Failed to upload ${file.name}`, 'Upload Error')
      }
    }
  }
  
  return results
}

/**
 * Creates a drop zone for file uploads
 * 
 * @param element - HTML element to use as the drop zone
 * @param onFilesDropped - Callback when files are dropped
 * @param options - Validation options for dropped files
 * @returns Cleanup function to remove event listeners
 */
export function createDropZone(
  element: HTMLElement,
  onFilesDropped: (files: File[]) => void,
  options: FileValidationOptions = {}
): () => void {
  const preventDefault = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const highlight = () => {
    element.classList.add('dropzone-active')
  }
  
  const unhighlight = () => {
    element.classList.remove('dropzone-active')
  }
  
  const handleDrop = (e: DragEvent) => {
    preventDefault(e)
    unhighlight()
    
    if (!e.dataTransfer?.files) return
    
    const files = Array.from(e.dataTransfer.files)
    const validFiles: File[] = []
    const invalidFiles: { file: File, reason: string }[] = []
    
    // Validate each file
    files.forEach(file => {
      const result = validateFile(file, options)
      if (result === true) {
        validFiles.push(file)
      } else {
        invalidFiles.push({ file, reason: result })
      }
    })
    
    // Show notifications for invalid files
    if (invalidFiles.length > 0) {
      invalidFiles.forEach(({ file, reason }) => {
        notifications.error(`${file.name}: ${reason}`, 'Invalid File')
      })
    }
    
    // Call the callback with valid files
    if (validFiles.length > 0) {
      onFilesDropped(validFiles)
    }
  }
  
  // Add event listeners
  element.addEventListener('dragenter', (e) => {
    preventDefault(e)
    highlight()
  })
  
  element.addEventListener('dragover', (e) => {
    preventDefault(e)
    highlight()
  })
  
  element.addEventListener('dragleave', (e) => {
    preventDefault(e)
    unhighlight()
  })
  
  element.addEventListener('drop', handleDrop as EventListener)
  
  // Return cleanup function
  return () => {
    element.removeEventListener('dragenter', preventDefault)
    element.removeEventListener('dragover', preventDefault)
    element.removeEventListener('dragleave', preventDefault)
    element.removeEventListener('drop', handleDrop as EventListener)
  }
}
