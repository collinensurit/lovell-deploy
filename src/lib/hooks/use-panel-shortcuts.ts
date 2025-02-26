'use client'

import { useEffect } from 'react'

interface PanelShortcutsProps {
  onTogglePanel: () => void
  onToggleSidebar: () => void
  onToggleChat: () => void
}

export function usePanelShortcuts({
  onTogglePanel,
  onToggleSidebar,
  onToggleChat,
}: PanelShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'b') {
        e.preventDefault()
        onToggleSidebar()
      } else if (e.metaKey && e.key === 'j') {
        e.preventDefault()
        onTogglePanel()
      } else if (e.metaKey && e.key === 'k') {
        e.preventDefault()
        onToggleChat()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onTogglePanel, onToggleSidebar, onToggleChat])
}
