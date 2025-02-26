'use client'

/**
 * Notification types for different severity levels
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

/**
 * Notification interface for app-wide notifications
 */
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  autoHide?: boolean
  duration?: number
  createdAt: Date
}

/**
 * Notification options for creating notifications
 */
export interface NotificationOptions {
  type?: NotificationType
  title?: string
  message: string
  autoHide?: boolean
  duration?: number
}

/**
 * Default notification options by type
 */
const DEFAULT_OPTIONS: Record<NotificationType, Partial<NotificationOptions>> = {
  info: {
    autoHide: true,
    duration: 5000,
    title: 'Information'
  },
  success: {
    autoHide: true,
    duration: 5000,
    title: 'Success'
  },
  warning: {
    autoHide: true,
    duration: 7000,
    title: 'Warning'
  },
  error: {
    autoHide: false,
    title: 'Error'
  }
}

/**
 * Class for managing application notifications
 */
export class NotificationManager {
  private static instance: NotificationManager
  private listeners: Set<(notifications: Notification[]) => void> = new Set()
  private notifications: Notification[] = []
  
  private constructor() {}
  
  /**
   * Get the singleton instance of NotificationManager
   */
  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }
  
  /**
   * Subscribe to notification updates
   * 
   * @param listener - Callback function for notification updates
   * @returns Unsubscribe function
   */
  public subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener)
    listener([...this.notifications])
    
    return () => {
      this.listeners.delete(listener)
    }
  }
  
  /**
   * Create and show a notification
   * 
   * @param options - Notification options
   * @returns The created notification object
   */
  public show(options: NotificationOptions): Notification {
    const type = options.type || 'info'
    const defaultOpts = DEFAULT_OPTIONS[type]
    
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      title: options.title || defaultOpts.title || '',
      message: options.message,
      autoHide: options.autoHide ?? defaultOpts.autoHide,
      duration: options.duration || defaultOpts.duration,
      createdAt: new Date()
    }
    
    this.notifications.push(notification)
    this.notifyListeners()
    
    if (notification.autoHide && notification.duration) {
      setTimeout(() => {
        this.remove(notification.id)
      }, notification.duration)
    }
    
    return notification
  }
  
  /**
   * Show an info notification
   * 
   * @param message - Notification message
   * @param title - Optional title
   * @returns The created notification
   */
  public info(message: string, title?: string): Notification {
    return this.show({ type: 'info', message, title })
  }
  
  /**
   * Show a success notification
   * 
   * @param message - Notification message
   * @param title - Optional title
   * @returns The created notification
   */
  public success(message: string, title?: string): Notification {
    return this.show({ type: 'success', message, title })
  }
  
  /**
   * Show a warning notification
   * 
   * @param message - Notification message
   * @param title - Optional title
   * @returns The created notification
   */
  public warning(message: string, title?: string): Notification {
    return this.show({ type: 'warning', message, title })
  }
  
  /**
   * Show an error notification
   * 
   * @param message - Notification message
   * @param title - Optional title
   * @returns The created notification
   */
  public error(message: string, title?: string): Notification {
    return this.show({ type: 'error', message, title })
  }
  
  /**
   * Remove a notification by ID
   * 
   * @param id - Notification ID to remove
   */
  public remove(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      this.notifications.splice(index, 1)
      this.notifyListeners()
    }
  }
  
  /**
   * Clear all notifications
   */
  public clear(): void {
    this.notifications = []
    this.notifyListeners()
  }
  
  /**
   * Get all current notifications
   * 
   * @returns Array of notifications
   */
  public getNotifications(): Notification[] {
    return [...this.notifications]
  }
  
  /**
   * Notify all subscribed listeners of notification changes
   */
  private notifyListeners(): void {
    const notificationsCopy = [...this.notifications]
    this.listeners.forEach(listener => {
      listener(notificationsCopy)
    })
  }
}

// Export a singleton instance
export const notifications = NotificationManager.getInstance()
