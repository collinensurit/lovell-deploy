import { NextRequest, NextResponse } from 'next/server'
import { createRateLimitedRoute } from '@/lib/rate-limit'
import { supabase } from '@/lib/supabase'

export const DELETE = createRateLimitedRoute(async (req: NextRequest) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 })
    }

    const { error } = await supabase.storage.from('files').remove([path])

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Remove file from index using Python service
    const pythonResponse = await fetch('http://localhost:8000/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: path }),
    })

    if (!pythonResponse.ok) {
      throw new Error('Failed to remove file from index')
    }

    // Delete metadata from database
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('path', path)

    if (dbError) throw dbError

    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
