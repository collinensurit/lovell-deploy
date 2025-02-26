'use client'

import React from 'react'
import type { Project } from '@/lib/types/project'

export interface ProjectListProps {
  projects: Project[]
  onCreateProject?: () => void
  onSelect?: (project: Project) => void
}

export function ProjectList({
  projects,
  onCreateProject,
  onSelect,
}: ProjectListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        {onCreateProject && (
          <button
            onClick={onCreateProject}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            New Project
          </button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect?.(project)
              }
            }}
            onClick={() => onSelect?.(project)}
            className="cursor-pointer rounded-lg border border-gray-200 p-4 hover:border-blue-500 dark:border-gray-800"
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
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center">
            <p className="text-gray-500 dark:text-gray-400">No projects yet</p>
            {onCreateProject && (
              <button
                onClick={onCreateProject}
                className="mt-2 text-blue-500 hover:text-blue-600"
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
