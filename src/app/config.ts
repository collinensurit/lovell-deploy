// Configuration for Next.js exports and rendering
export const dynamicConfig = {
  // Set to true to make all pages dynamic by default
  // This prevents errors with useState and other client hooks during static generation
  dynamic: 'force-dynamic',
  // Disable static optimization for problematic routes
  dynamicParams: true,
  // Don't cache pages on the server
  revalidate: 0
}
