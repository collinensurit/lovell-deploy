'use client'

import React from 'react'

interface ClientWrapperProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that marks its children as client-side only
 * This is used to ensure components that use hooks like useState are properly
 * identified as client components and not rendered during server-side generation
 */
export function ClientWrapper({ children }: ClientWrapperProps) {
  return <>{children}</>
}

/**
 * Higher-order component to wrap any component that uses client-side features
 * This ensures the component is properly identified as a client component
 */
export function withClientSide<P extends object>(Component: React.ComponentType<P>): React.FC<P> {
  const WithClientSide: React.FC<P> = (props) => {
    return (
      <ClientWrapper>
        <Component {...props} />
      </ClientWrapper>
    )
  }
  
  WithClientSide.displayName = `withClientSide(${Component.displayName || Component.name || 'Component'})`
  return WithClientSide
}
