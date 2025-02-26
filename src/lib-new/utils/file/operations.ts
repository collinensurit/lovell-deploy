'use client'

/**
 * Download a file from a blob or data URL
 * 
 * @param data - The file data as a Blob, File, or URL
 * @param filename - The name to save the file as
 */
export function downloadFile(data: Blob | File | string, filename: string): void {
  const blob = typeof data === 'string' ? dataURLtoBlob(data) : data
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the object URL
  URL.revokeObjectURL(url)
}

/**
 * Convert a data URL to a Blob
 * 
 * @param dataURL - The data URL to convert
 * @returns A Blob representation of the data
 */
export function dataURLtoBlob(dataURL: string): Blob {
  // Split the data URL to get the content type and base64 data
  const parts = dataURL.split(';base64,')
  
  if (parts.length !== 2) {
    throw new Error('Invalid data URL format')
  }
  
  const contentType = parts[0].split(':')[1]
  const byteString = atob(parts[1])
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const uint8Array = new Uint8Array(arrayBuffer)
  
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i)
  }
  
  return new Blob([arrayBuffer], { type: contentType })
}

/**
 * Read a file as a data URL
 * 
 * @param file - The file to read
 * @returns Promise resolving to the file contents as a data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as data URL'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Read a file as text
 * 
 * @param file - The file to read
 * @returns Promise resolving to the file contents as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as text'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }
    
    reader.readAsText(file)
  })
}

/**
 * Read a file as an array buffer
 * 
 * @param file - The file to read
 * @returns Promise resolving to the file contents as an array buffer
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as array buffer'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }
    
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Convert a blob to a file
 * 
 * @param blob - The blob to convert
 * @param filename - The name for the new file
 * @param options - Options for the new file
 * @returns A File object
 */
export function blobToFile(
  blob: Blob, 
  filename: string, 
  options?: { type?: string; lastModified?: number }
): File {
  return new File(
    [blob], 
    filename, 
    { 
      type: options?.type || blob.type, 
      lastModified: options?.lastModified || Date.now()
    }
  )
}

/**
 * Create a file from a string
 * 
 * @param content - The string content for the file
 * @param filename - The name for the new file
 * @param options - Options for the new file
 * @returns A File object
 */
export function createFileFromString(
  content: string, 
  filename: string, 
  options?: { type?: string; lastModified?: number }
): File {
  const blob = new Blob([content], { type: options?.type || 'text/plain' })
  return blobToFile(blob, filename, options)
}

/**
 * Safely copy a file to the clipboard
 * 
 * @param text - The text to copy to the clipboard
 * @returns Promise that resolves when the copy is complete
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    // Try to use the modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    
    // Make the textarea invisible
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (!successful) {
      throw new Error('Failed to copy text to clipboard')
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    throw error
  }
}

/**
 * Get a file size as a human-readable string
 * 
 * @param bytes - The file size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Extract the contents of a zip file
 * 
 * @param file - The zip file to extract
 * @returns Promise resolving to an array of extracted files
 */
export async function extractZip(file: File): Promise<File[]> {
  // This is a placeholder implementation
  // In a real implementation, you would use a library like JSZip
  
  // For example:
  // const JSZip = await import('jszip')
  // const zip = new JSZip()
  // const contents = await zip.loadAsync(file)
  // const files: File[] = []
  // 
  // for (const filename in contents.files) {
  //   const zipEntry = contents.files[filename]
  //   if (!zipEntry.dir) {
  //     const blob = await zipEntry.async('blob')
  //     files.push(blobToFile(blob, filename))
  //   }
  // }
  // 
  // return files
  
  console.warn('extractZip is a placeholder implementation')
  return [file]
}

/**
 * Read a stream as a blob
 * 
 * @param stream - The stream to read
 * @returns Promise resolving to a blob
 */
export async function streamToBlob(stream: ReadableStream): Promise<Blob> {
  const response = new Response(stream)
  return await response.blob()
}
