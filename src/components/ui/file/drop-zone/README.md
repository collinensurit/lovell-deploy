# DropZone Component

This component provides a user-friendly interface for file uploads through either drag-and-drop or click-to-browse functionality.

## Features

- Drag and drop file uploads
- Click to browse file selection
- File validation (type, size, etc.)
- Visual feedback for drag states
- Support for multiple file selection
- Accessible keyboard navigation
- Error state display
- Customizable UI elements

## Usage

```tsx
import { DropZone } from '@/components/ui/file/drop-zone'

function MyComponent() {
  const handleFiles = (files: File[]) => {
    console.log('Received files:', files)
    // Process files...
  }

  return (
    <DropZone 
      onFilesSelected={handleFiles}
      accept="image/*,application/pdf"
      multiple
      validationOptions={{
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
      }}
      helpText="Drop your images or PDFs here"
    />
  )
}
```

## Props

| Prop               | Type                     | Default                                    | Description                                  |
|--------------------|--------------------------|-------------------------------------------|----------------------------------------------|
| onFilesSelected    | (files: File[]) => void  | (required)                                | Function called when files are selected      |
| multiple           | boolean                  | false                                     | Allow multiple file selection                |
| accept             | string                   | undefined                                 | MIME types to accept (e.g., "image/*,application/pdf") |
| validationOptions  | FileValidationOptions    | undefined                                 | Options for validating files                 |
| helpText           | React.ReactNode          | "Drag and drop files here or click to browse" | Text shown in the drop zone                  |
| disabled           | boolean                  | false                                     | Disable the drop zone                        |
| showIcon           | boolean                  | true                                      | Whether to show the upload icon              |
| icon               | React.ReactNode          | undefined                                 | Custom icon to display                       |
| bordered           | boolean                  | true                                      | Whether to show a border                     |
| className          | string                   | undefined                                 | Custom CSS class                             |

## Integration with Form Libraries

For integration with form libraries like React Hook Form, consider using the `FormFileUpload` component which is built on top of this component.

```tsx
import { FormFileUpload } from '@/components/ui/file/form-file-upload'
import { useForm } from 'react-hook-form'

function MyForm() {
  const form = useForm()
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormFileUpload
        name="documents"
        control={form.control}
        label="Upload Documents"
        multiple
        accept="application/pdf"
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```
