import React from 'react';
import { AppProps } from 'next/app';
import '../styles/globals.css';

// This ensures that any components that need the browser are properly handled
export default function MyApp({ Component, pageProps }: AppProps) {
  // Ensure window object exists before rendering
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return minimal markup for SSR
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <Component {...pageProps} />;
}
