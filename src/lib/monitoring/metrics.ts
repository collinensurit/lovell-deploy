import { Registry, Counter, Histogram } from 'prom-client'

// Create a Registry
const register = new Registry()

// Add default metrics
// client.collectDefaultMetrics({ register })

// HTTP request metrics
const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
  registers: [register],
})

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
})

const errorCounter = new Counter({
  name: 'error_total',
  help: 'Total number of errors',
  labelNames: ['type'],
  registers: [register],
})

// Template metrics
const templateOperationsTotal = new Counter({
  name: 'template_operations_total',
  help: 'Total number of template operations',
  labelNames: ['operation'],
  registers: [register],
})

const templateProcessingDuration = new Histogram({
  name: 'template_processing_duration_seconds',
  help: 'Duration of template processing in seconds',
  labelNames: ['operation'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
})

// File metrics
const fileOperationsTotal = new Counter({
  name: 'file_operations_total',
  help: 'Total number of file operations',
  labelNames: ['operation'],
  registers: [register],
})

const fileProcessingDuration = new Histogram({
  name: 'file_processing_duration_seconds',
  help: 'Duration of file processing in seconds',
  labelNames: ['operation'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
})

// Register all metrics
// register.registerMetric(httpRequestDuration)
// register.registerMetric(httpRequestTotal)
// register.registerMetric(httpErrorsTotal)
// register.registerMetric(templateOperationsTotal)
// register.registerMetric(templateProcessingDuration)
// register.registerMetric(fileOperationsTotal)
// register.registerMetric(fileProcessingDuration)

// Helper functions for recording metrics
export const metrics = {
  register,

  httpRequest({
    method,
    path,
    status,
    duration,
  }: {
    method: string
    path: string
    status: number
    duration: number
  }) {
    httpRequestCounter.labels(method, path, status.toString()).inc()
    httpRequestDuration.labels(method, path).observe(duration / 1000)
  },

  httpError({
    method,
    path,
    error,
  }: {
    method: string
    path: string
    error: string
  }) {
    errorCounter.labels(error).inc()
  },

  templateOperation(operation: string) {
    templateOperationsTotal.labels(operation).inc()
  },

  templateProcessing(operation: string, duration: number) {
    const durationSeconds = duration / 1000
    templateProcessingDuration.labels(operation).observe(durationSeconds)
  },

  fileOperation(operation: string) {
    fileOperationsTotal.labels(operation).inc()
  },

  fileProcessing(operation: string, duration: number) {
    const durationSeconds = duration / 1000
    fileProcessingDuration.labels(operation).observe(durationSeconds)
  },
}

// Export metrics endpoint handler
export async function metricsHandler() {
  return await register.metrics()
}
