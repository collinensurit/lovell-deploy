'use client'

import { useState, useCallback } from 'react'

export interface ContextMenuItem {
  label: string
  action: () => void
  icon?: string
  disabled?: boolean
}

interface ContextMenuState {
  isOpen: boolean
  x: number
  y: number
  items: ContextMenuItem[]
}

export function useContextMenu() {
  const [menu, setMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    items: [],
  })

  const showMenu = useCallback(
    (e: React.MouseEvent, items: ContextMenuItem[]) => {
      e.preventDefault()
      setMenu({
        isOpen: true,
        x: e.clientX,
        y: e.clientY,
        items,
      })
    },
    []
  )

  const hideMenu = useCallback(() => {
    setMenu((prev) => ({ ...prev, isOpen: false }))
  }, [])

  return {
    menu,
    showMenu,
    hideMenu,
  }
}
