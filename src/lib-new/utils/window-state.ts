'use client'

import { z } from 'zod'

/**
 * Schema for window state validation
 */
const WindowStateSchema = z.object({
  id: z.string(),
  gridPosition: z.object({
    row: z.number(),
    col: z.number(),
  }),
  gridSize: z.object({
    rows: z.number(),
    cols: z.number(),
  }),
  isMinimized: z.boolean(),
  isMaximized: z.boolean(),
  zIndex: z.number(),
})

/**
 * Schema for layout preset validation
 */
const LayoutPresetSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  windows: z.array(WindowStateSchema),
  gridSize: z.object({
    rows: z.number(),
    cols: z.number(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type WindowState = z.infer<typeof WindowStateSchema>
export type LayoutPreset = z.infer<typeof LayoutPresetSchema>

const STORAGE_KEY = 'window-layout-state'
const PRESETS_KEY = 'window-layout-presets'

/**
 * Singleton manager for window states and layout presets
 * Handles persistence, retrieval, and manipulation of window layouts
 */
export class WindowStateManager {
  private static instance: WindowStateManager
  private windowStates: Map<string, WindowState>
  private layoutPresets: Map<string, LayoutPreset>

  private constructor() {
    this.windowStates = new Map()
    this.layoutPresets = new Map()
    this.loadFromStorage()
  }

  /**
   * Get the singleton instance of WindowStateManager
   */
  static getInstance(): WindowStateManager {
    if (!WindowStateManager.instance) {
      WindowStateManager.instance = new WindowStateManager()
    }
    return WindowStateManager.instance
  }

  /**
   * Load window states and layout presets from localStorage
   */
  private loadFromStorage() {
    try {
      // Load window states
      const savedStates = localStorage.getItem(STORAGE_KEY)
      if (savedStates) {
        const parsed = JSON.parse(savedStates)
        Object.entries(parsed).forEach(([id, state]) => {
          try {
            const validState = WindowStateSchema.parse(state)
            this.windowStates.set(id, validState)
          } catch (error) {
            console.error(`Invalid window state for ID ${id}:`, error)
          }
        })
      }

      // Load layout presets
      const savedPresets = localStorage.getItem(PRESETS_KEY)
      if (savedPresets) {
        const parsed = JSON.parse(savedPresets)
        Object.entries(parsed).forEach(([id, preset]) => {
          try {
            const validPreset = LayoutPresetSchema.parse(preset)
            this.layoutPresets.set(id, validPreset)
          } catch (error) {
            console.error(`Invalid layout preset for ID ${id}:`, error)
          }
        })
      }
    } catch (error) {
      console.error('Error loading window state from storage:', error)
    }
  }

  /**
   * Save current window states and layout presets to localStorage
   */
  private saveToStorage() {
    try {
      // Save window states
      const statesObject = Object.fromEntries(this.windowStates.entries())
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statesObject))

      // Save layout presets
      const presetsObject = Object.fromEntries(this.layoutPresets.entries())
      localStorage.setItem(PRESETS_KEY, JSON.stringify(presetsObject))
    } catch (error) {
      console.error('Error saving window state to storage:', error)
    }
  }

  /**
   * Get a window state by ID
   * 
   * @param id - The window ID
   * @returns The window state or undefined if not found
   */
  getWindowState(id: string): WindowState | undefined {
    return this.windowStates.get(id)
  }

  /**
   * Set a window state
   * 
   * @param id - The window ID
   * @param state - The window state to set
   */
  setWindowState(id: string, state: WindowState) {
    this.windowStates.set(id, state)
    this.saveToStorage()
  }

  /**
   * Remove a window state
   * 
   * @param id - The window ID to remove
   */
  removeWindowState(id: string) {
    this.windowStates.delete(id)
    this.saveToStorage()
  }

  /**
   * Get all window states
   * 
   * @returns Array of all window states
   */
  getAllWindowStates(): WindowState[] {
    return Array.from(this.windowStates.values())
  }

  /**
   * Save a new layout preset
   * 
   * @param preset - The preset data to save
   */
  saveLayoutPreset(
    preset: Omit<LayoutPreset, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    const fullPreset: LayoutPreset = {
      ...preset,
      id,
      createdAt: now,
      updatedAt: now,
    }
    
    this.layoutPresets.set(id, fullPreset)
    this.saveToStorage()
    return fullPreset
  }

  /**
   * Update an existing layout preset
   * 
   * @param id - The preset ID to update
   * @param updates - The fields to update
   */
  updateLayoutPreset(
    id: string,
    updates: Partial<Omit<LayoutPreset, 'id' | 'createdAt'>>
  ) {
    const existing = this.layoutPresets.get(id)
    if (!existing) {
      return false
    }
    
    const updated: LayoutPreset = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    this.layoutPresets.set(id, updated)
    this.saveToStorage()
    return true
  }

  /**
   * Delete a layout preset
   * 
   * @param id - The preset ID to delete
   */
  deleteLayoutPreset(id: string) {
    const success = this.layoutPresets.delete(id)
    if (success) {
      this.saveToStorage()
    }
    return success
  }

  /**
   * Get a layout preset by ID
   * 
   * @param id - The preset ID
   * @returns The layout preset or undefined if not found
   */
  getLayoutPreset(id: string): LayoutPreset | undefined {
    return this.layoutPresets.get(id)
  }

  /**
   * Get all layout presets
   * 
   * @returns Array of all layout presets
   */
  getAllLayoutPresets(): LayoutPreset[] {
    return Array.from(this.layoutPresets.values())
  }

  /**
   * Apply a layout preset by ID
   * 
   * @param id - The preset ID to apply
   * @returns Whether the preset was successfully applied
   */
  applyLayoutPreset(id: string): boolean {
    const preset = this.layoutPresets.get(id)
    if (!preset) {
      return false
    }
    
    // Clear existing states first
    this.windowStates.clear()
    
    // Apply the preset window states
    preset.windows.forEach(windowState => {
      this.windowStates.set(windowState.id, windowState)
    })
    
    this.saveToStorage()
    return true
  }

  /**
   * Clear all window states
   */
  clearAllStates() {
    this.windowStates.clear()
    this.saveToStorage()
  }
}
