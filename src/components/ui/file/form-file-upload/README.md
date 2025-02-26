# FormFileUpload Component

A form-integrated file upload component that works with React Hook Form and other form libraries. This component combines the `DropZone` with form integration and file preview capabilities.

## Features

- Seamless integration with React Hook Form
- File validation support
- Preview of uploaded files
- Ability to remove selected files
- Support for single or multiple file uploads
- Limiting maximum number of files
- Accessible form integration with proper labels and error messages

## Usage with React Hook Form

```tsx
import { useForm } from 'react-hook-form'
import { FormFileUpload } from '@/components/ui/file/form-file-upload'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

function MyUploadForm() {
  const form = useForm({
    defaultValues: {
      profileImage: null,
      documents: [],
    },
  })

  const onSubmit = (data) => {
    console.log('Form data:', data)
    // Process the form data...
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Single file upload */}
        <FormFileUpload 
          name="profileImage"
          control={form.control}
          label="Profile Image"
          description="Upload your profile picture"
          accept="image/*"
          validationOptions={{
            maxSize: 2 * 1024 * 1024, // 2MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
          }}
        />

        {/* Multiple file upload */}
        <FormFileUpload 
          name="documents"
          control={form.control}
          label="Documents"
          description="Upload supporting documents"
          accept="application/pdf,.doc,.docx"
          multiple
          maxFiles={5}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Props

| Prop               | Type                     | Default    | Description                                  |
|--------------------|--------------------------|------------|----------------------------------------------|
| name               | string                   | (required) | Field name for form integration              |
| control            | Control                  | (required) | Form control from React Hook Form            |
| label              | string                   | undefined  | Label for the form field                     |
| description        | string                   | undefined  | Description text for the form field          |
| showPreview        | boolean                  | true       | Whether to show a preview of selected files  |
| showRemoveButton   | boolean                  | true       | Whether to show file removal buttons         |
| maxFiles           | number                   | Infinity   | Maximum number of files allowed              |
| multiple           | boolean                  | false      | Allow multiple file selection                |
| accept             | string                   | undefined  | MIME types to accept                         |
| validationOptions  | FileValidationOptions    | undefined  | Options for validating files                 |
| disabled           | boolean                  | false      | Disable the upload field                     |
| className          | string                   | undefined  | Custom CSS class                             |

This component also accepts all other props from the `DropZone` component.

## File Validation

The component supports file validation through the `validationOptions` prop:

```tsx
validationOptions={{
  maxSize: 5 * 1024 * 1024, // 5MB maximum size
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'], // Allowed MIME types
  maxWidth: 1920, // Maximum image width (for images only)
  maxHeight: 1080, // Maximum image height (for images only)
  minWidth: 100, // Minimum image width (for images only)
  minHeight: 100, // Minimum image height (for images only)
}}
```
