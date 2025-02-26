type BatchTask<T> = () => Promise<T>

interface BatchProcessorOptions {
  maxConcurrent?: number
  maxRetries?: number
  retryDelay?: number
}

interface TaskQueueItem<T> {
  task: BatchTask<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (error: Error) => void
  retries: number
}

export class BatchProcessor<T> {
  private maxConcurrent: number
  private maxRetries: number
  private retryDelay: number
  private running: number
  private queue: TaskQueueItem<T>[]

  constructor(options: BatchProcessorOptions = {}) {
    this.maxConcurrent = options.maxConcurrent || 5
    this.maxRetries = options.maxRetries || 3
    this.retryDelay = options.retryDelay || 1000
    this.running = 0
    this.queue = []
  }

  private async processNext(): Promise<void> {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return
    }

    this.running++
    const { task, resolve, reject, retries } = this.queue.shift()!

    try {
      const result = await task()
      resolve(result)
    } catch (error) {
      if (retries < this.maxRetries) {
        // Retry the task
        setTimeout(
          () => {
            this.queue.push({
              task,
              resolve,
              reject,
              retries: retries + 1,
            })
            this.processNext()
          },
          this.retryDelay * Math.pow(2, retries)
        )
      } else {
        reject(error as Error)
      }
    } finally {
      this.running--
      this.processNext()
    }
  }

  async add(task: BatchTask<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task: task as BatchTask<T>,
        resolve,
        reject,
        retries: 0,
      })
      this.processNext()
    })
  }

  async addAll(tasks: BatchTask<T>[]): Promise<T[]> {
    return Promise.all(tasks.map((task) => this.add(task)))
  }

  async process(tasks: BatchTask<T>[]): Promise<T[]> {
    return this.addAll(tasks)
  }
}

export const batchProcessor = new BatchProcessor()
