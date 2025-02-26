'use client'

import { useState, useCallback } from 'react'

/**
 * Represents an item in the context menu
 */
export interface ContextMenuItem {
  /** Label displayed in the menu */
  label: string;
  /** Function executed when this item is clicked */
  action: () => void;
  /** Optional icon to display with this item */
  icon?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
}

/**
 * Represents the state of the context menu
 */
interface ContextMenuState {
  /** Whether the menu is currently open */
  isOpen: boolean;
  /** X-coordinate of the menu */
  x: number;
  /** Y-coordinate of the menu */
  y: number;
  /** Menu items to display */
  items: ContextMenuItem[];
}

/**
 * Hook for managing a context menu
 * 
 * @returns Methods and state for controlling a context menu
 */
export function useContextMenu() {
  const [menu, setMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    items: [],
  })

  /**
   * Show the context menu at the specified position with the given items
   */
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

  /**
   * Hide the context menu
   */
  const hideMenu = useCallback(() => {
    setMenu((prev) => ({ ...prev, isOpen: false }))
  }, [])

  return {
    menu,
    showMenu,
    hideMenu,
  }
}
