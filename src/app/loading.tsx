'use client'

import * as React from 'react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-4 max-w-sm w-full">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Loading application...
        </div>
      </div>
    </div>
  )
}
