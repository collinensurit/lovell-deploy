// This file contains configuration for all routes
// Make sure all pages are dynamically rendered to prevent
// errors with client-side components during static generation

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'
