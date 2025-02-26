'use client'

/**
 * Prefix for all storage keys to avoid collisions with other applications
 */
const PREFIX = 'lovell_'

/**
 * Saves a value to localStorage with the application prefix
 * 
 * @param key - The key to store the value under
 * @param value - The value to store
 */
export function setItem<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(`${PREFIX}${key}`, serializedValue)
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`)
  }
}

/**
 * Retrieves a value from localStorage by key
 * 
 * @param key - The key to retrieve
 * @returns The stored value or null if not found
 */
export function getItem<T>(key: string): T | null {
  try {
    const serializedValue = localStorage.getItem(`${PREFIX}${key}`)
    if (serializedValue === null) {
      return null
    }
    return JSON.parse(serializedValue) as T
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`)
    return null
  }
}

/**
 * Removes an item from localStorage by key
 * 
 * @param key - The key to remove
 */
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(`${PREFIX}${key}`)
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`)
  }
}

/**
 * Clears all application-specific items from localStorage
 */
export function clear(): void {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`)
  }
}

/**
 * Checks if localStorage is available in the current environment
 * 
 * @returns Whether localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = `${PREFIX}test`
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

// Session storage methods

/**
 * Saves a value to sessionStorage with the application prefix
 * 
 * @param key - The key to store the value under
 * @param value - The value to store
 */
export function setSessionItem<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value)
    sessionStorage.setItem(`${PREFIX}${key}`, serializedValue)
  } catch (error) {
    console.error(`Error saving to sessionStorage: ${error}`)
  }
}

/**
 * Retrieves a value from sessionStorage by key
 * 
 * @param key - The key to retrieve
 * @returns The stored value or null if not found
 */
export function getSessionItem<T>(key: string): T | null {
  try {
    const serializedValue = sessionStorage.getItem(`${PREFIX}${key}`)
    if (serializedValue === null) {
      return null
    }
    return JSON.parse(serializedValue) as T
  } catch (error) {
    console.error(`Error reading from sessionStorage: ${error}`)
    return null
  }
}

/**
 * Removes an item from sessionStorage by key
 * 
 * @param key - The key to remove
 */
export function removeSessionItem(key: string): void {
  try {
    sessionStorage.removeItem(`${PREFIX}${key}`)
  } catch (error) {
    console.error(`Error removing from sessionStorage: ${error}`)
  }
}

/**
 * Clears all application-specific items from sessionStorage
 */
export function clearSession(): void {
  try {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith(PREFIX)) {
        sessionStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error(`Error clearing sessionStorage: ${error}`)
  }
}
