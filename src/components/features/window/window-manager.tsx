'use client'

import React from 'react'
import { useWindowContext } from '@/lib/window-context'
import { Window } from '@/components/ui/window'
import type { WindowState } from '@/components/window-manager'

export interface WindowProps {
  id: string
  title: string
  content: React.ReactNode
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onRestore: () => void
  onPositionChange: (position: { x: number; y: number }) => void
  onSizeChange: (size: { width: number; height: number }) => void
}

export interface WindowContextType {
  windows: WindowState[]
  dispatch: React.Dispatch<
    | {
        type: 'ADD_WINDOW'
        payload: WindowState
      }
    | {
        type: 'REMOVE_WINDOW'
        id: string
      }
    | {
        type: 'UPDATE_WINDOW'
        id: string
        updates: Partial<WindowState>
      }
    | {
        type: 'MINIMIZE_WINDOW'
        id: string
      }
    | {
        type: 'MAXIMIZE_WINDOW'
        id: string
      }
    | {
        type: 'RESTORE_WINDOW'
        id: string
      }
  >
}

export function WindowManager() {
  const { windows, dispatch } = useWindowContext()

  const handleClose = (id: string) => {
    dispatch({ type: 'REMOVE_WINDOW', id })
  }

  const handleMinimize = (id: string) => {
    dispatch({ type: 'MINIMIZE_WINDOW', id })
  }

  const handleMaximize = (id: string) => {
    dispatch({ type: 'MAXIMIZE_WINDOW', id })
  }

  const handleRestore = (id: string) => {
    dispatch({ type: 'RESTORE_WINDOW', id })
  }

  const handlePositionChange = (
    id: string,
    position: { x: number; y: number }
  ) => {
    dispatch({
      type: 'UPDATE_WINDOW',
      id,
      updates: { position },
    })
  }

  const handleSizeChange = (
    id: string,
    size: { width: number; height: number }
  ) => {
    dispatch({
      type: 'UPDATE_WINDOW',
      id,
      updates: { size },
    })
  }

  return (
    <div className="pointer-events-none fixed inset-0">
      {windows.map((window: WindowState) => (
        <div key={window.id} className="pointer-events-auto">
          <Window
            {...window}
            onClose={() => handleClose(window.id)}
            onMinimize={() => handleMinimize(window.id)}
            onMaximize={() => handleMaximize(window.id)}
            onRestore={() => handleRestore(window.id)}
            onPositionChange={(position) =>
              handlePositionChange(window.id, position)
            }
            onSizeChange={(size) => handleSizeChange(window.id, size)}
          />
        </div>
      ))}
    </div>
  )
}
