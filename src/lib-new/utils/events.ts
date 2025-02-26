'use client'

/**
 * Event listener type
 */
export type EventListener<T = any> = (data: T) => void

/**
 * Event handler interface
 */
export interface EventHandler<T = any> {
  /**
   * Subscribe to an event
   * 
   * @param event - Event name
   * @param listener - Event listener function
   * @returns Unsubscribe function
   */
  on(event: string, listener: EventListener<T>): () => void
  
  /**
   * Subscribe to an event for a single execution
   * 
   * @param event - Event name
   * @param listener - Event listener function
   * @returns Unsubscribe function
   */
  once(event: string, listener: EventListener<T>): () => void
  
  /**
   * Unsubscribe a listener from an event
   * 
   * @param event - Event name
   * @param listener - Event listener function
   */
  off(event: string, listener: EventListener<T>): void
  
  /**
   * Emit an event with data
   * 
   * @param event - Event name
   * @param data - Event data
   */
  emit(event: string, data?: T): void
  
  /**
   * Emit an event with data to the current listeners and await all promises
   * 
   * @param event - Event name
   * @param data - Event data
   * @returns Promise that resolves when all listeners have completed
   */
  emitAsync(event: string, data?: T): Promise<void>
  
  /**
   * Remove all listeners for an event or all events
   * 
   * @param event - Optional event name, if not provided all events will be cleared
   */
  clear(event?: string): void
}

/**
 * Event bus implementation for pub/sub pattern
 */
class EventBus implements EventHandler {
  private static instance: EventBus
  private events: Map<string, Set<EventListener>> = new Map()
  private onceListeners: WeakMap<EventListener, string> = new WeakMap()
  
  private constructor() {}
  
  /**
   * Get the singleton event bus instance
   */
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }
  
  /**
   * Subscribe to an event
   * 
   * @param event - Event name
   * @param listener - Event listener function
   * @returns Unsubscribe function
   */
  public on(event: string, listener: EventListener): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    
    this.events.get(event)!.add(listener)
    
    // Return unsubscribe function
    return () => this.off(event, listener)
  }
  
  /**
   * Subscribe to an event for a single execution
   * 
   * @param event - Event name
   * @param listener - Event listener function
   * @returns Unsubscribe function
   */
  public once(event: string, listener: EventListener): () => void {
    // Create a wrapper that will remove itself after execution
    const wrapper: EventListener = (data) => {
      // Remove the wrapper
      this.off(event, wrapper)
      // Execute the original listener
      listener(data)
    }
    
    // Mark this as a once listener for debugging
    this.onceListeners.set(wrapper, event)
    
    // Register the wrapper
    return this.on(event, wrapper)
  }
  
  /**
   * Unsubscribe a listener from an event
   * 
   * @param event - Event name
   * @param listener - Event listener function
   */
  public off(event: string, listener: EventListener): void {
    const listeners = this.events.get(event)
    
    if (listeners) {
      listeners.delete(listener)
      
      // Clean up the event if no listeners remain
      if (listeners.size === 0) {
        this.events.delete(event)
      }
    }
  }
  
  /**
   * Emit an event with data
   * 
   * @param event - Event name
   * @param data - Event data
   */
  public emit(event: string, data?: any): void {
    const listeners = this.events.get(event)
    
    if (listeners) {
      // Create a copy of the listeners set to avoid modification during iteration
      Array.from(listeners).forEach(listener => {
        try {
          listener(data)
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error)
        }
      })
    }
  }
  
  /**
   * Emit an event with data to the current listeners and await all promises
   * 
   * @param event - Event name
   * @param data - Event data
   * @returns Promise that resolves when all listeners have completed
   */
  public async emitAsync(event: string, data?: any): Promise<void> {
    const listeners = this.events.get(event)
    
    if (listeners) {
      const promises: Promise<void>[] = []
      
      // Create a copy of the listeners set to avoid modification during iteration
      Array.from(listeners).forEach(listener => {
        try {
          const result = listener(data)
          if (result instanceof Promise) {
            promises.push(result)
          }
        } catch (error) {
          console.error(`Error in async event listener for "${event}":`, error)
        }
      })
      
      // Wait for all promise-returning listeners to complete
      if (promises.length > 0) {
        await Promise.all(promises)
      }
    }
  }
  
  /**
   * Remove all listeners for an event or all events
   * 
   * @param event - Optional event name, if not provided all events will be cleared
   */
  public clear(event?: string): void {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
  }
  
  /**
   * Get the number of listeners for an event
   * 
   * @param event - Event name
   * @returns Number of listeners
   */
  public listenerCount(event: string): number {
    const listeners = this.events.get(event)
    return listeners ? listeners.size : 0
  }
  
  /**
   * Get all registered event names
   * 
   * @returns Array of event names
   */
  public eventNames(): string[] {
    return Array.from(this.events.keys())
  }
}

// Export singleton instance
export const eventBus = EventBus.getInstance()

/**
 * React hook for subscribing to events
 * 
 * @param event - Event name to subscribe to
 * @param callback - Callback function to be called when the event is emitted
 */
export function useEvent<T = any>(event: string, callback: EventListener<T>): void {
  React.useEffect(() => {
    // Subscribe to the event
    const unsubscribe = eventBus.on(event, callback)
    
    // Unsubscribe when the component unmounts
    return unsubscribe
  }, [event, callback])
}
