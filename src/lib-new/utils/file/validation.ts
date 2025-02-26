/**
 * File validation utilities
 */

import { validateFile, FileValidationOptions } from './upload'
import { FILE_TYPES, FILE_SIZE_LIMITS, getFileExtension, getMimeTypeFromExtension } from './types'

/**
 * Validates a file's MIME type
 * 
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns true if valid, false if invalid
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  // Use the more comprehensive validateFile function
  return validateFile(file, { allowedTypes }) === true
}

/**
 * Validates a file's size
 * 
 * @param file - The file to validate
 * @param maxSize - Maximum allowed size in bytes
 * @returns true if valid, false if invalid
 */
export function validateFileSize(file: File, maxSize: number): boolean {
  // Use the more comprehensive validateFile function
  return validateFile(file, { maxSize }) === true
}

/**
 * Validates a file's extension
 * 
 * @param filename - The filename to validate
 * @param allowedExtensions - Array of allowed extensions
 * @returns true if valid, false if invalid
 */
export function validateFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const extension = getFileExtension(filename).toLowerCase()
  return allowedExtensions.includes(extension)
}

/**
 * Checks if a file is an image
 * 
 * @param file - The file to check
 * @returns true if the file is an image
 */
export function isImageFile(file: File): boolean {
  return FILE_TYPES.IMAGES.includes(file.type)
}

/**
 * Checks if a file is a document
 * 
 * @param file - The file to check
 * @returns true if the file is a document
 */
export function isDocumentFile(file: File): boolean {
  return FILE_TYPES.DOCUMENTS.includes(file.type)
}

/**
 * Checks if a file is audio
 * 
 * @param file - The file to check
 * @returns true if the file is audio
 */
export function isAudioFile(file: File): boolean {
  return FILE_TYPES.AUDIO.includes(file.type)
}

/**
 * Checks if a file is video
 * 
 * @param file - The file to check
 * @returns true if the file is video
 */
export function isVideoFile(file: File): boolean {
  return FILE_TYPES.VIDEO.includes(file.type)
}

/**
 * Get appropriate validation options based on file type category
 * 
 * @param type - File type category ('image', 'document', 'video', 'audio')
 * @returns Validation options for the specified type
 */
export function getValidationOptionsForType(type: 'image' | 'document' | 'video' | 'audio'): FileValidationOptions {
  switch (type) {
    case 'image':
      return {
        maxSize: FILE_SIZE_LIMITS.MEDIUM, // 5MB for images
        allowedTypes: FILE_TYPES.IMAGES,
      }
    case 'document':
      return {
        maxSize: FILE_SIZE_LIMITS.MEDIUM, // 5MB for documents
        allowedTypes: FILE_TYPES.DOCUMENTS,
      }
    case 'video':
      return {
        maxSize: FILE_SIZE_LIMITS.LARGE, // 10MB for videos
        allowedTypes: FILE_TYPES.VIDEO,
      }
    case 'audio':
      return {
        maxSize: FILE_SIZE_LIMITS.MEDIUM, // 5MB for audio
        allowedTypes: FILE_TYPES.AUDIO,
      }
    default:
      return {}
  }
}
