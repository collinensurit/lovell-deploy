import { ApiResponse } from '@/types'
import { ERROR_MESSAGES } from '@/constants'

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const { params, ...fetchOptions } = options
    const url = new URL(endpoint, window.location.origin)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw {
        code: response.status,
        message: data.message || ERROR_MESSAGES.SERVER_ERROR,
      }
    }

    return data
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
      }
    }
    throw error
  }
}

export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<{ url: string }>> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100
        onProgress(progress)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject({
          code: xhr.status,
          message: ERROR_MESSAGES.SERVER_ERROR,
        })
      }
    })

    xhr.addEventListener('error', () => {
      reject({
        code: 'UPLOAD_ERROR',
        message: 'File upload failed',
      })
    })

    xhr.open('POST', '/api/files/upload')
    xhr.send(formData)
  })
}

export function handleApiError(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const { code, message } = error as { code?: string; message?: string }

    switch (code) {
      case '401':
        return ERROR_MESSAGES.UNAUTHORIZED
      case '403':
        return ERROR_MESSAGES.FORBIDDEN
      case '404':
        return ERROR_MESSAGES.NOT_FOUND
      case 'VALIDATION_ERROR':
        return ERROR_MESSAGES.VALIDATION
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection.'
      default:
        return message || ERROR_MESSAGES.SERVER_ERROR
    }
  }

  return ERROR_MESSAGES.SERVER_ERROR
}
