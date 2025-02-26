import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client for this request
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set(name, value, options)
          },
          remove(name: string) {
            cookieStore.set(name, '', { expires: new Date(0) })
          },
        },
      }
    )

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const jobId = formData.get('jobId') as string

    if (!files.length || !jobId) {
      return NextResponse.json(
        { error: 'No files uploaded or missing jobId' },
        { status: 400 }
      )
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const filePath = `Company/Jobs/${jobId}/Estimates/${file.name}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, buffer)

      if (uploadError) throw uploadError

      // Save metadata to database
      const { error: dbError } = await supabase.from('files').insert({
        path: filePath,
        job_id: jobId,
        user_id: session.user.id,
        size: file.size,
        type: file.type,
      })

      if (dbError) throw dbError

      return filePath
    })

    const paths = await Promise.all(uploadPromises)

    // Index files using Python service
    const pythonResponse = await fetch('http://localhost:8000/index', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: paths }),
    })

    if (!pythonResponse.ok) {
      throw new Error('Failed to index files')
    }

    return NextResponse.json({ success: true, paths })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}
