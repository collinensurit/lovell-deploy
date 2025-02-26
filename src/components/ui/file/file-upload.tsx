'use client'

import * as React from 'react'
import { Upload, X, File as FileIcon, Image as ImageIcon } from 'lucide-react'
import { useFileUpload } from '@/lib-new/hooks'
import type { FileUploadOptions } from '@/lib-new/hooks/use-file-upload'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { FILE_TYPES } from '@/lib-new/utils/file/types'

/**
 * Props for FileUpload component
 */
export interface FileUploadProps {
  /**
   * Upload endpoint
   */
  endpoint: string

  /**
   * Maximum file size in bytes
   */
  maxSize?: number

  /**
   * Allowed file types
   */
  allowedTypes?: string[]

  /**
   * Multiple file upload support
   */
  multiple?: boolean

  /**
   * Show file preview
   */
  showPreview?: boolean

  /**
   * Auto upload on file selection
   */
  autoUpload?: boolean

  /**
   * Success callback
   */
  onSuccess?: (data: any, files: File[]) => void

  /**
   * Error callback
   */
  onError?: (error: string, files: File[]) => void

  /**
   * Additional class name
   */
  className?: string

  /**
   * Additional upload options
   */
  uploadOptions?: Partial<FileUploadOptions>
}

/**
 * File upload component with drag-and-drop support
 */
export function FileUpload({
  endpoint,
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = [...FILE_TYPES.IMAGES, ...FILE_TYPES.DOCUMENTS],
  multiple = false,
  showPreview = true,
  autoUpload = false,
  onSuccess,
  onError,
  className,
  uploadOptions = {}
}: FileUploadProps) {
  const [state, actions] = useFileUpload({
    endpoint,
    maxSize,
    allowedTypes,
    multiple,
    onSuccess,
    onError,
    ...uploadOptions
  })

  // Handle file input click
  const handleClick = () => {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.multiple = multiple
    inputElement.accept = allowedTypes.join(',')
    
    inputElement.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files?.length) {
        actions.selectFiles(Array.from(target.files))
        
        if (autoUpload) {
          setTimeout(() => actions.upload(), 0)
        }
      }
    }
    
    inputElement.click()
  }

  // Get icon for file type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5" />
    }
    return <FileIcon className="h-5 w-5" />
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Generate file preview
  const renderFilePreview = (file: File) => {
    if (!showPreview) return null
    
    if (file.type.startsWith('image/')) {
      return (
        <div className="h-12 w-12 overflow-hidden rounded border bg-gray-100 dark:bg-gray-800">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="h-full w-full object-cover"
            onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
          />
        </div>
      )
    }
    
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded border bg-gray-100 dark:bg-gray-800">
        {getFileIcon(file)}
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Drop zone */}
      <div
        {...actions.getDropZoneProps()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors",
          "hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800/30",
          state.status === 'error' && "border-red-500 bg-red-50 dark:bg-red-900/10"
        )}
      >
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Upload className="h-8 w-8 text-gray-400" />
          <h3 className="text-lg font-medium">
            Drag & drop files here
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            or <span className="font-medium text-primary cursor-pointer" onClick={handleClick}>browse files</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {multiple ? 'Upload multiple files' : 'Upload a file'} up to {formatFileSize(maxSize)}
          </p>
        </div>
      </div>

      {/* Selected files */}
      {state.selectedFiles.length > 0 && (
        <div className="mt-4 space-y-4">
          <h4 className="text-sm font-medium">Selected files ({state.selectedFiles.length})</h4>
          
          <div className="space-y-2">
            {state.selectedFiles.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded border p-2"
              >
                <div className="flex items-center space-x-3">
                  {renderFilePreview(file)}
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => {
                    actions.selectFiles(state.selectedFiles.filter((_, i) => i !== index))
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {/* Upload progress */}
          {state.status === 'uploading' && (
            <Progress value={state.progress} className="h-2" />
          )}
          
          {/* Error message */}
          {state.status === 'error' && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          
          {/* Success message */}
          {state.status === 'success' && (
            <p className="text-sm text-green-500">Files uploaded successfully!</p>
          )}
          
          {/* Actions */}
          <div className="flex space-x-2">
            {!autoUpload && (
              <Button 
                onClick={() => actions.upload()} 
                disabled={state.status === 'uploading' || state.selectedFiles.length === 0}
              >
                {state.status === 'uploading' ? 'Uploading...' : 'Upload Files'}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => actions.clearFiles()}
              disabled={state.status === 'uploading' || state.selectedFiles.length === 0}
            >
              Clear Files
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Simple image upload component with preview
 */
export function ImageUpload({
  endpoint,
  maxSize = 2 * 1024 * 1024, // 2MB default
  onSuccess,
  onError,
  className,
  uploadOptions = {}
}: Omit<FileUploadProps, 'allowedTypes' | 'multiple' | 'showPreview'>) {
  return (
    <FileUpload
      endpoint={endpoint}
      maxSize={maxSize}
      allowedTypes={FILE_TYPES.IMAGES}
      multiple={false}
      showPreview={true}
      onSuccess={onSuccess}
      onError={onError}
      className={className}
      uploadOptions={uploadOptions}
    />
  )
}

/**
 * Document upload component
 */
export function DocumentUpload({
  endpoint,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = true,
  onSuccess,
  onError,
  className,
  uploadOptions = {}
}: Omit<FileUploadProps, 'allowedTypes' | 'showPreview'>) {
  return (
    <FileUpload
      endpoint={endpoint}
      maxSize={maxSize}
      allowedTypes={FILE_TYPES.DOCUMENTS}
      multiple={multiple}
      showPreview={false}
      onSuccess={onSuccess}
      onError={onError}
      className={className}
      uploadOptions={uploadOptions}
    />
  )
}
