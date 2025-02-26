'use client'

import * as React from 'react'
import { Upload, FileType2 } from 'lucide-react'
import { cn } from '@/lib/utils' 
import { 
  createDropZone, 
  validateFile
} from '@/lib-new/utils/file'
import type { FileValidationOptions } from '@/lib-new/utils/file'

/**
 * Props for the DropZone component
 */
export interface DropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Function called when files are dropped or selected
   */
  onFilesSelected: (files: File[]) => void

  /**
   * Whether to accept multiple files
   * @default false
   */
  multiple?: boolean

  /**
   * Accepted file types
   * @example "image/*,application/pdf"
   */
  accept?: string

  /**
   * Validation options for the dropped files
   */
  validationOptions?: FileValidationOptions

  /**
   * The text to display in the drop zone
   * @default "Drag and drop files here or click to browse"
   */
  helpText?: React.ReactNode

  /**
   * Whether the drop zone is disabled
   * @default false
   */
  disabled?: boolean

  /**
   * Whether to show the icon
   * @default true
   */
  showIcon?: boolean

  /**
   * Custom icon to display
   */
  icon?: React.ReactNode

  /**
   * Whether to show a border
   * @default true
   */
  bordered?: boolean

  /**
   * Custom CSS class for the drop zone
   */
  className?: string
}

/**
 * File drop zone component
 */
export function DropZone({
  onFilesSelected,
  multiple = false,
  accept,
  validationOptions,
  helpText = "Drag and drop files here or click to browse",
  disabled = false,
  showIcon = true,
  icon,
  bordered = true,
  className,
  ...props
}: DropZoneProps) {
  const [isDragActive, setIsDragActive] = React.useState(false)
  const [validationError, setValidationError] = React.useState<string | null>(null)
  const dropZoneRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  
  // Set up the drop zone handler
  React.useEffect(() => {
    if (!dropZoneRef.current || disabled) return
    
    const handleFilesDropped = (files: File[]) => {
      // Validate files if validation options are provided
      if (validationOptions) {
        const invalidFiles = files.filter(
          (file) => validateFile(file, validationOptions) !== true
        )
        
        if (invalidFiles.length > 0) {
          // Get the first validation error message
          const error = validateFile(invalidFiles[0], validationOptions)
          setValidationError(typeof error === 'string' ? error : 'Invalid file')
          return
        }
      }
      
      setValidationError(null)
      onFilesSelected(multiple ? files : [files[0]])
    }
    
    const cleanup = createDropZone(
      dropZoneRef.current,
      handleFilesDropped,
      validationOptions
    )
    
    return cleanup
  }, [disabled, multiple, onFilesSelected, validationOptions])
  
  // Handle drag events manually for visual feedback
  const handleDragEvent = (e: React.DragEvent, isDragging: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (disabled) return
    setIsDragActive(isDragging)
  }
  
  // Handle browse button click
  const handleBrowseClick = () => {
    if (disabled) return
    inputRef.current?.click()
  }
  
  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return
    
    const files = Array.from(fileList)
    
    // Validate files if validation options are provided
    if (validationOptions) {
      const invalidFiles = files.filter(
        (file) => validateFile(file, validationOptions) !== true
      )
      
      if (invalidFiles.length > 0) {
        // Get the first validation error message
        const error = validateFile(invalidFiles[0], validationOptions)
        setValidationError(typeof error === 'string' ? error : 'Invalid file')
        return
      }
    }
    
    setValidationError(null)
    onFilesSelected(multiple ? files : files.slice(0, 1))
    
    // Reset the input so the same file can be selected again
    e.target.value = ''
  }
  
  return (
    <div
      className={cn(
        'relative cursor-pointer transition-colors duration-200',
        bordered && 'rounded-lg border-2 border-dashed p-6',
        isDragActive && 'border-primary bg-primary/5',
        disabled && 'cursor-not-allowed opacity-60',
        validationError && 'border-destructive',
        className
      )}
      ref={dropZoneRef}
      onClick={handleBrowseClick}
      onDragOver={(e) => handleDragEvent(e, true)}
      onDragEnter={(e) => handleDragEvent(e, true)}
      onDragLeave={(e) => handleDragEvent(e, false)}
      onDrop={(e) => {
        handleDragEvent(e, false)
        // The actual file handling is done by the createDropZone utility
      }}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        onChange={handleFileInputChange}
      />
      
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        {showIcon && (
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            {icon || (isDragActive ? <FileType2 className="h-6 w-6" /> : <Upload className="h-6 w-6" />)}
          </div>
        )}
        
        <div className="space-y-1">
          <p className="text-sm font-medium">{helpText}</p>
          {validationError ? (
            <p className="text-xs text-destructive">{validationError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {accept ? `Accepts: ${accept.replace(/,/g, ', ')}` : 'All file types accepted'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
