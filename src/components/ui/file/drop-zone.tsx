'use client'

import * as React from 'react'
import { Upload, File as FileIcon, X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { validateFile } from '../../../lib-new/utils/file/upload'

/**
 * Props for the DropZone component
 */
export interface DropZoneProps {
  /**
   * Function called when files are dropped or selected
   */
  onFilesSelected: (files: File[]) => void
  
  /**
   * Helper text to display inside the drop zone
   */
  helpText?: string
  
  /**
   * Whether multiple files can be selected
   */
  multiple?: boolean
  
  /**
   * Whether the component is disabled
   */
  disabled?: boolean
  
  /**
   * Accepted file types
   */
  accept?: string
  
  /**
   * Maximum file size in bytes
   */
  maxSize?: number
  
  /**
   * Maximum number of files that can be selected
   */
  maxFiles?: number
  
  /**
   * Additional validation options for files
   */
  validationOptions?: Parameters<typeof validateFile>[1]
  
  /**
   * CSS class name
   */
  className?: string
  
  /**
   * CSS styles
   */
  style?: React.CSSProperties
}

/**
 * File drop zone component with drag and drop support
 */
export function DropZone({
  onFilesSelected,
  multiple = false,
  maxSize,
  accept,
  disabled = false,
  maxFiles = multiple ? 10 : 1,
  validationOptions,
  helpText,
  className,
  style,
}: DropZoneProps) {
  const [isDragActive, setIsDragActive] = React.useState(false)
  const [isDragAccept, setIsDragAccept] = React.useState(false)
  const [isDragReject, setIsDragReject] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  
  // Handle drag enter event
  const handleDragEnter = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (disabled) return
    
    setIsDragActive(true)
    
    // Check if the dragged files are valid
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const isMultipleValid = multiple || e.dataTransfer.items.length <= 1
      
      // Reject if too many files when multiple is false
      if (!isMultipleValid) {
        setIsDragAccept(false)
        setIsDragReject(true)
        return
      }
      
      // Check if all files are valid
      let allValid = true
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i]
        
        // Check if file type is allowed
        if (accept && !accept.includes(item.type)) {
          allValid = false
          break
        }
      }
      
      setIsDragAccept(allValid)
      setIsDragReject(!allValid)
    }
  }, [disabled, multiple, accept])
  
  // Handle drag leave event
  const handleDragLeave = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragActive(false)
    setIsDragAccept(false)
    setIsDragReject(false)
  }, [])
  
  // Handle drag over event
  const handleDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (disabled) return
    
    setIsDragActive(true)
  }, [disabled])
  
  // Handle files
  const handleFiles = React.useCallback((fileList: FileList) => {
    const files = Array.from(fileList)
    const validFiles: File[] = []
    
    for (const file of files) {
      // Check if the file is valid
      const validationResult = validateFile(file, validationOptions)
      
      if (validationResult === true) {
        validFiles.push(file)
      } else {
        console.error(`File validation failed: ${validationResult}`)
      }
    }
    
    // Limit number of files
    if (multiple) {
      const totalFiles = [...selectedFiles, ...validFiles].slice(0, maxFiles)
      setSelectedFiles(totalFiles)
      onFilesSelected(totalFiles)
    } else {
      setSelectedFiles(validFiles.slice(0, 1))
      onFilesSelected(validFiles.slice(0, 1))
    }
  }, [maxSize, accept, multiple, maxFiles, onFilesSelected, validationOptions, selectedFiles])
  
  // Handle drop event
  const handleDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragActive(false)
    setIsDragAccept(false)
    setIsDragReject(false)
    
    if (disabled) return
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [disabled, handleFiles])
  
  // Handle file input change
  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])
  
  // Handle file removal
  const removeFile = React.useCallback((index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      onFilesSelected(newFiles)
      return newFiles
    })
  }, [onFilesSelected])
  
  // Handle click on drop zone
  const handleClick = React.useCallback(() => {
    if (disabled) return
    fileInputRef.current?.click()
  }, [disabled])
  
  // Generate preview URLs for images
  const filePreviews = React.useMemo(() => {
    return selectedFiles.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file)
      }
      return null
    })
  }, [selectedFiles])
  
  // Clean up preview URLs on unmount
  React.useEffect(() => {
    return () => {
      filePreviews.forEach(preview => {
        if (preview) URL.revokeObjectURL(preview)
      })
    }
  }, [filePreviews])
  
  return (
    <div>
      <div 
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors",
          "hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800/30",
          isDragActive && "border-primary bg-primary/5",
          isDragAccept && "border-green-500 bg-green-50 dark:bg-green-900/10",
          isDragReject && "border-red-500 bg-red-50 dark:bg-red-900/10",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
        style={style}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
        />
        
        {helpText || (
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <Upload className="h-8 w-8 text-gray-400" />
            <h3 className="text-lg font-medium">
              {isDragActive
                ? 'Drop files here'
                : 'Drag & drop files here'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or <span className="font-medium text-primary">browse files</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {multiple ? 'Upload multiple files' : 'Upload a file'}
              {maxSize && ` up to ${formatFileSize(maxSize)}`}
            </p>
          </div>
        )}
      </div>
      
      {/* Selected file previews */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Selected files ({selectedFiles.length})</p>
          
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded border p-2"
              >
                <div className="flex items-center space-x-3">
                  {filePreviews[index] ? (
                    <div className="h-10 w-10 overflow-hidden rounded border bg-gray-100 dark:bg-gray-800">
                      <img
                        src={filePreviews[index]!}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded border bg-gray-100 dark:bg-gray-800">
                      <FileIcon className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Format file size as human-readable string
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}
