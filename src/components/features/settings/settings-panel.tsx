'use client'

import { FC } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export const SettingsPanel: FC = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-medium">Settings</h2>

      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-medium">Account</h3>
          <Button onClick={handleSignOut} variant="destructive">
            Sign Out
          </Button>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium">Theme</h3>
          <div className="flex gap-2">
            <Button variant="outline">Light</Button>
            <Button variant="outline">Dark</Button>
            <Button variant="outline">System</Button>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium">About</h3>
          <div className="text-sm">
            <p>Version: 1.0.0</p>
            <p> 2025 Lovell. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
