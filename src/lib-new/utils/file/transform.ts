'use client'

/**
 * Options for image resizing
 */
export interface ImageResizeOptions {
  /**
   * Maximum width of the resized image
   */
  maxWidth?: number
  
  /**
   * Maximum height of the resized image
   */
  maxHeight?: number
  
  /**
   * Output quality (0-1) for JPEG and WebP
   */
  quality?: number
  
  /**
   * Output format
   */
  format?: 'jpeg' | 'png' | 'webp'
  
  /**
   * Whether to maintain aspect ratio
   */
  maintainAspectRatio?: boolean
}

/**
 * Resize an image and return as a Blob
 * 
 * @param imageFile - Image file to resize
 * @param options - Resize options
 * @returns Promise resolving to resized image as Blob
 */
export async function resizeImage(
  imageFile: File | Blob,
  options: ImageResizeOptions = {}
): Promise<Blob> {
  const {
    maxWidth,
    maxHeight,
    quality = 0.8,
    format = 'jpeg',
    maintainAspectRatio = true
  } = options
  
  return new Promise((resolve, reject) => {
    // Create image element to load the file
    const img = new Image()
    img.onload = () => {
      // Calculate dimensions
      let width = img.width
      let height = img.height
      
      if (maxWidth && width > maxWidth) {
        const ratio = maxWidth / width
        width = maxWidth
        height = maintainAspectRatio ? Math.round(height * ratio) : height
      }
      
      if (maxHeight && height > maxHeight) {
        const ratio = maxHeight / height
        height = maxHeight
        width = maintainAspectRatio ? Math.round(width * ratio) : width
      }
      
      // Create canvas for resizing
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      
      // Draw and resize
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to desired format
      let mimeType: string
      switch (format) {
        case 'png':
          mimeType = 'image/png'
          break
        case 'webp':
          mimeType = 'image/webp'
          break
        case 'jpeg':
        default:
          mimeType = 'image/jpeg'
          break
      }
      
      // Get blob from canvas
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert canvas to blob'))
          }
        },
        mimeType,
        quality
      )
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    // Read the file
    const url = URL.createObjectURL(imageFile)
    img.src = url
    
    // Clean up object URL after loading
    img.onload = function() {
      URL.revokeObjectURL(url)
      
      // Now handle the rest of the onload logic
      const width = img.width
      const height = img.height
      
      // Calculate new dimensions
      let newWidth = width
      let newHeight = height
      
      if (maxWidth && width > maxWidth) {
        const ratio = maxWidth / width
        newWidth = maxWidth
        newHeight = maintainAspectRatio ? Math.round(height * ratio) : height
      }
      
      if (maxHeight && newHeight > maxHeight) {
        const ratio = maxHeight / newHeight
        newHeight = maxHeight
        newWidth = maintainAspectRatio ? Math.round(newWidth * ratio) : newWidth
      }
      
      // Create canvas for resizing
      const canvas = document.createElement('canvas')
      canvas.width = newWidth
      canvas.height = newHeight
      
      // Draw and resize
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      ctx.drawImage(img, 0, 0, newWidth, newHeight)
      
      // Convert to desired format
      let mimeType: string
      switch (format) {
        case 'png':
          mimeType = 'image/png'
          break
        case 'webp':
          mimeType = 'image/webp'
          break
        case 'jpeg':
        default:
          mimeType = 'image/jpeg'
          break
      }
      
      // Get blob from canvas
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert canvas to blob'))
          }
        },
        mimeType,
        quality
      )
    }
  })
}

/**
 * Options for image cropping
 */
export interface ImageCropOptions {
  /**
   * X coordinate of the crop start
   */
  x: number
  
  /**
   * Y coordinate of the crop start
   */
  y: number
  
  /**
   * Width of the crop
   */
  width: number
  
  /**
   * Height of the crop
   */
  height: number
  
  /**
   * Output quality (0-1) for JPEG and WebP
   */
  quality?: number
  
  /**
   * Output format
   */
  format?: 'jpeg' | 'png' | 'webp'
}

/**
 * Crop an image and return as a Blob
 * 
 * @param imageFile - Image file to crop
 * @param options - Crop options
 * @returns Promise resolving to cropped image as Blob
 */
export async function cropImage(
  imageFile: File | Blob,
  options: ImageCropOptions
): Promise<Blob> {
  const {
    x,
    y,
    width,
    height,
    quality = 0.8,
    format = 'jpeg'
  } = options
  
  return new Promise((resolve, reject) => {
    // Create image element to load the file
    const img = new Image()
    
    // Set up onload handler
    img.onload = () => {
      // Create canvas for cropping
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      
      // Draw and crop
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height)
      
      // Convert to desired format
      let mimeType: string
      switch (format) {
        case 'png':
          mimeType = 'image/png'
          break
        case 'webp':
          mimeType = 'image/webp'
          break
        case 'jpeg':
        default:
          mimeType = 'image/jpeg'
          break
      }
      
      // Get blob from canvas
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert canvas to blob'))
          }
        },
        mimeType,
        quality
      )
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    // Read the file
    const url = URL.createObjectURL(imageFile)
    img.src = url
    
    // Clean up object URL after loading
    img.onload = function() {
      URL.revokeObjectURL(url)
      
      // Create canvas for cropping
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      
      // Draw and crop
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height)
      
      // Convert to desired format
      let mimeType: string
      switch (format) {
        case 'png':
          mimeType = 'image/png'
          break
        case 'webp':
          mimeType = 'image/webp'
          break
        case 'jpeg':
        default:
          mimeType = 'image/jpeg'
          break
      }
      
      // Get blob from canvas
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert canvas to blob'))
          }
        },
        mimeType,
        quality
      )
    }
  })
}

/**
 * Convert a file from one format to another
 * Currently supports image conversions
 * 
 * @param file - File to convert
 * @param targetFormat - Target format to convert to
 * @param quality - Quality for lossy formats (0-1)
 * @returns Promise resolving to converted file as Blob
 */
export async function convertFileFormat(
  file: File | Blob,
  targetFormat: 'jpeg' | 'png' | 'webp',
  quality = 0.8
): Promise<Blob> {
  // For now, this only supports image conversion
  // We're using the resize function but maintaining original dimensions
  return resizeImage(file, {
    format: targetFormat,
    quality,
    maintainAspectRatio: true
  })
}
