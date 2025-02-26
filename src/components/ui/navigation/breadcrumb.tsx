'use client'

import { ChevronRight } from 'lucide-react'

export function Breadcrumb({
  project,
  file,
}: {
  project: string
  file: string | null
}) {
  const parts = ['Company', 'Jobs', project, ...(file?.split('/') || [])]

  return (
    <div className="flex items-center bg-[#252526] p-2 text-sm">
      {parts.map((part, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight size={16} className="mx-1" />}
          <span className="cursor-pointer hover:underline">{part}</span>
        </div>
      ))}
    </div>
  )
}
