'use client'

import React from 'react'

export enum Panel {
  Explorer = 'explorer',
  Search = 'search',
  Settings = 'settings',
}

interface LayoutContextType {
  activePanel: Panel | null
  setActivePanel: (panel: Panel | null) => void
}

const LayoutContext = React.createContext<LayoutContextType | null>(null)

export function useLayoutContext() {
  const context = React.useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider')
  }
  return context
}

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [activePanel, setActivePanel] = React.useState<Panel | null>(null)

  return (
    <LayoutContext.Provider value={{ activePanel, setActivePanel }}>
      {children}
    </LayoutContext.Provider>
  )
}
