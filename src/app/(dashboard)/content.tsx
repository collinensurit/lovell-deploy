'use client'

import React, { useState } from 'react'
import { Project, ProjectInsert } from '@/types/types'
import { createProject } from '@/lib/services/projects'
import { useToast } from '@/components/ui/use-toast'

export default function DashboardContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const { toast } = useToast()

  const handleCreateProject = async () => {
    try {
      const newProject: ProjectInsert = {
        name: 'New Project',
        description: 'A new project',
        owner_id: 'user123', // This should come from auth context
      }

      const project = await createProject(newProject)
      setProjects((prev) => [...prev, project])
      toast({
        title: 'Project created',
        description: 'Your new project has been created successfully.',
      })
    } catch (error) {
      console.error('Failed to create project:', error)
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Projects</h1>
      <button
        onClick={handleCreateProject}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Create Project
      </button>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border p-4 transition-shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-gray-600">{project.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              Created: {new Date(project.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
