# File Utilities

A comprehensive set of file utilities for handling file operations in the browser.

## Core Utilities

### Operations (`operations.ts`)

Basic file operations for working with files:

- `downloadFile`: Download a file (blob, URL, or data URL)
- `readFileAsDataURL`: Convert a file to a data URL
- `readFileAsText`: Read a file as text
- `dataURLtoBlob`: Convert a data URL to a blob
- `blobToFile`: Convert a blob to a file

### Types (`types.ts`)

Common file type definitions and utilities:

- `FILE_TYPES`: Predefined MIME type groups (images, documents, etc.)
- `FILE_SIZE_LIMITS`: Common file size limits
- `getFileExtension`: Extract extension from filename
- `getMimeTypeFromExtension`: Get MIME type from extension

### Upload (`upload.ts`)

File upload utilities:

- `validateFile`: Validate a file against constraints
- `uploadFile`: Upload a single file with progress tracking
- `uploadMultipleFiles`: Upload multiple files with combined progress
- `createDropZone`: Set up a drop zone for file uploads

### Transform (`transform.ts`)

File transformation utilities:

- `resizeImage`: Resize an image file
- `cropImage`: Crop an image file
- `convertFileFormat`: Convert between image formats

### Mock (`mock.ts`)

Utilities for testing and demo purposes:

- `mockFileUpload`: Simulate a file upload
- `mockMultipleFileUploads`: Simulate multiple file uploads
- `createMockFile`: Create a mock file for testing
- `createMockImageFile`: Create a mock image file for testing

## React Hooks

### useFileUpload

Hook for managing file uploads:

```tsx
const [state, actions] = useFileUpload({
  endpoint: '/api/upload',
  maxSize: 5 * 1024 * 1024,
  allowedTypes: FILE_TYPES.IMAGES,
  onSuccess: (data, files) => console.log('Upload success', data, files),
});

// Access state
const { status, progress, selectedFiles, error } = state;

// Use actions
actions.selectFiles(files);
actions.upload();
actions.clearFiles();
actions.getDropZoneProps(); // For drag and drop
```

### useFileMetadata

Hook for extracting and managing file metadata:

```tsx
const metadata = useFileMetadata(files, { generatePreviews: true });

// Access metadata
metadata.forEach(file => {
  console.log(file.extension, file.mimeType, file.formattedSize);
  console.log(file.isImage, file.isDocument, file.previewUrl);
});
```

## UI Components

### File Upload

- `FileUpload`: Generic file upload component with drag and drop
- `ImageUpload`: Specialized for image uploads
- `DocumentUpload`: Specialized for document uploads

### File Preview

- `FilePreview`: Preview component for various file types
- `FileIcon`: Icon component for different file types
- `ImageEditorPreview`: Image preview with editing capabilities

### File Gallery

- `FileGallery`: Gallery component for managing multiple files
- `ImageGallery`: Specialized gallery for images
- `DocumentGallery`: Specialized gallery for documents

### Drop Zone

- `DropZone`: Standalone drag and drop zone for file uploads

### Form Integration

- `FormFileUpload`: File upload integrated with React Hook Form
- `FormDropZone`: Drop zone integrated with React Hook Form
- `MultiFilePreview`: File preview list for form contexts

## Global Configuration

You can configure global defaults using the `FileUploadProvider`:

```tsx
<FileUploadProvider
  initialConfig={{
    defaultEndpoint: '/api/my-upload',
    defaultMaxSize: 10 * 1024 * 1024,
    showNotifications: true,
    autoUpload: true,
  }}
>
  <App />
</FileUploadProvider>
```

Access global config in components:

```tsx
const { config, updateConfig } = useFileUploadContext();
```

## Example Usage

### Basic File Upload

```tsx
<FileUpload
  endpoint="/api/upload"
  maxSize={5 * 1024 * 1024}
  allowedTypes={FILE_TYPES.IMAGES}
  multiple={true}
  onSuccess={handleSuccess}
  onError={handleError}
/>
```

### Image Gallery

```tsx
<ImageGallery
  endpoint="/api/upload"
  initialFiles={myImageFiles}
  maxFiles={10}
  enableImageEditing={true}
  onUpload={handleUpload}
  onDelete={handleDelete}
  onEdit={handleEdit}
/>
```

### Form Integration

```tsx
<FormFileUpload
  name="profileImage"
  control={control}
  rules={{ required: "Please upload a profile image" }}
  label="Profile Image"
  endpoint="/api/upload"
  allowedTypes={FILE_TYPES.IMAGES}
  multiple={false}
/>
```

## Demo

Visit the example page at `/examples/file-utils` to see all components in action.
