import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = 0

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch project data
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !project) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded p-1 transition-colors hover:bg-[var(--vscode-highlight)]"
          >
            <ArrowLeft className="h-4 w-4 text-[var(--vscode-text-muted)]" />
          </Link>
          <h1 className="text-lg font-medium text-[var(--vscode-text)]">
            {project.name}
          </h1>
        </div>
      </div>

      <div className="overflow-hidden rounded border border-[var(--vscode-border)] bg-[var(--vscode-highlight)]">
        <div className="border-b border-[var(--vscode-border)] bg-[var(--vscode-sidebar-bg)] px-4 py-2">
          <h2 className="text-sm font-medium text-[var(--vscode-text)]">
            Project Details
          </h2>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm text-[var(--vscode-text-muted)]"
            >
              Description
            </label>
            <p id="description" className="text-sm text-[var(--vscode-text)]">
              {project.description}
            </p>
          </div>
          <div>
            <label
              htmlFor="template-type"
              className="mb-1 block text-sm text-[var(--vscode-text-muted)]"
            >
              Template Type
            </label>
            <p id="template-type" className="text-sm text-[var(--vscode-text)]">
              {project.template_type}
            </p>
          </div>
          <div>
            <label
              htmlFor="last-opened"
              className="mb-1 block text-sm text-[var(--vscode-text-muted)]"
            >
              Last Opened
            </label>
            <p id="last-opened" className="text-sm text-[var(--vscode-text)]">
              {new Date(project.last_opened).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded border border-[var(--vscode-border)] bg-[var(--vscode-highlight)]">
        <div className="border-b border-[var(--vscode-border)] bg-[var(--vscode-sidebar-bg)] px-4 py-2">
          <h2 className="text-sm font-medium text-[var(--vscode-text)]">
            Project Content
          </h2>
        </div>
        <div className="p-4">
          <p className="text-sm text-[var(--vscode-text-muted)]">
            Project content coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
