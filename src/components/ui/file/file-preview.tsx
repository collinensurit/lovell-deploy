'use client'

import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Loader2 } from 'lucide-react'

interface FilePreviewProps {
  filePath: string
}

export function FilePreview({ filePath }: FilePreviewProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFileContent = useCallback(async () => {
    if (!filePath) return

    setLoading(true)
    try {
      const response = await fetch(
        `/api/files/content?path=${encodeURIComponent(filePath)}`
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.statusText}`)
      }
      const data = await response.json()
      setContent(data.content)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load file content'
      )
    } finally {
      setLoading(false)
    }
  }, [filePath])

  useEffect(() => {
    if (filePath) {
      fetchFileContent()
    }
  }, [filePath, fetchFileContent])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-destructive">{error}</div>
        <button
          onClick={fetchFileContent}
          className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
