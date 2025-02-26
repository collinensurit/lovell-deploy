'use client'

import { useEffect, useState } from 'react'

/**
 * Standard breakpoints for responsive design
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export type Breakpoint = keyof typeof BREAKPOINTS

/**
 * Generate a media query string for a min-width breakpoint
 * 
 * @param breakpoint - Breakpoint key or custom pixel value
 * @returns Media query string
 */
export function getMinWidthQuery(breakpoint: Breakpoint | number): string {
  const width = typeof breakpoint === 'number' 
    ? breakpoint 
    : BREAKPOINTS[breakpoint]
  
  return `(min-width: ${width}px)`
}

/**
 * Generate a media query string for a max-width breakpoint
 * 
 * @param breakpoint - Breakpoint key or custom pixel value
 * @returns Media query string
 */
export function getMaxWidthQuery(breakpoint: Breakpoint | number): string {
  const width = typeof breakpoint === 'number'
    ? breakpoint
    : BREAKPOINTS[breakpoint]
  
  return `(max-width: ${width - 0.1}px)`
}

/**
 * Generate a media query string for a width range between two breakpoints
 * 
 * @param minBreakpoint - Minimum breakpoint key or custom pixel value
 * @param maxBreakpoint - Maximum breakpoint key or custom pixel value
 * @returns Media query string
 */
export function getBetweenWidthQuery(
  minBreakpoint: Breakpoint | number,
  maxBreakpoint: Breakpoint | number
): string {
  const minWidth = typeof minBreakpoint === 'number'
    ? minBreakpoint
    : BREAKPOINTS[minBreakpoint]
  
  const maxWidth = typeof maxBreakpoint === 'number'
    ? maxBreakpoint
    : BREAKPOINTS[maxBreakpoint]
  
  return `(min-width: ${minWidth}px) and (max-width: ${maxWidth - 0.1}px)`
}

/**
 * React hook to check if a media query matches
 * 
 * @param query - Media query string
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false on the server
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    // Check initial match on client side
    const media = window.matchMedia(query)
    setMatches(media.matches)
    
    // Setup listener for changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }
    
    // Add listener
    media.addEventListener('change', listener)
    
    // Cleanup
    return () => media.removeEventListener('change', listener)
  }, [query])
  
  return matches
}

/**
 * React hook to check if the viewport is at least a certain breakpoint
 * 
 * @param breakpoint - Breakpoint to check
 * @returns Whether the viewport is at least the specified breakpoint
 */
export function useMinWidth(breakpoint: Breakpoint | number): boolean {
  return useMediaQuery(getMinWidthQuery(breakpoint))
}

/**
 * React hook to check if the viewport is at most a certain breakpoint
 * 
 * @param breakpoint - Breakpoint to check
 * @returns Whether the viewport is at most the specified breakpoint
 */
export function useMaxWidth(breakpoint: Breakpoint | number): boolean {
  return useMediaQuery(getMaxWidthQuery(breakpoint))
}

/**
 * React hook to check if the viewport is between two breakpoints
 * 
 * @param minBreakpoint - Minimum breakpoint to check
 * @param maxBreakpoint - Maximum breakpoint to check
 * @returns Whether the viewport is between the specified breakpoints
 */
export function useBetweenWidth(
  minBreakpoint: Breakpoint | number,
  maxBreakpoint: Breakpoint | number
): boolean {
  return useMediaQuery(getBetweenWidthQuery(minBreakpoint, maxBreakpoint))
}

/**
 * React hook to get the current active breakpoint
 * 
 * @returns The current active breakpoint
 */
export function useActiveBreakpoint(): Breakpoint {
  const is2xl = useMinWidth('2xl')
  const isXl = useMinWidth('xl')
  const isLg = useMinWidth('lg')
  const isMd = useMinWidth('md')
  const isSm = useMinWidth('sm')
  
  if (is2xl) return '2xl'
  if (isXl) return 'xl'
  if (isLg) return 'lg'
  if (isMd) return 'md'
  if (isSm) return 'sm'
  return 'xs'
}
