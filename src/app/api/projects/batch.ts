import { NextRequest, NextResponse } from 'next/server'
import { createRateLimitedRoute } from '@/lib/rate-limit'
import { batchProcessor } from '@/lib/batch-processor'
import { supabase } from '@/lib/supabase'

export const POST = createRateLimitedRoute(
  async (req: NextRequest) => {
    try {
      const sessionResult = await supabase.auth.getSession()
      const session = sessionResult.data.session

      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const body = await req.json()
      const { tasks } = body

      if (!Array.isArray(tasks)) {
        return NextResponse.json(
          { error: 'Invalid request: tasks must be an array' },
          { status: 400 }
        )
      }

      const processedTasks = tasks.map((task) => async () => {
        // Add your task processing logic here
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return task
      })

      const results = await batchProcessor.process(processedTasks)

      return NextResponse.json({ results })
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  },
  {
    identifier: (req) => {
      // Get the user ID from the request headers or query params
      const userId = req.headers.get('x-user-id') || 'anonymous'
      return `batch:${userId}`
    },
  }
)
