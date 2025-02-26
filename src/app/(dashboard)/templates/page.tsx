export const dynamic = 'force-static';
export const revalidate = 0;
import * as React from 'react'
import { TemplatesContent } from './content'

export default function TemplatesPage() {
  return (
    <TemplatesContent>
      <div className="grid gap-4 p-4">
        <div className="text-sm text-muted-foreground">
          No templates found. Create a new template to get started.
        </div>
      </div>
    </TemplatesContent>
  )
}
