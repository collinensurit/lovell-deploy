import React from 'react'

export type PanelType = 'files' | 'search' | 'templates' | 'chat'

export interface Panel {
  id: string
  type: PanelType
  isVisible: boolean
  isDocked: boolean
}

interface LayoutState {
  panels: Panel[]
}

type LayoutAction =
  | { type: 'TOGGLE_PANEL_VISIBILITY'; payload: string }
  | { type: 'TOGGLE_PANEL_DOCK'; payload: string }
  | { type: 'SAVE_PANEL_LAYOUT' }

interface LayoutContextType {
  panels: Panel[]
  togglePanelVisibility: (id: string) => void
  togglePanelDock: (id: string) => void
  savePanelLayout: () => void
}

const LayoutContext = React.createContext<LayoutContextType | undefined>(
  undefined
)

function layoutReducer(state: LayoutState, action: LayoutAction): LayoutState {
  switch (action.type) {
    case 'TOGGLE_PANEL_VISIBILITY':
      return {
        ...state,
        panels: state.panels.map((panel) =>
          panel.id === action.payload
            ? { ...panel, isVisible: !panel.isVisible }
            : panel
        ),
      }
    case 'TOGGLE_PANEL_DOCK':
      return {
        ...state,
        panels: state.panels.map((panel) =>
          panel.id === action.payload
            ? { ...panel, isDocked: !panel.isDocked }
            : panel
        ),
      }
    case 'SAVE_PANEL_LAYOUT':
      // Save panel layout to local storage or backend
      localStorage.setItem('panelLayout', JSON.stringify(state.panels))
      return state
    default:
      return state
  }
}

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(layoutReducer, {
    panels: [
      { id: 'files', type: 'files', isVisible: true, isDocked: true },
      { id: 'search', type: 'search', isVisible: false, isDocked: true },
      { id: 'templates', type: 'templates', isVisible: false, isDocked: true },
      { id: 'chat', type: 'chat', isVisible: false, isDocked: true },
    ],
  })

  const togglePanelVisibility = (id: string) => {
    dispatch({ type: 'TOGGLE_PANEL_VISIBILITY', payload: id })
  }

  const togglePanelDock = (id: string) => {
    dispatch({ type: 'TOGGLE_PANEL_DOCK', payload: id })
  }

  const savePanelLayout = () => {
    dispatch({ type: 'SAVE_PANEL_LAYOUT' })
  }

  const value = {
    panels: state.panels,
    togglePanelVisibility,
    togglePanelDock,
    savePanelLayout,
  }

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  )
}

export function useLayoutContext() {
  const context = React.useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayoutContext must be used within a LayoutProvider')
  }
  return context
}
