// This file exists to prevent Next.js from complaining about API routes in static export mode
export const dynamic = 'force-static'

export async function GET() {
  return new Response(
    JSON.stringify({
      message: 'This is a static export. API routes are not available in static export mode.'
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )
}
