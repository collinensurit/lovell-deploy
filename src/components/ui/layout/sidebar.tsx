'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  FolderIcon,
  DocumentIcon,
  CogIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Templates', href: '/templates', icon: DocumentIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-16 flex-col items-center border-r border-[var(--vscode-border)] bg-[var(--vscode-editor-background)]">
      <div className="flex flex-1 flex-col space-y-4 p-3">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors ${
                isActive
                  ? 'bg-[var(--vscode-button)] text-white'
                  : 'text-[var(--vscode-text-muted)] hover:bg-[var(--vscode-button-hover)] hover:text-white'
              }`}
              title={item.name}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
