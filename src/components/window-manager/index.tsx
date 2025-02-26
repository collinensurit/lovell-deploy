'use client'

import React from 'react'

export interface WindowState {
  id: string
  title: string
  content: React.ReactNode
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
}

export type WindowAction =
  | { type: 'ADD_WINDOW'; window: WindowState }
  | { type: 'REMOVE_WINDOW'; id: string }
  | { type: 'UPDATE_WINDOW'; id: string; updates: Partial<WindowState> }
  | { type: 'MINIMIZE_WINDOW'; id: string }
  | { type: 'MAXIMIZE_WINDOW'; id: string }
  | { type: 'RESTORE_WINDOW'; id: string }

export interface WindowManagerState {
  windows: WindowState[]
}

export function windowManagerReducer(
  state: WindowManagerState,
  action: WindowAction
): WindowManagerState {
  switch (action.type) {
    case 'ADD_WINDOW':
      return {
        ...state,
        windows: [...state.windows, action.window],
      }
    case 'REMOVE_WINDOW':
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.id),
      }
    case 'UPDATE_WINDOW':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, ...action.updates } : w
        ),
      }
    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, isMinimized: true } : w
        ),
      }
    case 'MAXIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, isMaximized: true, isMinimized: false }
            : w
        ),
      }
    case 'RESTORE_WINDOW':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, isMaximized: false, isMinimized: false }
            : w
        ),
      }
    default:
      return state
  }
}

export function WindowManager() {
  const [state] = React.useReducer(windowManagerReducer, {
    windows: [],
  })

  return (
    <div className="pointer-events-none fixed inset-0">
      {state.windows.map((window) => (
        <div key={window.id} className="pointer-events-auto">
          {/* Render your Window component here */}
        </div>
      ))}
    </div>
  )
}
