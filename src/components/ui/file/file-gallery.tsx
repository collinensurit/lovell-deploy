'use client'

import * as React from 'react'
import { X, Upload, Download, Trash2, Pencil } from 'lucide-react'
import { useFileUpload } from '../../../lib-new/hooks/use-file-upload'
import { useFileMetadata } from '../../../lib-new/hooks/use-file-metadata'
import { downloadFile } from '../../../lib-new/utils/file/operations'
import { validateFile } from '../../../lib-new/utils/file/upload'
import { FILE_TYPES } from '../../../lib-new/utils/file/types'
import { cn } from '../../../lib/utils'
import { Button } from '../button'
import { FileViewer } from './file-preview/file-viewer'

/**
 * Props for FileGallery component
 */
interface FileGalleryProps {
  /**
   * Upload endpoint
   */
  endpoint: string
  
  /**
   * Initial files (optional)
   */
  initialFiles?: File[]
  
  /**
   * Maximum number of files allowed
   */
  maxFiles?: number
  
  /**
   * Maximum file size in bytes
   */
  maxSize?: number
  
  /**
   * Allowed file types
   */
  allowedTypes?: string[]
  
  /**
   * Whether to allow multiple files
   */
  multiple?: boolean
  
  /**
   * Layout type
   */
  layout?: 'grid' | 'list'
  
  /**
   * Enable image editing
   */
  enableImageEditing?: boolean
  
  /**
   * Upload callback
   */
  onUpload?: (files: File[]) => void
  
  /**
   * Delete callback
   */
  onDelete?: (file: File) => void
  
  /**
   * Edit callback
   */
  onEdit?: (oldFile: File, newFile: File) => void
  
  /**
   * Additional class name
   */
  className?: string
}

/**
 * A file gallery component with upload, preview, download, and delete capabilities
 */
export function FileGallery({
  endpoint,
  initialFiles = [],
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = [...FILE_TYPES.IMAGES, ...FILE_TYPES.DOCUMENTS, ...FILE_TYPES.AUDIO, ...FILE_TYPES.VIDEO],
  multiple = true,
  layout = 'grid',
  enableImageEditing = true,
  onUpload,
  onDelete,
  onEdit,
  className,
}: FileGalleryProps) {
  const [files, setFiles] = React.useState<File[]>(initialFiles)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [editingFile, setEditingFile] = React.useState<File | null>(null)
  const fileMetadata = useFileMetadata(files)
  
  // Set up file upload hook
  const [uploadState, uploadActions] = useFileUpload({
    endpoint,
    maxSize,
    allowedTypes,
    multiple: multiple && files.length < maxFiles,
    onSuccess: (_, uploadedFiles) => {
      const newFiles = [...files, ...uploadedFiles].slice(0, maxFiles)
      setFiles(newFiles)
      onUpload?.(uploadedFiles)
    },
  })
  
  // Handle file selection via click
  const handleFileSelect = () => {
    if (files.length >= maxFiles && multiple) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }
    
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = multiple && files.length < maxFiles
    input.accept = allowedTypes.join(',')
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files?.length) {
        // Validate files
        const filesToUpload: File[] = []
        for (let i = 0; i < target.files.length; i++) {
          const file = target.files[i]
          const validationResult = validateFile(file, { maxSize, allowedTypes })
          
          if (validationResult === true) {
            filesToUpload.push(file)
          } else {
            alert(`Error with file ${file.name}: ${validationResult}`)
          }
          
          // Check if we've reached the maximum
          if (files.length + filesToUpload.length >= maxFiles) {
            break
          }
        }
        
        if (filesToUpload.length > 0) {
          uploadActions.selectFiles(filesToUpload)
          uploadActions.upload()
        }
      }
    }
    
    input.click()
  }
  
  // Handle file deletion
  const handleDelete = (file: File) => {
    if (selectedFile === file) {
      setSelectedFile(null)
    }
    if (editingFile === file) {
      setEditingFile(null)
    }
    
    setFiles(files.filter(f => f !== file))
    onDelete?.(file)
  }
  
  // Handle file download
  const handleDownload = (file: File) => {
    downloadFile(file, file.name)
  }
  
  // Handle edited file save
  const handleEditSave = (oldFile: File, newFile: File) => {
    setFiles(files.map(f => f === oldFile ? newFile : f))
    setEditingFile(null)
    setSelectedFile(newFile)
    onEdit?.(oldFile, newFile)
  }
  
  return (
    <div className={className}>
      {/* Upload section */}
      <div 
        {...uploadActions.getDropZoneProps()}
        className={cn(
          "mb-4 flex items-center justify-center rounded-lg border-2 border-dashed p-4",
          "hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800/30"
        )}
      >
        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium">
            Drop files here or{' '}
            <span 
              className="cursor-pointer text-primary hover:underline" 
              onClick={handleFileSelect}
            >
              browse
            </span>
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {multiple 
              ? `Up to ${maxFiles} files, max ${maxSize / (1024 * 1024)}MB each` 
              : `Max ${maxSize / (1024 * 1024)}MB`
            }
          </p>
        </div>
      </div>
      
      {/* Upload progress */}
      {uploadState.status === 'uploading' && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Uploading files...</span>
            <span className="text-sm">{Math.round(uploadState.progress)}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div 
              className="h-full bg-primary transition-all" 
              style={{ width: `${uploadState.progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Error message */}
      {uploadState.status === 'error' && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/10">
          {uploadState.error}
        </div>
      )}
      
      {/* File listing */}
      {files.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium">
            Files ({files.length}/{maxFiles})
          </h3>
          
          {layout === 'grid' ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {fileMetadata.map((metadata, index) => (
                <div 
                  key={`${metadata.file.name}-${index}`}
                  className="relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-800"
                >
                  {/* Preview thumbnail */}
                  <div 
                    className="flex h-32 cursor-pointer items-center justify-center bg-gray-100 dark:bg-gray-900"
                    onClick={() => setSelectedFile(metadata.file)}
                  >
                    {metadata.isImage ? (
                      <img 
                        src={metadata.previewUrl}
                        alt={metadata.file.name}
                        className="max-h-full max-w-full object-cover"
                      />
                    ) : (
                      <FileIcon file={metadata.file} />
                    )}
                  </div>
                  
                  {/* File info */}
                  <div className="flex flex-1 flex-col p-2">
                    <h4 className="line-clamp-1 font-medium" title={metadata.file.name}>
                      {metadata.file.name}
                    </h4>
                    <p className="mt-1 text-xs text-gray-500">
                      {metadata.formattedSize}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-end border-t p-2">
                    {enableImageEditing && metadata.isImage && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingFile(metadata.file)}
                        className="h-8 w-8"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDownload(metadata.file)}
                      className="h-8 w-8"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(metadata.file)}
                      className="h-8 w-8"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y rounded-md border">
              {fileMetadata.map((metadata, index) => (
                <div 
                  key={`${metadata.file.name}-${index}`}
                  className="flex items-center justify-between p-3"
                >
                  {/* File info */}
                  <div 
                    className="flex flex-1 cursor-pointer items-center space-x-3"
                    onClick={() => setSelectedFile(metadata.file)}
                  >
                    <div className="h-10 w-10 flex-shrink-0">
                      {metadata.isImage ? (
                        <img 
                          src={metadata.previewUrl}
                          alt={metadata.file.name}
                          className="h-full w-full rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                          <FileIcon file={metadata.file} size="small" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-medium" title={metadata.file.name}>
                        {metadata.file.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {metadata.formattedSize} • {metadata.mimeType}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="ml-4 flex space-x-1">
                    {enableImageEditing && metadata.isImage && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingFile(metadata.file)}
                        className="h-8 w-8"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDownload(metadata.file)}
                      className="h-8 w-8"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(metadata.file)}
                      className="h-8 w-8"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* File preview modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white dark:bg-gray-900">
            <FileViewer 
              file={selectedFile}
              className="max-h-[90vh]"
              onClose={() => setSelectedFile(null)}
              onDownload={handleDownload}
            />
          </div>
        </div>
      )}
      
      {/* Image editor modal */}
      {editingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white dark:bg-gray-900">
            <ImageEditorPreview 
              file={editingFile}
              className="max-h-[90vh]"
              onClose={() => setEditingFile(null)}
              onSave={(newFile) => handleEditSave(editingFile, newFile)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Image gallery component
 */
export function ImageGallery({
  endpoint,
  initialFiles = [],
  maxFiles = 10,
  maxSize = 2 * 1024 * 1024, // 2MB default
  layout = 'grid',
  enableImageEditing = true,
  onUpload,
  onDelete,
  onEdit,
  className,
}: Omit<FileGalleryProps, 'allowedTypes' | 'multiple'>) {
  return (
    <FileGallery
      endpoint={endpoint}
      initialFiles={initialFiles}
      maxFiles={maxFiles}
      maxSize={maxSize}
      allowedTypes={FILE_TYPES.IMAGES}
      multiple={true}
      layout={layout}
      enableImageEditing={enableImageEditing}
      onUpload={onUpload}
      onDelete={onDelete}
      onEdit={onEdit}
      className={className}
    />
  )
}

/**
 * Document gallery component
 */
export function DocumentGallery({
  endpoint,
  initialFiles = [],
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  layout = 'list',
  onUpload,
  onDelete,
  className,
}: Omit<FileGalleryProps, 'allowedTypes' | 'multiple' | 'enableImageEditing' | 'onEdit'>) {
  return (
    <FileGallery
      endpoint={endpoint}
      initialFiles={initialFiles}
      maxFiles={maxFiles}
      maxSize={maxSize}
      allowedTypes={FILE_TYPES.DOCUMENTS}
      multiple={true}
      layout={layout}
      enableImageEditing={false}
      onUpload={onUpload}
      onDelete={onDelete}
      className={className}
    />
  )
}
