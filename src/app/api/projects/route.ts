import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createProject, listProjects } from '@/lib/services/projects'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit')) || 10
    const projects = await listProjects()
    return NextResponse.json(projects.slice(0, limit))
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const project = await createProject(data)
    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
