import { useState } from 'react'

interface ContextMenuState {
  visible: boolean
  x: number
  y: number
}

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

  const showContextMenu = (x: number, y: number) => {
    setContextMenu({ visible: true, x, y })
  }

  const hideContextMenu = () => {
    setContextMenu(null)
  }

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  }
}
