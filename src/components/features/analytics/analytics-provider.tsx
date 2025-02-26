'use client'

import * as React from 'react'
import { analytics } from '@/lib-new/utils/analytics'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Analytics provider props
 */
interface AnalyticsProviderProps {
  /**
   * Children to render
   */
  children: React.ReactNode
}

/**
 * Provider component that initializes analytics and tracks page views
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Initialize analytics on mount
  React.useEffect(() => {
    const initAsync = async () => {
      await analytics.initialize({
        enabled: process.env.NODE_ENV !== 'development' || process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
      })
      
      console.log('Analytics initialized')
    }
    
    initAsync().catch(err => {
      console.error('Failed to initialize analytics:', err)
    })
    
    // Cleanup on unmount
    return () => {
      // Any cleanup for analytics would go here
    }
  }, [])
  
  // Track page views when the route changes
  React.useEffect(() => {
    if (pathname) {
      // Create the full path with query params
      const queryString = searchParams?.toString()
      const fullPath = queryString ? `${pathname}?${queryString}` : pathname
      
      // Track page view
      analytics.trackPageView(fullPath, {
        title: document.title,
        referrer: document.referrer,
        timestamp: Date.now()
      })
    }
  }, [pathname, searchParams])
  
  return <>{children}</>
}

/**
 * Hook for tracking user actions
 * 
 * @param category - Action category
 * @returns Tracking function
 */
export function useTrackAction(category: string) {
  return React.useCallback((action: string, properties?: Record<string, any>) => {
    analytics.trackAction(`${category}:${action}`, properties)
  }, [category])
}

/**
 * Hook for tracking feature usage
 * 
 * @param featureArea - Feature area
 * @returns Tracking function
 */
export function useTrackFeature(featureArea: string) {
  return React.useCallback((feature: string, properties?: Record<string, any>) => {
    analytics.trackFeature(`${featureArea}:${feature}`, properties)
  }, [featureArea])
}

/**
 * Error boundary component that tracks errors with analytics
 */
export class ErrorBoundaryWithTracking extends React.Component<
  { children: React.ReactNode, fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track the error with analytics
    analytics.trackError(error, {
      componentStack: errorInfo.componentStack,
      ...error
    })
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Component error:', error, errorInfo)
    }
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    
    return this.props.children
  }
}
