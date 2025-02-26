import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Lovell - Digital Twin Platform',
  description:
    'AI-powered digital twin platform for managing and processing company files',
  generator: 'Next.js',
  applicationName: 'Lovell',
  referrer: 'origin-when-cross-origin',
  keywords: ['digital twin', 'AI', 'file management', 'document processing'],
  authors: [{ name: 'Lovell Team' }],
  colorScheme: 'dark',
  creator: 'Lovell Team',
  publisher: 'Lovell',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}
