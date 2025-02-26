'use client'

import React from 'react'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-static'
export const revalidate = 0

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold">Dashboard Coming Soon</h1>
          <p className="mt-2 text-sm text-gray-600">
            We're working on your dashboard experience.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/"
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
