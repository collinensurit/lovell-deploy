# File Preview Components

This directory contains components for previewing different types of files.

## Components

### FileViewer

The main component for previewing files. It supports various file types including:
- Images
- PDFs
- Text files
- Audio files
- Video files
- And more

Features:
- Download button
- Maximize view
- File information display
- Image editing capabilities

### FileContentLoader

A component for loading and displaying file contents from a server path.
- Handles loading states
- Error handling
- Content display

### CodePreview

A simple component for displaying code with syntax highlighting.
- Syntax highlighting based on language
- Scrollable area
- Monospace font

## Migrating from Old Components

Previously, we had file preview components in multiple locations:
- `/src/components/ui/file-preview/index.tsx` - Rich file preview (now FileViewer)
- `/src/components/ui/file/file-preview.tsx` - Path-based content loader (now FileContentLoader)
- `/src/components/ui/file/file-preview/index.tsx` - Simple code preview (now CodePreview)

These have been consolidated into this directory with more specific names to avoid confusion.

## Example Usage

```tsx
// Rich file viewer for local files
import { FileViewer } from '@/components/ui/file/file-preview/file-viewer'

function MyComponent() {
  const file = new File(['content'], 'example.txt')
  return <FileViewer file={file} showActions />
}

// Loading file content from server
import { FileContentLoader } from '@/components/ui/file/file-preview/file-content-loader'

function ServerFileViewer() {
  return <FileContentLoader filePath="/api/files/example.txt" />
}

// Code preview
import { CodePreview } from '@/components/ui/file/file-preview/code-preview'

function CodeViewer() {
  return <CodePreview content="const x = 5;" language="javascript" />
}
```
