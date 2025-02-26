'use client'

import { useEffect } from 'react'

export interface PanelShortcutsOptions {
  onTogglePanel?: () => void
  onToggleSidebar?: () => void
  onToggleChat?: () => void
  onToggleTemplates?: () => void
}

export function usePanelShortcuts({
  onTogglePanel,
  onToggleSidebar,
  onToggleChat,
  onToggleTemplates,
}: PanelShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check if cmd/ctrl is pressed
      const isMod = event.metaKey || event.ctrlKey

      if (isMod && event.key === 'b') {
        event.preventDefault()
        onToggleSidebar?.()
      } else if (isMod && event.key === 'j') {
        event.preventDefault()
        onTogglePanel?.()
      } else if (isMod && event.key === 't') {
        event.preventDefault()
        onToggleTemplates?.()
      } else if (isMod && event.key === '/') {
        event.preventDefault()
        onToggleChat?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onTogglePanel, onToggleSidebar, onToggleChat, onToggleTemplates])
}
