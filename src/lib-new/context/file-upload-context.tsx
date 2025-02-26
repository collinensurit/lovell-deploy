'use client'

import * as React from 'react'
import { FILE_TYPES } from '../utils/file'

/**
 * Global file upload configuration
 */
export interface FileUploadConfig {
  /**
   * Default upload endpoint
   */
  defaultEndpoint: string
  
  /**
   * Default maximum file size (in bytes)
   */
  defaultMaxSize: number
  
  /**
   * Default allowed file types
   */
  defaultAllowedTypes: string[]
  
  /**
   * Whether to show notifications on upload events
   */
  showNotifications: boolean
  
  /**
   * Auto upload files when selected
   */
  autoUpload: boolean
  
  /**
   * Request headers to include with uploads
   */
  headers?: Record<string, string>
  
  /**
   * Base URL for file previews
   */
  previewBaseUrl?: string
  
  /**
   * Default upload timeout in milliseconds
   */
  timeout: number
}

/**
 * File upload context
 */
export interface FileUploadContextValue {
  /**
   * Current configuration
   */
  config: FileUploadConfig
  
  /**
   * Update configuration
   */
  updateConfig: (config: Partial<FileUploadConfig>) => void
  
  /**
   * Reset configuration to defaults
   */
  resetConfig: () => void
}

/**
 * Default file upload configuration
 */
const defaultConfig: FileUploadConfig = {
  defaultEndpoint: '/api/upload',
  defaultMaxSize: 5 * 1024 * 1024, // 5MB
  defaultAllowedTypes: [
    ...FILE_TYPES.IMAGES,
    ...FILE_TYPES.DOCUMENTS
  ],
  showNotifications: true,
  autoUpload: false,
  timeout: 30000, // 30 seconds
}

/**
 * File upload context for managing global settings
 */
export const FileUploadContext = React.createContext<FileUploadContextValue>({
  config: defaultConfig,
  updateConfig: () => {},
  resetConfig: () => {},
})

/**
 * Hook to use the file upload context
 */
export const useFileUploadContext = () => React.useContext(FileUploadContext)

/**
 * Props for FileUploadProvider
 */
export interface FileUploadProviderProps {
  /**
   * Initial configuration (will be merged with defaults)
   */
  initialConfig?: Partial<FileUploadConfig>
  
  /**
   * Children
   */
  children: React.ReactNode
}

/**
 * Provider for file upload context
 */
export function FileUploadProvider({
  initialConfig = {},
  children,
}: FileUploadProviderProps) {
  // Merge initial config with defaults
  const [config, setConfig] = React.useState<FileUploadConfig>({
    ...defaultConfig,
    ...initialConfig,
  })
  
  // Update configuration (partial)
  const updateConfig = React.useCallback((newConfig: Partial<FileUploadConfig>) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig,
    }))
  }, [])
  
  // Reset to defaults
  const resetConfig = React.useCallback(() => {
    setConfig(defaultConfig)
  }, [])
  
  // Context value
  const value = React.useMemo(() => ({
    config,
    updateConfig,
    resetConfig,
  }), [config, updateConfig, resetConfig])
  
  return (
    <FileUploadContext.Provider value={value}>
      {children}
    </FileUploadContext.Provider>
  )
}
