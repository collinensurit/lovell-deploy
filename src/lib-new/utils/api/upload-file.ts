import { ApiResponse, RequestError } from '@/lib/types'
import { ERROR_MESSAGES } from '@/constants'

/**
 * Uploads a file to the server with progress tracking
 * 
 * @param file - The file to upload
 * @param onProgress - Optional callback for upload progress updates
 * @returns Promise resolving to the upload response
 */
export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<{ url: string }>> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100
        onProgress(progress)
      }
    })

    // Handle successful response
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject({
          code: xhr.status.toString(),
          message: ERROR_MESSAGES.SERVER_ERROR,
        } as RequestError)
      }
    })

    // Handle network/request errors
    xhr.addEventListener('error', () => {
      reject({
        code: 'UPLOAD_ERROR',
        message: 'File upload failed',
      } as RequestError)
    })

    xhr.open('POST', '/api/files/upload')
    xhr.send(formData)
  })
}
