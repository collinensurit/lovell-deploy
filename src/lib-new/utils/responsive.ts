'use client'

import { useState, useEffect, useCallback } from 'react'
import { BREAKPOINTS, Breakpoint, useActiveBreakpoint } from './media-query'
import { eventBus } from './events'

/**
 * Screen orientation type
 */
export type Orientation = 'portrait' | 'landscape'

/**
 * Device type based on screen size
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

/**
 * Responsive behavior mode
 */
export type ResponsiveMode = 'stacked' | 'side-by-side' | 'expanded'

/**
 * Responsive behavior options
 */
export interface ResponsiveBehaviorOptions {
  /**
   * Breakpoint at which to switch from mobile to tablet
   */
  tabletBreakpoint?: Breakpoint
  
  /**
   * Breakpoint at which to switch from tablet to desktop
   */
  desktopBreakpoint?: Breakpoint
  
  /**
   * Preferred side-by-side width (in columns or percentage)
   */
  sideBySideWidth?: string
  
  /**
   * Whether to automatically adjust based on orientation changes
   */
  adaptToOrientation?: boolean
}

/**
 * Default responsive behavior options
 */
const DEFAULT_OPTIONS: ResponsiveBehaviorOptions = {
  tabletBreakpoint: 'md',
  desktopBreakpoint: 'lg',
  sideBySideWidth: '50%',
  adaptToOrientation: true
}

/**
 * Hook to get the current window size
 * 
 * @returns Object with window width and height
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    
    // Call handler right away to set initial size
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return windowSize
}

/**
 * Hook to get the current screen orientation
 * 
 * @returns Current orientation (portrait or landscape)
 */
export function useOrientation(): Orientation {
  const { width, height } = useWindowSize()
  return width > height ? 'landscape' : 'portrait'
}

/**
 * Hook to get the current device type based on screen size
 * 
 * @param options - Responsive behavior options
 * @returns Current device type
 */
export function useDeviceType(options?: ResponsiveBehaviorOptions): DeviceType {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const activeBreakpoint = useActiveBreakpoint()
  
  const tabletBreakpoint = opts.tabletBreakpoint || 'md'
  const desktopBreakpoint = opts.desktopBreakpoint || 'lg'
  
  // Convert breakpoints to numeric values for comparison
  const tabletValue = BREAKPOINTS[tabletBreakpoint]
  const desktopValue = BREAKPOINTS[desktopBreakpoint]
  const currentValue = BREAKPOINTS[activeBreakpoint]
  
  if (currentValue >= desktopValue) {
    return 'desktop'
  } else if (currentValue >= tabletValue) {
    return 'tablet'
  } else {
    return 'mobile'
  }
}

/**
 * Hook to determine the appropriate responsive mode
 * 
 * @param options - Responsive behavior options
 * @returns Current responsive mode
 */
export function useResponsiveMode(options?: ResponsiveBehaviorOptions): ResponsiveMode {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const deviceType = useDeviceType(opts)
  const orientation = useOrientation()
  
  // Consider both device type and orientation
  if (deviceType === 'desktop') {
    return 'expanded'
  } else if (deviceType === 'tablet') {
    return orientation === 'landscape' || !opts.adaptToOrientation
      ? 'side-by-side'
      : 'stacked'
  } else {
    return 'stacked'
  }
}

/**
 * Hook to get appropriate column count for grid layouts
 * 
 * @param options - Options object with breakpoint-to-column mappings
 * @returns Current column count
 */
export function useResponsiveColumns(
  options: Partial<Record<Breakpoint, number>> = {}
): number {
  const activeBreakpoint = useActiveBreakpoint()
  
  // Default column counts by breakpoint
  const defaultColumns: Record<Breakpoint, number> = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
    '2xl': 8
  }
  
  // Merge defaults with options
  const columnMap = { ...defaultColumns, ...options }
  
  return columnMap[activeBreakpoint]
}

/**
 * Hook to determine if an element should be visible based on the current device
 * 
 * @param visibleOn - Array of device types on which the element should be visible
 * @param options - Responsive behavior options
 * @returns Whether the element should be visible
 */
export function useResponsiveVisibility(
  visibleOn: DeviceType[] = ['mobile', 'tablet', 'desktop'],
  options?: ResponsiveBehaviorOptions
): boolean {
  const deviceType = useDeviceType(options)
  return visibleOn.includes(deviceType)
}

/**
 * Handle window resizing and notify listeners
 */
export function initializeResponsiveTracking(): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }
  
  let timeout: NodeJS.Timeout | null = null
  let lastWidth = window.innerWidth
  let lastHeight = window.innerHeight
  let lastOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  
  const handleResize = () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    // Debounce resize events
    timeout = setTimeout(() => {
      const width = window.innerWidth
      const height = window.innerHeight
      const orientation = width > height ? 'landscape' : 'portrait'
      
      // Only fire events if things have actually changed
      if (width !== lastWidth || height !== lastHeight) {
        eventBus.emit('window:resize', { width, height })
        lastWidth = width
        lastHeight = height
      }
      
      // Fire orientation change event if orientation has changed
      if (orientation !== lastOrientation) {
        eventBus.emit('orientation:change', { orientation })
        lastOrientation = orientation
      }
    }, 100)
  }
  
  window.addEventListener('resize', handleResize)
  
  // Initial call
  handleResize()
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize)
    if (timeout) {
      clearTimeout(timeout)
    }
  }
}
