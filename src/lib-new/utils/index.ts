'use client'

// Re-export with namespace to avoid conflicts
import * as apiUtils from './api'
import * as authUtils from './auth'
import * as dateUtils from './date'
import * as fileUtils from './file'
import * as formatUtils from './format'
import * as stringUtils from './string'
import * as validationUtils from './validation'
import * as metadataUtils from './metadata'
import * as clipboardUtils from './clipboard'

// Export namespaces
export { 
  apiUtils,
  authUtils,
  dateUtils,
  fileUtils,
  formatUtils,
  stringUtils,
  validationUtils,
  metadataUtils,
  clipboardUtils
}

// Direct exports for utilities without conflicts
export * from './analytics'
export * from './app-shortcuts'
export * from './cache'
export * from './cn'
export * from './color'
export * from './error-handling'
export * from './events'
export * from './form'
export * from './keyboard'
export * from './logging'
export * from './media-query'
export * from './notification'
export * from './responsive'
export * from './search'
export * from './storage'
export * from './theme'
export * from './url'
export * from './window-state'
