'use client'

import { keyboardShortcuts, KeyCombo, KeyboardEventHandler, KeyboardShortcutOptions } from './keyboard'
import { notifications } from './notification'

/**
 * Shortcut category for grouping related shortcuts
 */
export type ShortcutCategory = 
  | 'navigation'
  | 'editor'
  | 'ui'
  | 'custom'
  | 'system'

/**
 * Shortcut definition with metadata
 */
export interface ShortcutDefinition {
  id: string
  combo: KeyCombo
  category: ShortcutCategory
  description: string
  handler: KeyboardEventHandler
  options?: KeyboardShortcutOptions
}

/**
 * Application shortcuts manager to handle global keyboard shortcuts
 */
export class AppShortcutsManager {
  private static instance: AppShortcutsManager
  private shortcuts: Map<string, ShortcutDefinition> = new Map()
  private enabled: boolean = true
  
  private constructor() {}
  
  /**
   * Get singleton instance
   */
  public static getInstance(): AppShortcutsManager {
    if (!AppShortcutsManager.instance) {
      AppShortcutsManager.instance = new AppShortcutsManager()
    }
    return AppShortcutsManager.instance
  }
  
  /**
   * Register a shortcut with the application
   * 
   * @param shortcut - Shortcut definition
   * @returns Unregister function
   */
  public register(shortcut: ShortcutDefinition): () => void {
    // Store the definition for help and documentation
    this.shortcuts.set(shortcut.id, shortcut)
    
    // Format the combo for display
    const comboDisplay = this.formatKeyCombo(shortcut.combo)
    
    // Register with the keyboard manager
    const unregister = keyboardShortcuts.register(
      shortcut.id,
      shortcut.combo,
      (e) => {
        // Only handle if shortcuts are enabled
        if (!this.enabled) return
        
        try {
          shortcut.handler(e)
        } catch (error) {
          console.error(`Error in shortcut handler for ${shortcut.id}:`, error)
          
          // Show error notification
          notifications.error(
            `Failed to execute shortcut "${shortcut.description}"`,
            'Shortcut Error'
          )
        }
      },
      shortcut.options
    )
    
    return () => {
      this.shortcuts.delete(shortcut.id)
      unregister()
    }
  }
  
  /**
   * Format a key combo for display
   * 
   * @param combo - Key combination
   * @returns Formatted key combo for display
   */
  private formatKeyCombo(combo: KeyCombo): string {
    const formatKey = (key: string) => {
      const keyMap: Record<string, string> = {
        'ctrl': '⌃',
        'alt': '⌥',
        'shift': '⇧',
        'meta': '⌘',
        'space': 'Space',
        'esc': 'Esc',
        'enter': '↵',
        'tab': 'Tab',
        'delete': 'Delete',
        'backspace': 'Backspace',
        'arrowup': '↑',
        'arrowdown': '↓',
        'arrowleft': '←',
        'arrowright': '→',
      }
      
      const normalizedKey = key.toLowerCase()
      return keyMap[normalizedKey] || key.toUpperCase()
    }
    
    // Convert to array if it's a string
    const keys = typeof combo === 'string'
      ? combo.split('+').map(k => k.trim())
      : Array.isArray(combo)
        ? combo
        : [combo]
    
    return keys.map(formatKey).join(' + ')
  }
  
  /**
   * Enable all shortcuts
   */
  public enable(): void {
    this.enabled = true
  }
  
  /**
   * Disable all shortcuts
   */
  public disable(): void {
    this.enabled = false
  }
  
  /**
   * Get all registered shortcuts
   * 
   * @returns Map of shortcut definitions
   */
  public getShortcuts(): Map<string, ShortcutDefinition> {
    return new Map(this.shortcuts)
  }
  
  /**
   * Get shortcuts by category
   * 
   * @param category - Shortcut category
   * @returns Array of shortcut definitions
   */
  public getShortcutsByCategory(category: ShortcutCategory): ShortcutDefinition[] {
    return Array.from(this.shortcuts.values())
      .filter(shortcut => shortcut.category === category)
  }
  
  /**
   * Display a help dialog with all available shortcuts
   */
  public showShortcutsHelp(): void {
    // This would be implemented in a UI component
    // Here we just log to console for demonstration
    console.log('==== Keyboard Shortcuts ====')
    
    // Group by category
    const categories = new Map<ShortcutCategory, ShortcutDefinition[]>()
    
    for (const shortcut of this.shortcuts.values()) {
      if (!categories.has(shortcut.category)) {
        categories.set(shortcut.category, [])
      }
      
      categories.get(shortcut.category)!.push(shortcut)
    }
    
    // Log each category
    for (const [category, shortcuts] of categories.entries()) {
      console.log(`\n--- ${category.toUpperCase()} ---`)
      
      for (const shortcut of shortcuts) {
        console.log(`${this.formatKeyCombo(shortcut.combo)}: ${shortcut.description}`)
      }
    }
  }
}

// Export singleton instance
export const appShortcuts = AppShortcutsManager.getInstance()

// Register common application shortcuts
export function registerCommonShortcuts(): void {
  // Help shortcut (F1 or ?)
  appShortcuts.register({
    id: 'help',
    combo: ['F1', '?'],
    category: 'system',
    description: 'Show keyboard shortcuts help',
    handler: () => {
      appShortcuts.showShortcutsHelp()
    }
  })
  
  // Theme toggle shortcut
  appShortcuts.register({
    id: 'theme-toggle',
    combo: 'ctrl+shift+t',
    category: 'ui',
    description: 'Toggle theme (light/dark/system)',
    handler: () => {
      // This would be implemented elsewhere and use the theme utility
      console.log('Theme toggle shortcut triggered')
    }
  })
  
  // Search shortcut
  appShortcuts.register({
    id: 'global-search',
    combo: 'ctrl+k',
    category: 'navigation',
    description: 'Open global search',
    handler: () => {
      // This would be implemented elsewhere
      console.log('Global search shortcut triggered')
    }
  })
  
  // Save shortcut
  appShortcuts.register({
    id: 'save',
    combo: 'ctrl+s',
    category: 'editor',
    description: 'Save current document',
    handler: (e) => {
      // This would be implemented elsewhere
      console.log('Save shortcut triggered')
      notifications.success('Document saved successfully')
    }
  })
}
