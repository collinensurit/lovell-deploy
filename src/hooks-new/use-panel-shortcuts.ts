'use client'

import { useEffect } from 'react'

/**
 * Options for keyboard shortcuts that control UI panels
 */
export interface PanelShortcutsOptions {
  /** Callback for toggling the main panel (Cmd/Ctrl+J) */
  onTogglePanel?: () => void;
  /** Callback for toggling the sidebar (Cmd/Ctrl+B) */
  onToggleSidebar?: () => void;
  /** Callback for toggling the chat panel (Cmd/Ctrl+/) */
  onToggleChat?: () => void;
  /** Callback for toggling the templates panel (Cmd/Ctrl+T) */
  onToggleTemplates?: () => void;
}

/**
 * Hook to handle keyboard shortcuts for controlling UI panels
 * 
 * @param options - Configuration options for keyboard shortcuts
 */
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
