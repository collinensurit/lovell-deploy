'use client'

import * as React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { DropZone, DropZoneProps } from '../drop-zone'
import type { FileValidationOptions } from '@/lib-new/utils/file/validation'
import { useFileWatcher } from '@/lib-new/hooks'
import { X } from 'lucide-react'
import { FileViewer } from '../file-preview'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/**
 * Props for the FormFileUpload component
 */
export interface FormFileUploadProps extends Omit<DropZoneProps, 'onFilesSelected'> {
  /**
   * Name of the field in the form
   */
  name: string
  
  /**
   * Control from react-hook-form
   */
  control: any
  
  /**
   * Label for the field
   */
  label?: string
  
  /**
   * Description for the field
   */
  description?: string
  
  /**
   * Whether to show a preview of the selected files
   * @default true
   */
  showPreview?: boolean

  /**
   * Whether to show a remove button for each file
   * @default true
   */
  showRemoveButton?: boolean

  /**
   * Maximum number of files to allow
   * @default Infinity
   */
  maxFiles?: number
  
  /**
   * File validation options
   */
  validation?: FileValidationOptions
}

/**
 * Form file upload component that integrates with form libraries
 */
export function FormFileUpload({
  name,
  control,
  label,
  description,
  showPreview = true,
  showRemoveButton = true,
  maxFiles = Infinity,
  validationOptions,
  accept,
  multiple = false,
  disabled,
  className,
  ...props
}: FormFileUploadProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Use our custom file watcher hook to manage the files
        const { files, addFiles, removeFiles, clearFiles } = useFileWatcher({
          onChange: (newFiles) => {
            // Update the form value when files change
            field.onChange(multiple ? newFiles : newFiles[0] || null)
          },
        })
        
        // Handle file selection from the drop zone
        const handleFilesSelected = (selectedFiles: File[]) => {
          let filesToAdd = selectedFiles
          
          // Apply max files limit
          if (files.length + filesToAdd.length > maxFiles) {
            filesToAdd = filesToAdd.slice(0, maxFiles - files.length)
          }
          
          // If not multiple, replace existing files
          if (!multiple) {
            clearFiles()
          }
          
          addFiles(filesToAdd)
        }
        
        // Handle file removal
        const handleRemoveFile = (index: number) => {
          if (!multiple) {
            clearFiles()
            field.onChange(null)
          } else {
            const fileToRemove = files[index]
            removeFiles(fileToRemove ? `${fileToRemove.name}-${fileToRemove.size}-${fileToRemove.lastModified}` : '')
          }
        }
        
        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="space-y-4">
                <DropZone
                  multiple={multiple}
                  accept={accept}
                  validationOptions={validationOptions}
                  disabled={disabled || (files.length >= maxFiles && maxFiles !== Infinity)}
                  onFilesSelected={handleFilesSelected}
                  helpText={
                    files.length >= maxFiles && maxFiles !== Infinity
                      ? `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} reached`
                      : props.helpText
                  }
                  {...props}
                />
                
                {showPreview && files.length > 0 && (
                  <div className="space-y-2">
                    {multiple ? (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {files.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="relative rounded-md border">
                            <FileViewer
                              file={file}
                              showActions={false}
                              className="h-32"
                            />
                            {showRemoveButton && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6"
                                onClick={() => handleRemoveFile(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      files[0] && (
                        <div className="relative rounded-md border">
                          <FileViewer file={files[0]} />
                          {showRemoveButton && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-1 top-1 h-6 w-6"
                              onClick={() => handleRemoveFile(0)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
