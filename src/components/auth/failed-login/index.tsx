'use client'

import React from 'react'
import Link from 'next/link'

export const FailedLogin: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Login Failed
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We were unable to log you in. This could be due to:
          </p>
          <ul className="mt-4 list-inside list-disc text-sm text-gray-600">
            <li>Invalid credentials</li>
            <li>Account not found</li>
            <li>Account not verified</li>
          </ul>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/login"
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </Link>
          <Link
            href="/signup"
            className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Account
          </Link>
          <Link
            href="/reset-password"
            className="flex w-full justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Reset Password
          </Link>
        </div>
      </div>
    </div>
  )
}
