const PREFIX = 'lovell_'

export function setItem<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(`${PREFIX}${key}`, serializedValue)
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`)
  }
}

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

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(`${PREFIX}${key}`)
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`)
  }
}

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
export function setSessionItem<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value)
    sessionStorage.setItem(`${PREFIX}${key}`, serializedValue)
  } catch (error) {
    console.error(`Error saving to sessionStorage: ${error}`)
  }
}

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

export function removeSessionItem(key: string): void {
  try {
    sessionStorage.removeItem(`${PREFIX}${key}`)
  } catch (error) {
    console.error(`Error removing from sessionStorage: ${error}`)
  }
}

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
