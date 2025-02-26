'use client'

/**
 * Event types for analytics
 */
export type AnalyticsEventType = 
  | 'page_view'
  | 'user_action'
  | 'feature_usage'
  | 'error'
  | 'performance'
  | 'custom'

/**
 * Basic analytics event interface
 */
export interface AnalyticsEvent {
  type: AnalyticsEventType
  name: string
  properties?: Record<string, any>
  timestamp?: number
}

/**
 * Analytics provider interface
 */
export interface AnalyticsProvider {
  /**
   * Initialize the analytics provider
   * 
   * @param options - Provider-specific options
   */
  initialize(options?: any): Promise<void>
  
  /**
   * Track an event
   * 
   * @param event - Analytics event to track
   */
  trackEvent(event: AnalyticsEvent): Promise<void>
  
  /**
   * Set user properties
   * 
   * @param userId - User identifier
   * @param properties - User properties
   */
  setUser(userId: string, properties?: Record<string, any>): Promise<void>
  
  /**
   * Clear the current user
   */
  clearUser(): Promise<void>
}

/**
 * Console analytics provider for development
 */
export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  private isEnabled: boolean = false
  
  /**
   * Initialize the console analytics provider
   * 
   * @param options - Provider options
   */
  public async initialize(options?: { enabled?: boolean }): Promise<void> {
    this.isEnabled = options?.enabled ?? process.env.NODE_ENV === 'development'
    
    if (this.isEnabled) {
      console.log('📊 Console analytics initialized')
    }
  }
  
  /**
   * Track an event in the console
   * 
   * @param event - Analytics event to track
   */
  public async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.isEnabled) return
    
    console.log(`📊 Analytics Event [${event.type}]: ${event.name}`, {
      ...event.properties,
      timestamp: event.timestamp || Date.now()
    })
  }
  
  /**
   * Set user in the console
   * 
   * @param userId - User identifier
   * @param properties - User properties
   */
  public async setUser(userId: string, properties?: Record<string, any>): Promise<void> {
    if (!this.isEnabled) return
    
    console.log(`📊 Analytics User Set: ${userId}`, properties)
  }
  
  /**
   * Clear user in the console
   */
  public async clearUser(): Promise<void> {
    if (!this.isEnabled) return
    
    console.log('📊 Analytics User Cleared')
  }
}

/**
 * Analytics service for tracking events
 */
export class AnalyticsService {
  private static instance: AnalyticsService
  private providers: AnalyticsProvider[] = []
  private isInitialized: boolean = false
  private queue: AnalyticsEvent[] = []
  private currentUserId: string | null = null
  private userProperties: Record<string, any> = {}
  
  private constructor() {}
  
  /**
   * Get the singleton analytics service instance
   */
  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }
  
  /**
   * Register an analytics provider
   * 
   * @param provider - Analytics provider to register
   */
  public registerProvider(provider: AnalyticsProvider): void {
    this.providers.push(provider)
  }
  
  /**
   * Initialize the analytics service and all registered providers
   * 
   * @param options - Provider-specific options
   */
  public async initialize(options?: Record<string, any>): Promise<void> {
    if (this.isInitialized) return
    
    // Initialize default provider if none registered
    if (this.providers.length === 0) {
      this.registerProvider(new ConsoleAnalyticsProvider())
    }
    
    // Initialize all providers
    await Promise.all(
      this.providers.map(provider => provider.initialize(options))
    )
    
    this.isInitialized = true
    
    // Process any queued events
    this.processQueue()
  }
  
  /**
   * Track an analytics event
   * 
   * @param type - Event type
   * @param name - Event name
   * @param properties - Event properties
   */
  public trackEvent(
    type: AnalyticsEventType,
    name: string,
    properties?: Record<string, any>
  ): void {
    const event: AnalyticsEvent = {
      type,
      name,
      properties,
      timestamp: Date.now()
    }
    
    if (!this.isInitialized) {
      // Queue the event for later
      this.queue.push(event)
      return
    }
    
    // Send to all providers
    this.providers.forEach(provider => {
      provider.trackEvent(event).catch(error => {
        console.error('Analytics provider failed to track event:', error)
      })
    })
  }
  
  /**
   * Track a page view
   * 
   * @param path - Page path
   * @param properties - Additional properties
   */
  public trackPageView(path: string, properties?: Record<string, any>): void {
    this.trackEvent('page_view', 'Page View', {
      path,
      ...properties
    })
  }
  
  /**
   * Track a user action
   * 
   * @param action - Action name
   * @param properties - Action properties
   */
  public trackAction(action: string, properties?: Record<string, any>): void {
    this.trackEvent('user_action', action, properties)
  }
  
  /**
   * Track feature usage
   * 
   * @param feature - Feature name
   * @param properties - Feature properties
   */
  public trackFeature(feature: string, properties?: Record<string, any>): void {
    this.trackEvent('feature_usage', feature, properties)
  }
  
  /**
   * Track an error
   * 
   * @param error - Error name or object
   * @param properties - Error properties
   */
  public trackError(error: string | Error, properties?: Record<string, any>): void {
    const errorName = typeof error === 'string' ? error : error.name
    const errorMessage = typeof error === 'string' ? error : error.message
    const errorStack = typeof error === 'string' ? undefined : error.stack
    
    this.trackEvent('error', errorName, {
      message: errorMessage,
      stack: errorStack,
      ...properties
    })
  }
  
  /**
   * Track a performance metric
   * 
   * @param metric - Metric name
   * @param value - Metric value
   * @param properties - Additional properties
   */
  public trackPerformance(
    metric: string,
    value: number,
    properties?: Record<string, any>
  ): void {
    this.trackEvent('performance', metric, {
      value,
      ...properties
    })
  }
  
  /**
   * Set the current user
   * 
   * @param userId - User identifier
   * @param properties - User properties
   */
  public setUser(userId: string, properties?: Record<string, any>): void {
    this.currentUserId = userId
    this.userProperties = properties || {}
    
    if (!this.isInitialized) {
      return
    }
    
    // Send to all providers
    this.providers.forEach(provider => {
      provider.setUser(userId, properties).catch(error => {
        console.error('Analytics provider failed to set user:', error)
      })
    })
  }
  
  /**
   * Clear the current user
   */
  public clearUser(): void {
    this.currentUserId = null
    this.userProperties = {}
    
    if (!this.isInitialized) {
      return
    }
    
    // Send to all providers
    this.providers.forEach(provider => {
      provider.clearUser().catch(error => {
        console.error('Analytics provider failed to clear user:', error)
      })
    })
  }
  
  /**
   * Process any queued events
   */
  private processQueue(): void {
    if (!this.isInitialized || this.queue.length === 0) {
      return
    }
    
    // Process all queued events
    this.queue.forEach(event => {
      this.providers.forEach(provider => {
        provider.trackEvent(event).catch(error => {
          console.error('Analytics provider failed to track queued event:', error)
        })
      })
    })
    
    // Clear the queue
    this.queue = []
    
    // Set the user if needed
    if (this.currentUserId) {
      this.providers.forEach(provider => {
        provider.setUser(this.currentUserId!, this.userProperties).catch(error => {
          console.error('Analytics provider failed to set queued user:', error)
        })
      })
    }
  }
}

// Export singleton instance
export const analytics = AnalyticsService.getInstance()
