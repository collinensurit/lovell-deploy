'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useTheme, Theme } from '@/lib-new/utils/theme'
import { useKeyboardShortcut } from '@/lib-new/utils/keyboard'
import { notifications } from '@/lib-new/utils/notification'

/**
 * Theme toggle component that uses our custom theme utilities
 * Allows switching between light, dark, and system themes
 */
export function ThemeToggle() {
  const [theme, setTheme, currentMode] = useTheme()
  
  // Setup keyboard shortcut Ctrl+Shift+T to toggle theme
  useKeyboardShortcut(
    'ctrl+shift+t',
    () => {
      const themeMap: Record<Theme, Theme> = {
        light: 'dark',
        dark: 'system',
        system: 'light'
      }
      
      const newTheme = themeMap[theme]
      setTheme(newTheme)
      
      notifications.info(`Theme changed to ${newTheme}`)
    },
    { enableInInputs: false }
  )
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
          {theme === 'light' && ' ✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
          {theme === 'dark' && ' ✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
          {theme === 'system' && ' ✓'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
