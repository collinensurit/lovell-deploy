import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createRateLimitedRoute } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// This function creates a Supabase client for server-side usage within a route handler
function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            console.error('Error setting cookie:', error)
          }
        },
        remove(name: string) {
          try {
            cookieStore.set(name, '', { expires: new Date(0) })
          } catch (error) {
            console.error('Error removing cookie:', error)
          }
        },
      },
    }
  )
}

export const GET = createRateLimitedRoute(async (request: NextRequest) => {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const directory = searchParams.get('directory') || ''

  // List files from storage bucket
  const { data: files, error } = await supabase.storage
    .from('files')
    .list(directory)

  if (error) {
    console.error('Error listing files:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get metadata for each file
  const fileList = await Promise.all(
    files.map(async (file) => {
      const basePath = directory ? directory : ''
      const filePath = `${basePath}/${file.name}`
      const { data: fileMetadata } = await supabase
        .from('file_metadata')
        .select('*')
        .eq('path', filePath)
        .single()

      return {
        ...file,
        path: filePath,
        metadata: fileMetadata || null,
      }
    })
  )

  return NextResponse.json({ files: fileList })
})
