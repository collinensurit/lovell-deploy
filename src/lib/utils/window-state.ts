import { z } from 'zod'

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

export class WindowStateManager {
  private static instance: WindowStateManager
  private windowStates: Map<string, WindowState>
  private layoutPresets: Map<string, LayoutPreset>

  private constructor() {
    this.windowStates = new Map()
    this.layoutPresets = new Map()
    this.loadFromStorage()
  }

  static getInstance(): WindowStateManager {
    if (!WindowStateManager.instance) {
      WindowStateManager.instance = new WindowStateManager()
    }
    return WindowStateManager.instance
  }

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
          } catch (e) {
            console.error(`Invalid window state for ${id}:`, e)
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
          } catch (e) {
            console.error(`Invalid layout preset for ${id}:`, e)
          }
        })
      }
    } catch (e) {
      console.error('Error loading window states:', e)
    }
  }

  private saveToStorage() {
    try {
      // Save window states
      const states = Object.fromEntries(this.windowStates.entries())
      localStorage.setItem(STORAGE_KEY, JSON.stringify(states))

      // Save layout presets
      const presets = Object.fromEntries(this.layoutPresets.entries())
      localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
    } catch (e) {
      console.error('Error saving window states:', e)
    }
  }

  getWindowState(id: string): WindowState | undefined {
    return this.windowStates.get(id)
  }

  setWindowState(id: string, state: WindowState) {
    this.windowStates.set(id, state)
    this.saveToStorage()
  }

  removeWindowState(id: string) {
    this.windowStates.delete(id)
    this.saveToStorage()
  }

  getAllWindowStates(): WindowState[] {
    return Array.from(this.windowStates.values())
  }

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

  updateLayoutPreset(
    id: string,
    updates: Partial<Omit<LayoutPreset, 'id' | 'createdAt'>>
  ) {
    const existing = this.layoutPresets.get(id)
    if (!existing) return

    const updated: LayoutPreset = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.layoutPresets.set(id, updated)
    this.saveToStorage()
    return updated
  }

  deleteLayoutPreset(id: string) {
    this.layoutPresets.delete(id)
    this.saveToStorage()
  }

  getLayoutPreset(id: string): LayoutPreset | undefined {
    return this.layoutPresets.get(id)
  }

  getAllLayoutPresets(): LayoutPreset[] {
    return Array.from(this.layoutPresets.values())
  }

  applyLayoutPreset(id: string): boolean {
    const preset = this.layoutPresets.get(id)
    if (!preset) return false

    // Clear current window states
    this.windowStates.clear()

    // Apply preset window states
    preset.windows.forEach((state) => {
      this.windowStates.set(state.id, state)
    })

    this.saveToStorage()
    return true
  }

  clearAllStates() {
    this.windowStates.clear()
    this.saveToStorage()
  }
}
