import React from 'react'
import Link from 'next/link'

// Force the page to be dynamically rendered
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold">Welcome to Lovell</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your intelligent project management platform
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/login"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}
