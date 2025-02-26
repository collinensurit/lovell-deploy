import React from 'react'
import type { WindowState, WindowAction } from '@/components/window-manager'

interface WindowContextType {
  windows: WindowState[]
  dispatch: React.Dispatch<WindowAction>
}

const WindowContext = React.createContext<WindowContextType | null>(null)

function windowReducer(
  state: WindowState[],
  action: WindowAction
): WindowState[] {
  switch (action.type) {
    case 'ADD_WINDOW':
      return [...state, action.window]
    case 'REMOVE_WINDOW':
      return state.filter((w) => w.id !== action.id)
    case 'UPDATE_WINDOW':
      return state.map((w) =>
        w.id === action.id ? { ...w, ...action.updates } : w
      )
    case 'MINIMIZE_WINDOW':
      return state.map((w) =>
        w.id === action.id ? { ...w, isMinimized: true } : w
      )
    case 'MAXIMIZE_WINDOW':
      return state.map((w) =>
        w.id === action.id ? { ...w, isMaximized: true, isMinimized: false } : w
      )
    case 'RESTORE_WINDOW':
      return state.map((w) =>
        w.id === action.id
          ? { ...w, isMaximized: false, isMinimized: false }
          : w
      )
    default:
      return state
  }
}

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [windows, dispatch] = React.useReducer(windowReducer, [])

  return (
    <WindowContext.Provider value={{ windows, dispatch }}>
      {children}
    </WindowContext.Provider>
  )
}

export function useWindowContext() {
  const context = React.useContext(WindowContext)
  if (!context) {
    throw new Error('useWindowContext must be used within a WindowProvider')
  }
  return context
}
