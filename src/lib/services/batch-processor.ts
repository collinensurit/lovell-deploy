interface BatchRequest {
  files: string[]
  jobId: string
  operation: 'index' | 'analyze' | 'generate'
  options?: Record<string, any>
}

interface BatchResult {
  success: boolean
  results: any[]
  errors: string[]
}

export async function batchProcessor(
  request: BatchRequest
): Promise<BatchResult> {
  const { files, jobId, operation, options = {} } = request
  const results: any[] = []
  const errors: string[] = []

  try {
    // Process each file in the batch
    for (const file of files) {
      try {
        const result = await processFile(file, operation, jobId, options)
        results.push(result)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        errors.push(`Error processing ${file}: ${errorMessage}`)
      }
    }

    return {
      success: errors.length === 0,
      results,
      errors,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      results: [],
      errors: [errorMessage],
    }
  }
}

async function processFile(
  file: string,
  operation: string,
  jobId: string,
  options: Record<string, any>
): Promise<any> {
  // Call the Python microservice to process the file
  const response = await fetch(`http://localhost:8000/${operation}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file,
      jobId,
      ...options,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to ${operation} file: ${response.statusText}`)
  }

  return response.json()
}
