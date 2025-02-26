'use client'

import { FileText, CheckCircle, AlertCircle } from 'lucide-react'
import * as React from 'react'

const projects = [
  {
    id: '24.0019610',
    name: 'North Capitol Bldg Project',
    fileCount: 23,
    status: 'active',
  },
  {
    id: '24.0019611',
    name: 'South Market Renovation',
    fileCount: 15,
    status: 'pending',
  },
  {
    id: '24.0019612',
    name: 'East River Bridge',
    fileCount: 31,
    status: 'active',
  },
  {
    id: '24.0019613',
    name: 'West End Park',
    fileCount: 8,
    status: 'completed',
  },
]

interface DashboardProps {
  onProjectSelect: (projectId: string) => void
}

export function Dashboard({ onProjectSelect }: DashboardProps) {
  const handleProjectSelect = (projectId: string) => {
    onProjectSelect(projectId)
  }

  return (
    <div role="region" aria-label="Projects Dashboard" className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Projects Dashboard</h1>
      <div
        role="list"
        aria-label="Projects grid"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            className="flex h-full w-full flex-col rounded-lg bg-[#252526] p-4 shadow-md transition-colors hover:bg-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => handleProjectSelect(project.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleProjectSelect(project.id)
              }
            }}
            aria-label={`Select project ${project.name}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-medium">{project.name}</h2>
              {project.status === 'active' && (
                <CheckCircle className="text-green-500" size={20} />
              )}
              {project.status === 'pending' && (
                <AlertCircle className="text-yellow-500" size={20} />
              )}
              {project.status === 'completed' && (
                <CheckCircle className="text-blue-500" size={20} />
              )}
            </div>
            <p className="text-sm text-[#A0A0A0]">Job ID: {project.id}</p>
            <div className="mt-4 flex items-center text-sm">
              <FileText size={16} className="mr-2" />
              <span>{project.fileCount} files</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
