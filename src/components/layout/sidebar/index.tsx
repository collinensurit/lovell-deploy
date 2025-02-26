import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface SidebarProps {
  className?: string
}

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Dashboard', icon: 'home' },
    { href: '/projects', label: 'Projects', icon: 'folder' },
    { href: '/files', label: 'Files', icon: 'file' },
    { href: '/templates', label: 'Templates', icon: 'template' },
    { href: '/settings', label: 'Settings', icon: 'settings' },
  ]

  return (
    <aside
      className={`flex h-full w-16 flex-col items-center border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <nav className="flex flex-1 flex-col items-center space-y-4 py-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              pathname === link.href
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
            }`}
          >
            <span className="sr-only">{link.label}</span>
            <i className={`icon-${link.icon} h-5 w-5`} />
          </Link>
        ))}
      </nav>
    </aside>
  )
}
