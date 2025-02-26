import React from 'react'
import { ProjectListProps } from '@/lib/types'

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelect,
  onDelete,
  onArchive,
}) => {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelect?.(project)
                }
              }}
              onClick={() => onSelect?.(project)}
              className="flex-1 cursor-pointer rounded-lg border p-4 hover:bg-gray-50"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {project.name}
              </h3>
              {project.description && (
                <p className="mt-1 text-sm text-gray-500">
                  {project.description}
                </p>
              )}
              <div className="mt-2 text-xs text-gray-400">
                Last updated: {new Date(project.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onArchive?.(project.id)}
                className="text-gray-400 hover:text-gray-500"
                title="Archive project"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete?.(project.id)}
                className="text-red-400 hover:text-red-500"
                title="Delete project"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
      {projects.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          No projects found. Create your first project to get started.
        </div>
      )}
    </div>
  )
}
