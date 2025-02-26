/**
 * File-related UI components
 * 
 * This module exports all file-related UI components, including:
 * - File preview components for different file types
 * - File upload components with drag-and-drop support
 * - Form integration for file uploads
 */

// Export from the file-preview directory
export * from './file-preview'

// Export drop zone components
export * from './drop-zone'

// Export form integration components
export * from './form-file-upload'

// Export legacy components (to be migrated)
export * from './file-gallery'
export * from './file-upload'

// Export the old FilePreview component (to be deprecated)
import { FilePreview as LegacyFilePreview } from './file-preview'
export { LegacyFilePreview }
