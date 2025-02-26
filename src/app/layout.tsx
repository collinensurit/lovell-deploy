'use client'

import React, { Suspense } from 'react'
import { Toaster } from '@/components/ui/toaster'
import dynamic from 'next/dynamic'
import Loading from './loading'

// Dynamically import components to prevent SSR issues
const Sidebar = dynamic(() => import('@/components/layout/sidebar').then(mod => mod.Sidebar), {
  ssr: false,
  loading: () => <div className="w-16 bg-gray-100" />
})

const ClientLayout = dynamic(() => import('./client-layout').then(mod => ({ default: mod.ClientLayout })), {
  ssr: false,
  loading: () => <Loading />
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<Loading />}>
          <ClientLayout>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
            <Toaster />
          </ClientLayout>
        </Suspense>
      </body>
    </html>
  )
}
