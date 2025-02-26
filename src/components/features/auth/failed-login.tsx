'use client'

import { useRouter } from 'next/navigation'

export function FailedLogin() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-[var(--vscode-text)]">
          Login Failed
        </h1>
        <p className="text-[var(--vscode-text-muted)]">
          There was a problem logging you in. Please try again.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="rounded bg-[var(--vscode-button)] px-4 py-2 text-white transition-colors hover:bg-[var(--vscode-button-hover)]"
        >
          Return to Login
        </button>
      </div>
    </div>
  )
}
