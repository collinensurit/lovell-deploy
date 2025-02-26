'use client'

import * as React from 'react'
import { Button } from '../../../components/ui/button'

export default function FileUtilsClient() {
  const [files, setFiles] = React.useState<File[]>([])
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFiles(Array.from(e.target.files))
    }
  }
  
  // Simple file uploader component
  return (
    <div className="space-y-4">
      <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
        <input 
          type="file" 
          id="file-upload" 
          multiple 
          onChange={handleFileChange}
          className="hidden" 
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded inline-flex items-center"
        >
          Select Files
        </label>
        <p className="mt-2 text-sm text-gray-500">
          Drag and drop files here, or click to select files
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Selected Files ({files.length})</h3>
          <ul className="mt-2 divide-y divide-gray-200">
            {files.map((file, index) => (
              <li key={index} className="py-2">
                <div className="flex items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB · {file.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
