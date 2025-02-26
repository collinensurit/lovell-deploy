'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import components that use browser-specific APIs with SSR disabled
const DynamicFileUtils = dynamic(() => import('./client-component'), { 
  ssr: false,
  loading: () => <p>Loading file utilities...</p>
})

export default function FileUtilitiesPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">File Utilities Demo</h1>
      <DynamicFileUtils />
    </div>
  )
}
