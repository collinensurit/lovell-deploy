'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      router.push('/login?message=Check your email to confirm your account')
    } catch (err: Error | unknown) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      )
    }
  }

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--vscode-text)]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border border-[var(--vscode-border)] bg-[var(--vscode-editor-background)] px-3 py-2 text-sm focus:border-[var(--vscode-button)] focus:outline-none"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[var(--vscode-text)]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border border-[var(--vscode-border)] bg-[var(--vscode-editor-background)] px-3 py-2 text-sm focus:border-[var(--vscode-button)] focus:outline-none"
            required
          />
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button
          type="submit"
          className="w-full rounded bg-[var(--vscode-button)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--vscode-button-hover)] focus:outline-none"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}
