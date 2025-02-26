'use client'

/**
 * Copy text to clipboard using the Clipboard API with fallback
 * 
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves when the text is copied
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern Clipboard API approach (secure contexts only)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    
    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  } catch (error) {
    console.error('Failed to copy text to clipboard:', error)
    return false
  }
}

/**
 * Read text from clipboard
 * Only works in secure contexts and with user permission
 * 
 * @returns Promise that resolves with the clipboard text
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return await navigator.clipboard.readText()
    }
    return null
  } catch (error) {
    console.error('Failed to read from clipboard:', error)
    return null
  }
}

/**
 * Check if the Clipboard API is available
 * 
 * @returns Whether the Clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return !!(navigator.clipboard && window.isSecureContext)
}
