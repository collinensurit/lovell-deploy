import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  return NextResponse.json({
    templates: [],
    query: Object.fromEntries(searchParams),
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ status: 'not implemented', body }, { status: 501 })
}
