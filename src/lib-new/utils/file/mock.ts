/**
 * Mock file upload utilities for testing and examples
 */

/**
 * Mocks a file upload to a server, simulating network delay and progress events
 * 
 * @param file - File to upload
 * @param options - Configuration options
 * @returns Promise with mock response
 */
export async function mockFileUpload<T = any>(
  file: File,
  options: {
    /**
     * Success probability (0-1)
     */
    successRate?: number;
    
    /**
     * Minimum simulation time in ms
     */
    minTime?: number;
    
    /**
     * Maximum simulation time in ms
     */
    maxTime?: number;
    
    /**
     * Progress callback
     */
    onProgress?: (progress: number) => void;
    
    /**
     * Custom response generator
     */
    responseGenerator?: (file: File) => T;
    
    /**
     * Custom error message
     */
    errorMessage?: string;
  } = {}
): Promise<T> {
  const {
    successRate = 0.9,
    minTime = 500,
    maxTime = 3000,
    onProgress,
    responseGenerator,
    errorMessage = 'Upload failed due to network error'
  } = options;

  // Calculate total time for this upload based on file size
  // Larger files take longer, with some randomness
  const baseTimePerMB = 500; // 500ms per MB as base time
  const fileSizeMB = file.size / (1024 * 1024);
  const calculatedTime = Math.min(
    maxTime,
    Math.max(minTime, Math.round(fileSizeMB * baseTimePerMB * (0.8 + Math.random() * 0.4)))
  );
  
  // Number of progress updates to send
  const progressSteps = 20;
  const timePerStep = calculatedTime / progressSteps;
  
  return new Promise((resolve, reject) => {
    let currentProgress = 0;
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      currentProgress += 100 / progressSteps;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
      }
      
      onProgress?.(currentProgress);
    }, timePerStep);
    
    // Simulate upload completion
    setTimeout(() => {
      clearInterval(progressInterval);
      onProgress?.(100);
      
      // Determine if upload "succeeds" based on success rate
      if (Math.random() < successRate) {
        // Success - generate response
        const response = responseGenerator 
          ? responseGenerator(file)
          : {
              success: true,
              fileId: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              url: URL.createObjectURL(file)
            } as unknown as T;
            
        resolve(response);
      } else {
        // Failure
        reject(new Error(errorMessage));
      }
    }, calculatedTime);
  });
}

/**
 * Mocks multiple file uploads
 * 
 * @param files - Files to upload
 * @param options - Upload options
 * @returns Promise with array of results
 */
export async function mockMultipleFileUploads<T = any>(
  files: File[],
  options: {
    /**
     * Success probability (0-1)
     */
    successRate?: number;
    
    /**
     * Minimum simulation time in ms
     */
    minTime?: number;
    
    /**
     * Maximum simulation time in ms
     */
    maxTime?: number;
    
    /**
     * Progress callback - receives overall progress (0-100)
     */
    onProgress?: (progress: number) => void;
    
    /**
     * Custom response generator
     */
    responseGenerator?: (file: File) => T;
    
    /**
     * Whether to fail entire batch if any fails
     */
    failOnAnyError?: boolean;
  } = {}
): Promise<T[]> {
  const { onProgress, failOnAnyError = false } = options;
  
  if (files.length === 0) {
    return Promise.resolve([]);
  }
  
  // Track progress for all files
  const progressMap = new Map<File, number>(
    files.map(file => [file, 0])
  );
  
  // Function to calculate overall progress
  const calculateOverallProgress = () => {
    let total = 0;
    progressMap.forEach(progress => {
      total += progress;
    });
    return total / progressMap.size;
  };
  
  // Callback for individual file progress
  const progressCallback = (file: File) => (progress: number) => {
    progressMap.set(file, progress);
    onProgress?.(calculateOverallProgress());
  };
  
  // Upload each file with individual progress tracking
  const uploadPromises = files.map(file => 
    mockFileUpload<T>(file, {
      ...options,
      onProgress: progressCallback(file)
    })
  );
  
  if (failOnAnyError) {
    // Return results only if all succeed
    return Promise.all(uploadPromises);
  } else {
    // Return results for successful uploads, null for failures
    return Promise.allSettled(uploadPromises).then(results => 
      results.map((result, index) => 
        result.status === 'fulfilled' ? result.value : null
      ).filter((result): result is T => result !== null)
    );
  }
}

/**
 * Creates a mock file for testing
 * 
 * @param options - Configuration options
 * @returns A File object
 */
export function createMockFile({
  name = 'test-file.txt',
  type = 'text/plain',
  size = 1024,
  content = 'Test file content'
}: {
  name?: string;
  type?: string;
  size?: number;
  content?: string;
} = {}): File {
  // For text files, use the content directly
  if (type.startsWith('text/')) {
    return new File([content], name, { type });
  }
  
  // For binary files, create random data of the specified size
  const data = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    data[i] = Math.floor(Math.random() * 256);
  }
  
  return new File([data], name, { type });
}

/**
 * Creates a mock image file for testing
 * 
 * @param options - Configuration options
 * @returns Promise that resolves to a File object
 */
export async function createMockImageFile({
  name = 'test-image.png',
  width = 400,
  height = 300,
  text = 'Test Image',
  backgroundColor = '#3498db',
  textColor = '#ffffff'
}: {
  name?: string;
  width?: number;
  height?: number;
  text?: string;
  backgroundColor?: string;
  textColor?: string;
} = {}): Promise<File> {
  return new Promise((resolve) => {
    // Create an in-memory canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      // Fallback to a basic mock file if canvas is not available
      resolve(createMockFile({ name, type: 'image/png', size: width * height * 4 }));
      return;
    }
    
    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    
    // Add text
    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.floor(width / 10)}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    
    // Convert to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        // Fallback to a basic mock file if blob creation fails
        resolve(createMockFile({ name, type: 'image/png', size: width * height * 4 }));
        return;
      }
      
      // Create file from blob
      resolve(new File([blob], name, { type: 'image/png' }));
    }, 'image/png');
  });
}

/**
 * Simulates a file download 
 * 
 * @param options - Configuration options
 * @returns Promise that resolves when the download is complete
 */
export async function mockFileDownload({
  fileName = 'download.txt',
  fileType = 'text/plain',
  fileContent = 'Downloaded file content',
  delay = 500
}: {
  fileName?: string;
  fileType?: string;
  fileContent?: string;
  delay?: number;
} = {}): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a blob from the content
      const blob = new Blob([fileContent], { type: fileType });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      
      // Add to the DOM, click it, and remove it
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the URL
      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve();
      }, 100);
    }, delay);
  });
}
