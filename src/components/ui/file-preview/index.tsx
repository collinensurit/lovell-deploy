import * as React from 'react'

interface FilePreviewProps {
  className?: string
  file: {
    id: string
    name: string
    type: string
    content?: string
  }
  onSelect?: (fileId: string) => void
  onOpen?: (fileId: string) => void
  onDelete?: (fileId: string) => void
}

export function FilePreview({
  className,
  file,
  onSelect,
  onOpen,
  onDelete,
}: FilePreviewProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-medium">{file.name}</h2>
        <div className="flex space-x-2">
          {onOpen && (
            <button
              onClick={() => onOpen(file.id)}
              className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
            >
              Open
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(file.id)}
              className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        {file.content ? (
          <pre className="whitespace-pre-wrap">{file.content}</pre>
        ) : (
          <p>No preview available</p>
        )}
      </div>
    </div>
  )
}
