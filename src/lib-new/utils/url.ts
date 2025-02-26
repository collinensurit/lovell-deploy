'use client'

/**
 * Joins URL segments ensuring proper slash handling
 * 
 * @param segments - URL segments to join
 * @returns Properly joined URL
 */
export function joinUrlSegments(...segments: string[]): string {
  return segments
    .map(segment => segment.trim().replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/')
}

/**
 * Builds a URL with query parameters
 * 
 * @param baseUrl - Base URL
 * @param params - Query parameters object
 * @returns URL with query string
 */
export function buildUrl(baseUrl: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl
  }
  
  const url = new URL(baseUrl, window.location.origin)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value))
    }
  })
  
  return url.toString()
}

/**
 * Extracts query parameters from a URL
 * 
 * @param url - URL to parse
 * @returns Object containing query parameters
 */
export function getQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  try {
    const urlObj = new URL(url, window.location.origin)
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value
    })
  } catch (error) {
    console.error('Error parsing URL:', error)
  }
  return params
}

/**
 * Get the base domain from a URL
 * 
 * @param url - URL to extract domain from
 * @returns Base domain
 */
export function getBaseDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname
    const parts = hostname.split('.')
    
    if (parts.length > 2) {
      // Handle domains like sub.example.com
      const topLevelDomainParts = 2
      return parts.slice(-topLevelDomainParts).join('.')
    }
    
    return hostname
  } catch (error) {
    console.error('Error extracting domain:', error)
    return ''
  }
}

/**
 * Checks if a URL is an absolute URL
 * 
 * @param url - URL to check
 * @returns Whether the URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^(?:[a-z+]+:)?\/\//i.test(url)
}

/**
 * Converts a relative path to an absolute URL
 * 
 * @param relativePath - Relative path
 * @param base - Base URL (default: window.location.origin)
 * @returns Absolute URL
 */
export function relativeToAbsoluteUrl(
  relativePath: string, 
  base = window.location.origin
): string {
  if (isAbsoluteUrl(relativePath)) {
    return relativePath
  }
  
  return new URL(relativePath, base).toString()
}
