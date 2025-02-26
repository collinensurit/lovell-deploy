// Configuration for Next.js exports and rendering
export const dynamicConfig = {
  // For static export mode, we need to use force-static
  dynamic: 'force-static',
  // Disable static optimization for problematic routes
  dynamicParams: true,
  // Don't cache pages on the server
  revalidate: 0
}
