'use client'

import * as React from 'react'
import { useController, UseControllerProps, FieldValues, FieldPath } from 'react-hook-form'
import { FileUpload, FileUploadProps } from './file-upload'
import { DropZone, DropZoneProps } from './drop-zone'
import { useFileMetadata } from '@/lib-new/hooks/use-file-metadata'

/**
 * Props for FormFileUpload component
 */
export type FormFileUploadProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<FileUploadProps, 'onSuccess' | 'onError'> & 
  UseControllerProps<TFieldValues, TName> & {
  /**
   * Error message
   */
  error?: string
  
  /**
   * Helper text
   */
  helperText?: string
  
  /**
   * Label text
   */
  label?: string
  
  /**
   * Whether the field is required
   */
  required?: boolean
}

/**
 * File upload component integrated with React Hook Form
 */
export function FormFileUpload<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  error,
  helperText,
  label,
  required,
  ...uploadProps
}: FormFileUploadProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error: fieldError }
  } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister
  })
  
  // Handle successful upload
  const handleSuccess = (data: any, files: File[]) => {
    field.onChange(uploadProps.multiple ? files : files[0])
  }
  
  // Handle upload error
  const handleError = (errorMessage: string) => {
    // We don't set form errors here because that's handled by validation
    console.error(`Upload error for field ${name}:`, errorMessage)
  }
  
  // Display error message from form validation or passed in directly
  const errorMessage = fieldError?.message as string | undefined || error
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <FileUpload
        {...uploadProps}
        onSuccess={handleSuccess}
        onError={handleError}
        className={`${errorMessage ? 'border-red-500' : ''} ${uploadProps.className || ''}`}
      />
      
      {helperText && !errorMessage && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
      
      {errorMessage && (
        <p className="mt-1 text-xs text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

/**
 * Props for FormDropZone component
 */
export type FormDropZoneProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<DropZoneProps, 'onFilesSelected'> & 
  UseControllerProps<TFieldValues, TName> & {
  /**
   * Error message
   */
  error?: string
  
  /**
   * Helper text
   */
  helperText?: string
  
  /**
   * Label text
   */
  label?: string
  
  /**
   * Whether the field is required
   */
  required?: boolean
}

/**
 * Drop zone component integrated with React Hook Form
 */
export function FormDropZone<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  error,
  helperText,
  label,
  required,
  ...dropZoneProps
}: FormDropZoneProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error: fieldError }
  } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister
  })
  
  // Handle files selected
  const handleFilesSelected = (files: File[]) => {
    field.onChange(dropZoneProps.multiple ? files : files[0])
  }
  
  // Display error message from form validation or passed in directly
  const errorMessage = fieldError?.message as string | undefined || error
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <DropZone
        {...dropZoneProps}
        onFilesSelected={handleFilesSelected}
        className={`${errorMessage ? 'border-red-500' : ''} ${dropZoneProps.className || ''}`}
      />
      
      {helperText && !errorMessage && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
      
      {errorMessage && (
        <p className="mt-1 text-xs text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

/**
 * Props for MultiFilePreview component
 */
interface MultiFilePreviewProps {
  /**
   * Files to preview
   */
  files: File[] | null | undefined
  
  /**
   * Called when a file is removed
   */
  onRemove?: (index: number) => void
  
  /**
   * Whether the component is disabled
   */
  disabled?: boolean
  
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Preview component for multiple files that can be used with form libraries
 */
export function MultiFilePreview({
  files,
  onRemove,
  disabled = false,
  className
}: MultiFilePreviewProps) {
  const metadata = useFileMetadata(files)
  
  if (!metadata.length) return null
  
  return (
    <div className={className}>
      <ul className="mt-2 divide-y rounded-md border">
        {metadata.map((file, index) => (
          <li key={`${file.file.name}-${index}`} className="flex items-center justify-between py-2 px-4 text-sm">
            <div className="flex items-center space-x-2">
              {file.isImage && file.previewUrl ? (
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                  <img 
                    src={file.previewUrl} 
                    alt={file.file.name}
                    className="h-full w-full object-cover" 
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                  <span className="text-xs uppercase">{file.extension}</span>
                </div>
              )}
              <div>
                <p className="truncate font-medium">{file.file.name}</p>
                <p className="text-xs text-gray-500">{file.formattedSize}</p>
              </div>
            </div>
            
            {onRemove && !disabled && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
