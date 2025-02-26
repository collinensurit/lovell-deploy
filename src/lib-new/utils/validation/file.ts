/**
 * Validates if a file's MIME type is among the allowed types
 * 
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns Whether the file type is allowed
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Validates if a file's size is within the maximum allowed
 * 
 * @param file - The file to validate
 * @param maxSize - Maximum file size in bytes
 * @returns Whether the file size is within the allowed limit
 */
export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize
}
