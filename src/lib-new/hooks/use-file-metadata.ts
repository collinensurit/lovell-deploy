'use client'

import * as React from 'react'
import { getFileExtension, getMimeTypeFromExtension } from '../utils/file/types'
import { formatFileSize } from '../utils/file/operations'
import { FILE_TYPES } from '../utils/file/types'

/**
 * File metadata including type information and previews
 */
export interface FileMetadata {
  /**
   * Original File object
   */
  file: File
  
  /**
   * File extension (lowercase, without the dot)
   */
  extension: string
  
  /**
   * MIME type of the file
   */
  mimeType: string
  
  /**
   * Formatted file size (e.g., "1.2 MB")
   */
  formattedSize: string
  
  /**
   * File size in bytes
   */
  sizeInBytes: number
  
  /**
   * Whether the file is an image
   */
  isImage: boolean
  
  /**
   * Whether the file is a document
   */
  isDocument: boolean
  
  /**
   * Whether the file is an audio file
   */
  isAudio: boolean
  
  /**
   * Whether the file is a video file
   */
  isVideo: boolean
  
  /**
   * Whether the file is an archive
   */
  isArchive: boolean
  
  /**
   * URL to use for preview (for images)
   */
  previewUrl?: string
  
  /**
   * Last modified date
   */
  lastModified: Date
}

/**
 * Hook options for file metadata
 */
export interface UseFileMetadataOptions {
  /**
   * Whether to generate preview URLs for images
   */
  generatePreviews?: boolean
  
  /**
   * Whether to revoke URLs when the component unmounts
   */
  revokeOnUnmount?: boolean
}

/**
 * Hook to extract and manage file metadata
 * 
 * @param files - Files to extract metadata from
 * @param options - Hook options
 * @returns Array of file metadata objects
 */
export function useFileMetadata(
  files: File | File[] | null | undefined,
  options: UseFileMetadataOptions = {}
): FileMetadata[] {
  const { generatePreviews = true, revokeOnUnmount = true } = options
  
  // Track preview URLs for cleanup
  const previewUrlsRef = React.useRef<string[]>([])
  
  // Process files to extract metadata
  const metadata = React.useMemo(() => {
    if (!files) return []
    
    const fileArray = Array.isArray(files) ? files : [files]
    const newPreviewUrls: string[] = []
    
    const metadataArray = fileArray.map(file => {
      const extension = getFileExtension(file.name)
      const mimeType = file.type || getMimeTypeFromExtension(extension) || 'application/octet-stream'
      
      // Format file size
      let formattedSize = ''
      if (file.size < 1024) {
        formattedSize = `${file.size} B`
      } else if (file.size < 1024 * 1024) {
        formattedSize = `${(file.size / 1024).toFixed(1)} KB`
      } else if (file.size < 1024 * 1024 * 1024) {
        formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      } else {
        formattedSize = `${(file.size / (1024 * 1024 * 1024)).toFixed(1)} GB`
      }
      
      // Check file type categories
      const isImage = FILE_TYPES.IMAGES.includes(mimeType)
      const isDocument = FILE_TYPES.DOCUMENTS.includes(mimeType)
      const isAudio = FILE_TYPES.AUDIO.includes(mimeType)
      const isVideo = FILE_TYPES.VIDEO.includes(mimeType)
      const isArchive = FILE_TYPES.ARCHIVES.includes(mimeType)
      
      // Generate preview URL for images if enabled
      let previewUrl: string | undefined
      if (generatePreviews && isImage) {
        previewUrl = URL.createObjectURL(file)
        newPreviewUrls.push(previewUrl)
      }
      
      return {
        file,
        extension,
        mimeType,
        formattedSize,
        sizeInBytes: file.size,
        isImage,
        isDocument,
        isAudio,
        isVideo,
        isArchive,
        previewUrl,
        lastModified: new Date(file.lastModified)
      }
    })
    
    // Store new preview URLs for cleanup
    if (revokeOnUnmount) {
      // Revoke any previous URLs first
      previewUrlsRef.current.forEach(url => {
        URL.revokeObjectURL(url)
      })
      
      previewUrlsRef.current = newPreviewUrls
    }
    
    return metadataArray
  }, [files, generatePreviews, revokeOnUnmount])
  
  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (revokeOnUnmount) {
        previewUrlsRef.current.forEach(url => {
          URL.revokeObjectURL(url)
        })
        previewUrlsRef.current = []
      }
    }
  }, [revokeOnUnmount])
  
  return metadata
}

/**
 * Get file metadata for a single file
 * 
 * @param file - File to get metadata for
 * @param options - Options for metadata extraction
 * @returns File metadata object or null if no file provided
 */
export function getFileMetadata(
  file: File | null | undefined,
  options: UseFileMetadataOptions = {}
): FileMetadata | null {
  if (!file) return null
  
  const metadata = useFileMetadata(file, options)
  return metadata[0] || null
}
