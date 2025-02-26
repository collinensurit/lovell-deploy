// Server component
import React from 'react'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
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
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
