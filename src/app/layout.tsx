import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Sidebar } from '@/components/layout/sidebar'
import { ClientLayout } from './client-layout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
          <Toaster />
        </ClientLayout>
      </body>
    </html>
  )
}
