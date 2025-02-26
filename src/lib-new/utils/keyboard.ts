'use client'

import { useEffect, useCallback, useRef } from 'react'

/**
 * Keyboard key combinations
 */
export type KeyCombo = string | string[]

/**
 * Keyboard event handler
 */
export type KeyboardEventHandler = (event: KeyboardEvent) => void

/**
 * Keyboard shortcut options
 */
export interface KeyboardShortcutOptions {
  /**
   * Whether to prevent default browser behavior (default: true)
   */
  preventDefault?: boolean
  
  /**
   * Whether to stop event propagation (default: true)
   */
  stopPropagation?: boolean
  
  /**
   * Event to listen for (default: 'keydown')
   */
  event?: 'keydown' | 'keyup' | 'keypress'
  
  /**
   * Whether the shortcut should work when an input element is focused (default: false)
   */
  enableInInputs?: boolean
  
  /**
   * Whether the shortcut should work when the component is not visible (default: false)
   */
  enableWhenHidden?: boolean
}

/**
 * Normalize key combo to an array of key strings
 * 
 * @param combo - Key combination
 * @returns Normalized key combo array
 */
function normalizeKeyCombo(combo: KeyCombo): string[] {
  if (typeof combo === 'string') {
    // Split by '+' and normalize each key
    return combo.split('+').map(key => key.trim().toLowerCase())
  }
  
  return combo.map(key => key.trim().toLowerCase())
}

/**
 * Check if a keyboard event matches a key combo
 * 
 * @param event - Keyboard event
 * @param keyCombo - Key combination to check
 * @returns Whether the event matches the key combo
 */
export function matchesKeyCombo(event: KeyboardEvent, keyCombo: KeyCombo): boolean {
  const normalizedCombo = normalizeKeyCombo(keyCombo)
  
  // Create a set of active keys in the current event
  const activeKeys = new Set<string>()
  
  // Add modifier keys if they're pressed
  if (event.ctrlKey) activeKeys.add('ctrl')
  if (event.altKey) activeKeys.add('alt')
  if (event.shiftKey) activeKeys.add('shift')
  if (event.metaKey) activeKeys.add('meta')
  
  // Add the main key (normalized)
  let mainKey = event.key.toLowerCase()
  
  // Normalize some special keys
  switch (mainKey) {
    case ' ':
      mainKey = 'space'
      break
    case 'escape':
      mainKey = 'esc'
      break
    case 'delete':
      mainKey = 'del'
      break
  }
  
  activeKeys.add(mainKey)
  
  // Check if all required keys are pressed
  for (const key of normalizedCombo) {
    if (!activeKeys.has(key)) {
      return false
    }
  }
  
  // Check if no extra modifiers are pressed (except for the main key)
  const modifierCount = (event.ctrlKey ? 1 : 0) +
                        (event.altKey ? 1 : 0) +
                        (event.shiftKey ? 1 : 0) +
                        (event.metaKey ? 1 : 0)
  
  // Number of expected modifiers is combo length minus the main key
  const expectedModifierCount = normalizedCombo.length - 1
  
  return modifierCount === expectedModifierCount
}

/**
 * React hook for keyboard shortcuts
 * 
 * @param keyCombo - Key combination(s) to listen for
 * @param callback - Callback function to execute when the key combo is pressed
 * @param options - Keyboard shortcut options
 */
export function useKeyboardShortcut(
  keyCombo: KeyCombo | KeyCombo[],
  callback: KeyboardEventHandler,
  options: KeyboardShortcutOptions = {}
): void {
  const {
    preventDefault = true,
    stopPropagation = true,
    event = 'keydown',
    enableInInputs = false,
    enableWhenHidden = false,
  } = options
  
  // Store callback in a ref to avoid re-creating the handler on every render
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  
  // Convert single combo to array for consistent handling
  const keyCombos = Array.isArray(keyCombo) 
    ? (keyCombo.flat() as KeyCombo[]) 
    : [keyCombo]
  
  const handleKeyEvent = useCallback((e: KeyboardEvent) => {
    // Skip if target is an input element and enableInInputs is false
    if (!enableInInputs) {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return
      }
    }
    
    // Check visibility if needed
    if (!enableWhenHidden) {
      // Skip if the document is not visible
      if (document.hidden) {
        return
      }
    }
    
    // Check if any of the key combos match
    for (const combo of keyCombos) {
      if (matchesKeyCombo(e, combo)) {
        if (preventDefault) e.preventDefault()
        if (stopPropagation) e.stopPropagation()
        
        callbackRef.current(e)
        return
      }
    }
  }, [keyCombos, preventDefault, stopPropagation, enableInInputs, enableWhenHidden])
  
  useEffect(() => {
    // Add event listener
    document.addEventListener(event, handleKeyEvent)
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener(event, handleKeyEvent)
    }
  }, [event, handleKeyEvent])
}

/**
 * Keyboard shortcut manager for registering global shortcuts
 */
export class KeyboardShortcutManager {
  private static instance: KeyboardShortcutManager
  private shortcuts: Map<string, { combo: KeyCombo, handler: KeyboardEventHandler, options: KeyboardShortcutOptions }> = new Map()
  private eventListener: (e: KeyboardEvent) => void
  
  private constructor() {
    this.eventListener = this.handleKeyEvent.bind(this)
    document.addEventListener('keydown', this.eventListener)
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): KeyboardShortcutManager {
    if (!KeyboardShortcutManager.instance) {
      // Check if we're in a browser environment before creating the instance
      if (typeof window !== 'undefined') {
        KeyboardShortcutManager.instance = new KeyboardShortcutManager()
      } else {
        // Return a dummy instance for SSR
        return {
          register: () => ({ remove: () => {} }),
          unregister: () => {},
          getActiveShortcuts: () => [],
          checkCombo: () => false
        } as unknown as KeyboardShortcutManager
      }
    }
    return KeyboardShortcutManager.instance
  }
  
  /**
   * Register a keyboard shortcut
   * 
   * @param id - Unique identifier for the shortcut
   * @param combo - Key combination
   * @param handler - Event handler
   * @param options - Keyboard shortcut options
   * @returns Unregister function
   */
  public register(
    id: string,
    combo: KeyCombo,
    handler: KeyboardEventHandler,
    options: KeyboardShortcutOptions = {}
  ): () => void {
    this.shortcuts.set(id, { combo, handler, options })
    
    return () => this.unregister(id)
  }
  
  /**
   * Unregister a keyboard shortcut
   * 
   * @param id - Shortcut identifier
   */
  public unregister(id: string): void {
    this.shortcuts.delete(id)
  }
  
  /**
   * Handle keyboard events and trigger registered shortcuts
   * 
   * @param e - Keyboard event
   */
  private handleKeyEvent(e: KeyboardEvent): void {
    for (const [id, { combo, handler, options }] of this.shortcuts.entries()) {
      const {
        preventDefault = true,
        stopPropagation = true,
        event = 'keydown',
        enableInInputs = false,
        enableWhenHidden = false,
      } = options
      
      // Skip if this is not the right event type
      if (e.type !== event) {
        continue
      }
      
      // Skip if target is an input element and enableInInputs is false
      if (!enableInInputs) {
        const target = e.target as HTMLElement
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable
        ) {
          continue
        }
      }
      
      // Skip if the document is not visible and enableWhenHidden is false
      if (!enableWhenHidden && document.hidden) {
        continue
      }
      
      // Check if the key combo matches
      if (matchesKeyCombo(e, combo)) {
        if (preventDefault) e.preventDefault()
        if (stopPropagation) e.stopPropagation()
        
        handler(e)
        return
      }
    }
  }
  
  /**
   * Get all registered shortcuts
   * 
   * @returns Map of registered shortcuts
   */
  public getShortcuts(): Map<string, { combo: KeyCombo, options: KeyboardShortcutOptions }> {
    const result = new Map<string, { combo: KeyCombo, options: KeyboardShortcutOptions }>()
    
    for (const [id, { combo, options }] of this.shortcuts.entries()) {
      result.set(id, { combo, options })
    }
    
    return result
  }
  
  /**
   * Clear all registered shortcuts or shortcuts with a specific prefix
   * 
   * @param prefix - Optional prefix to clear only matching shortcuts
   */
  public clear(prefix?: string): void {
    if (prefix) {
      for (const id of this.shortcuts.keys()) {
        if (id.startsWith(prefix)) {
          this.shortcuts.delete(id)
        }
      }
    } else {
      this.shortcuts.clear()
    }
  }
  
  /**
   * Cleanup and remove the global event listener
   */
  public destroy(): void {
    document.removeEventListener('keydown', this.eventListener)
    this.shortcuts.clear()
  }
}

// Export singleton instance
export const keyboardShortcuts = KeyboardShortcutManager.getInstance()
