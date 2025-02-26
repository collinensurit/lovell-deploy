import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Settings as SettingsIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-5 w-5 text-[var(--vscode-text-muted)]" />
        <h1 className="text-lg font-medium text-[var(--vscode-text)]">
          Settings
        </h1>
      </div>

      <div className="space-y-4">
        <div className="overflow-hidden rounded border border-[var(--vscode-border)] bg-[var(--vscode-highlight)]">
          <div className="border-b border-[var(--vscode-border)] bg-[var(--vscode-sidebar-bg)] px-4 py-2">
            <h2 className="text-sm font-medium text-[var(--vscode-text)]">
              Profile
            </h2>
          </div>
          <div className="space-y-4 p-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm text-[var(--vscode-text-muted)]"
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                value={session.user.email}
                readOnly
                className="w-full rounded border border-[var(--vscode-border)] bg-[var(--vscode-bg)] px-3 py-1.5 text-sm text-[var(--vscode-text)] focus:border-[var(--vscode-button)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded border border-[var(--vscode-border)] bg-[var(--vscode-highlight)]">
          <div className="border-b border-[var(--vscode-border)] bg-[var(--vscode-sidebar-bg)] px-4 py-2">
            <h2 className="text-sm font-medium text-[var(--vscode-text)]">
              Preferences
            </h2>
          </div>
          <div className="p-4">
            <p className="text-sm text-[var(--vscode-text-muted)]">
              More settings coming soon...
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded border border-[var(--vscode-border)] bg-[var(--vscode-highlight)]">
          <div className="border-b border-[var(--vscode-border)] bg-[var(--vscode-sidebar-bg)] px-4 py-2">
            <h2 className="text-sm font-medium text-[var(--vscode-text)]">
              About
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-[var(--vscode-text-muted)]">
                Version: 1.0.0
              </p>
              <p className="text-sm text-[var(--vscode-text-muted)]">
                Made with ❤️ by the Lovell team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
