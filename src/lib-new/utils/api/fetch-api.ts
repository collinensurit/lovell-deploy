import { ApiResponse, RequestError } from '@/lib/types'
import { ERROR_MESSAGES } from '@/constants'

/**
 * Options for API requests
 */
export interface FetchOptions extends RequestInit {
  /** Query parameters to append to the URL */
  params?: Record<string, string>;
}

/**
 * Fetches data from the API with proper error handling
 * 
 * @param endpoint - The API endpoint to fetch from
 * @param options - Optional fetch configuration
 * @returns Promise resolving to the API response
 */
export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const { params, ...fetchOptions } = options
    const url = new URL(endpoint, window.location.origin)

    // Add query parameters if provided
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
        code: response.status.toString(),
        message: data.message || ERROR_MESSAGES.SERVER_ERROR,
      } as RequestError
    }

    return data
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
      } as RequestError
    }
    throw error
  }
}
