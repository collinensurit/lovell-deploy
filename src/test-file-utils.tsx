'use client'

import * as React from 'react'
import { DropZone } from './components/ui/file/drop-zone'
import { FileViewer } from './components/ui/file/file-preview/file-viewer'
import { downloadFile, formatFileSize } from './lib-new/utils/file/operations'
import { useFileWatcher } from './lib-new/hooks'

/**
 * Test component to demonstrate file components and utilities
 */
export default function TestFileUtils() {
  const { files, addFiles, removeFiles } = useFileWatcher()
  const [fileContent, setFileContent] = React.useState<string>('')
  
  // Test file operations
  const handleFilesSelected = (selectedFiles: File[]) => {
    addFiles(selectedFiles)
  }
  
  const handleRemoveFile = (index: number) => {
    if (files[index]) {
      // Convert File to string ID
      const fileId = `${files[index].name}-${files[index].size}-${files[index].lastModified}`
      removeFiles([fileId])
    }
  }
  
  const handleDownload = (file: File) => {
    downloadFile(file, file.name)
  }
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">File Component Test Suite</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">File Upload Component</h2>
        <DropZone 
          onFilesSelected={handleFilesSelected}
          helpText="Drop files here or click to browse"
          className="mb-4 h-40"
        />
      </div>
      
      {files.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">File List ({files.length})</h2>
          <div className="space-y-4">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {file.type || 'unknown'} • {formatFileSize(file.size)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={() => handleDownload(file)}
                    type="button"
                  >
                    Download
                  </button>
                  <button 
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleRemoveFile(index)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {files.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">File Previewer</h2>
          <div className="border rounded overflow-hidden">
            <FileViewer file={files[0]} />
          </div>
        </div>
      )}
    </div>
  )
}
