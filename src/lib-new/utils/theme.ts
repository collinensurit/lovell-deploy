'use client'

import { useEffect, useState } from 'react'
import { isBrowser } from './is-browser'

/**
 * Theme options for the application
 */
export type Theme = 'light' | 'dark' | 'system'

/**
 * Theme modes (actual rendered themes)
 */
export type ThemeMode = 'light' | 'dark'

/**
 * Storage key for theme in localStorage
 */
const THEME_STORAGE_KEY = 'app-theme'

/**
 * Get the current theme from localStorage or default to system
 * 
 * @returns Current theme setting
 */
export function getTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'system'
  }
  
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    return (storedTheme as Theme) || 'system'
  } catch (error) {
    console.error('Failed to read theme from localStorage:', error)
    return 'system'
  }
}

/**
 * Set the theme and save to localStorage
 * 
 * @param theme - Theme to set
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    
    // Apply the theme
    applyTheme(theme)
    
    // Dispatch a custom event for any listeners
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }))
  } catch (error) {
    console.error('Failed to set theme in localStorage:', error)
  }
}

/**
 * Apply theme to document
 * 
 * @param theme - Theme to apply
 */
export function applyTheme(theme: Theme) {
  if (!isBrowser()) {
    return // Skip on server
  }

  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  
  // Apply data-theme attribute to document
  if (isDark) {
    document.documentElement.classList.add('dark')
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

/**
 * Get the current theme mode (light or dark)
 * 
 * @returns Current theme mode
 */
export function getThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }
  
  const theme = getTheme()
  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  
  return isDark ? 'dark' : 'light'
}

/**
 * React hook to manage and access the current theme
 * 
 * @returns [theme, setTheme, themeMode] tuple
 */
export function useTheme(): [Theme, (theme: Theme) => void, ThemeMode] {
  const [theme, setThemeState] = useState<Theme>('system')
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')
  
  // Initialize from localStorage on mount
  useEffect(() => {
    const savedTheme = getTheme()
    setThemeState(savedTheme)
    
    // Determine the actual mode
    const isDark = savedTheme === 'dark' || 
      (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    setThemeMode(isDark ? 'dark' : 'light')
    
    // Apply the theme
    applyTheme(savedTheme)
  }, [])
  
  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      const currentTheme = getTheme()
      
      if (currentTheme === 'system') {
        const isDark = mediaQuery.matches
        setThemeMode(isDark ? 'dark' : 'light')
        
        // Apply the theme
        applyTheme(currentTheme)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])
  
  // Custom theme setter that updates both state and localStorage
  const updateTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    setTheme(newTheme)
    
    const isDark = newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    setThemeMode(isDark ? 'dark' : 'light')
  }
  
  return [theme, updateTheme, themeMode]
}

/**
 * Initialize theme system on app startup
 */
export function initializeTheme(): void {
  if (typeof window === 'undefined') {
    return
  }
  
  const theme = getTheme()
  applyTheme(theme)
}
