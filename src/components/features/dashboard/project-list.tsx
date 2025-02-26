'use client'

import React from 'react'
import type { Project } from '@/lib/types/project'
import { cn } from '@/lib-new/utils'

export interface ProjectListProps {
  projects: Project[]
  onCreateProject?: () => void
  onSelect?: (project: Project) => void
  className?: string
}

export function ProjectList({
  projects,
  onCreateProject,
  onSelect,
  className,
}: ProjectListProps) {
  const handleSelect = (project: Project) => {
    onSelect?.(project)
  }

  return (
    <div
      role="list"
      aria-label="Projects list"
      className={cn('space-y-4', className)}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        {onCreateProject && (
          <button
            onClick={onCreateProject}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            aria-label="Create new project"
          >
            New Project
          </button>
        )}
      </div>
      <div
        role="listbox"
        aria-label="Projects grid"
        className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}
      >
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleSelect(project)}
            className="w-full cursor-pointer rounded-lg border border-gray-200 p-4 text-left hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            role="option"
            aria-selected={false}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSelect(project)
              }
            }}
          >
            <h3 className="text-lg font-medium">{project.name}</h3>
            {project.description && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {project.description}
              </p>
            )}
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Updated {new Date(project.updatedAt).toLocaleDateString()}
            </div>
          </button>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center">
            <p className="text-gray-500 dark:text-gray-400">No projects yet</p>
            {onCreateProject && (
              <button
                onClick={onCreateProject}
                className="mt-2 text-blue-500 hover:text-blue-600"
                aria-label="Create your first project"
              >
                Create your first project
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
