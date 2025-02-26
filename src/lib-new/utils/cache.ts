'use client'

/**
 * Cache entry interface with expiration
 */
interface CacheEntry<T> {
  value: T
  expiry: number | null
}

/**
 * Cache options
 */
export interface CacheOptions {
  /**
   * Time to live in milliseconds (null = no expiration)
   */
  ttl?: number | null
  
  /**
   * Storage type (memory or localStorage)
   */
  storage?: 'memory' | 'localStorage'
  
  /**
   * Prefix for localStorage keys
   */
  prefix?: string
}

/**
 * Default cache options
 */
const DEFAULT_OPTIONS: CacheOptions = {
  ttl: 5 * 60 * 1000, // 5 minutes
  storage: 'memory',
  prefix: 'app_cache_'
}

/**
 * Cache utility for storing data with expiration
 */
export class Cache {
  private static instance: Cache
  private memoryCache: Map<string, CacheEntry<any>> = new Map()
  private options: CacheOptions
  
  /**
   * Create a new cache instance
   * 
   * @param options - Cache options
   */
  private constructor(options: CacheOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }
  
  /**
   * Get singleton cache instance
   * 
   * @param options - Cache options
   */
  public static getInstance(options?: CacheOptions): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache(options)
    }
    return Cache.instance
  }
  
  /**
   * Set a value in the cache
   * 
   * @param key - Cache key
   * @param value - Value to cache
   * @param options - Override default options
   */
  public set<T>(key: string, value: T, options?: CacheOptions): void {
    const opts = { ...this.options, ...options }
    
    const expiry = opts.ttl ? Date.now() + opts.ttl : null
    const entry: CacheEntry<T> = { value, expiry }
    
    if (opts.storage === 'localStorage') {
      try {
        const prefixedKey = opts.prefix + key
        localStorage.setItem(prefixedKey, JSON.stringify({
          value,
          expiry
        }))
      } catch (error) {
        console.error('Failed to store value in localStorage:', error)
        // Fallback to memory cache
        this.memoryCache.set(key, entry)
      }
    } else {
      this.memoryCache.set(key, entry)
    }
  }
  
  /**
   * Get a value from the cache
   * 
   * @param key - Cache key
   * @param defaultValue - Default value if key not found or expired
   * @param options - Override default options
   * @returns Cached value or defaultValue
   */
  public get<T>(key: string, defaultValue?: T, options?: CacheOptions): T | undefined {
    const opts = { ...this.options, ...options }
    
    if (opts.storage === 'localStorage') {
      try {
        const prefixedKey = opts.prefix + key
        const stored = localStorage.getItem(prefixedKey)
        
        if (stored) {
          const entry = JSON.parse(stored) as CacheEntry<T>
          
          // Check if entry is expired
          if (entry.expiry && entry.expiry < Date.now()) {
            this.remove(key, opts)
            return defaultValue
          }
          
          return entry.value
        }
      } catch (error) {
        console.error('Failed to retrieve value from localStorage:', error)
        // Fallback to memory cache
      }
    }
    
    // Check memory cache as fallback or if memory storage is selected
    const entry = this.memoryCache.get(key) as CacheEntry<T> | undefined
    
    if (!entry) {
      return defaultValue
    }
    
    // Check if entry is expired
    if (entry.expiry && entry.expiry < Date.now()) {
      this.memoryCache.delete(key)
      return defaultValue
    }
    
    return entry.value
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   * 
   * @param key - Cache key
   * @param options - Override default options
   * @returns Whether the key exists and is not expired
   */
  public has(key: string, options?: CacheOptions): boolean {
    const opts = { ...this.options, ...options }
    
    if (opts.storage === 'localStorage') {
      try {
        const prefixedKey = opts.prefix + key
        const stored = localStorage.getItem(prefixedKey)
        
        if (stored) {
          const entry = JSON.parse(stored) as CacheEntry<any>
          
          // Check if entry is expired
          if (entry.expiry && entry.expiry < Date.now()) {
            this.remove(key, opts)
            return false
          }
          
          return true
        }
      } catch (error) {
        console.error('Failed to check localStorage cache:', error)
        // Fallback to memory cache
      }
    }
    
    // Check memory cache
    const entry = this.memoryCache.get(key)
    
    if (!entry) {
      return false
    }
    
    // Check if entry is expired
    if (entry.expiry && entry.expiry < Date.now()) {
      this.memoryCache.delete(key)
      return false
    }
    
    return true
  }
  
  /**
   * Remove a key from the cache
   * 
   * @param key - Cache key
   * @param options - Override default options
   */
  public remove(key: string, options?: CacheOptions): void {
    const opts = { ...this.options, ...options }
    
    if (opts.storage === 'localStorage') {
      try {
        const prefixedKey = opts.prefix + key
        localStorage.removeItem(prefixedKey)
      } catch (error) {
        console.error('Failed to remove from localStorage cache:', error)
      }
    }
    
    // Also remove from memory cache
    this.memoryCache.delete(key)
  }
  
  /**
   * Clear all cached values
   * 
   * @param options - Override default options
   */
  public clear(options?: CacheOptions): void {
    const opts = { ...this.options, ...options }
    
    // Clear memory cache
    this.memoryCache.clear()
    
    // Clear localStorage if that's being used
    if (opts.storage === 'localStorage') {
      try {
        const prefix = opts.prefix || this.options.prefix
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith(prefix!)) {
            localStorage.removeItem(key)
          }
        }
      } catch (error) {
        console.error('Failed to clear localStorage cache:', error)
      }
    }
  }
}

// Export a singleton instance with default options
export const cache = Cache.getInstance()
