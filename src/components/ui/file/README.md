# File UI Components

This directory contains all file-related UI components for the application.

## Component Structure

```
file/
├── drop-zone/              # Drag-and-drop file upload components
│   ├── index.tsx           # Main drop zone component
│   └── README.md           # Component documentation
│
├── file-preview/           # File preview components
│   ├── code-preview.tsx    # Code file preview with syntax highlighting
│   ├── file-content-loader.tsx # Component to load file content from server
│   ├── file-viewer.tsx     # Main file viewer with type detection
│   ├── index.ts            # Exports all preview components
│   └── README.md           # Component documentation
│
├── form-file-upload/       # Form-integrated file upload
│   ├── index.tsx           # Form field for file uploads
│   └── README.md           # Component documentation
│
├── file-gallery.tsx        # Legacy component for displaying multiple files
├── file-preview.tsx        # Legacy file content component
├── file-upload.tsx         # Legacy file upload component
└── index.ts                # Main export file
```

## Usage

All components are exported from the main index file:

```tsx
import { 
  // Modern components (preferred)
  FileViewer, 
  CodePreview,
  FileContentLoader,
  DropZone,
  FormFileUpload,
  
  // Legacy components (to be migrated)
  LegacyFilePreview
} from '@/components/ui/file'
```

## Component Families

### File Preview Components

The `file-preview` directory contains components for displaying different types of files:

- `FileViewer`: Main component that detects file type and renders appropriate preview
- `CodePreview`: Syntax-highlighted code preview for text files
- `FileContentLoader`: Loads file content from the server by path

### Upload Components

- `DropZone`: Modern drag-and-drop file upload component
- `FormFileUpload`: Form-integrated file upload with validation and preview

### Legacy Components

The following components are maintained for backwards compatibility and will be deprecated:

- `FileGallery`: Displays multiple files in a grid layout
- `FileUpload`: Basic file upload component
- `LegacyFilePreview` (previously `FilePreview`): Basic file content viewer

## Integration with Utilities

These components integrate with our file utilities:

```tsx
import { validateFileType, validateFileSize } from '@/lib-new/utils/file/validation'
import { downloadFile, readFileAsText } from '@/lib-new/utils/file/operations'
import { getFileMetadata } from '@/lib-new/utils/file/metadata'
```

And with our hooks:

```tsx
import { useFileUpload, useFileMetadata, useFileWatcher } from '@/lib-new/hooks'
