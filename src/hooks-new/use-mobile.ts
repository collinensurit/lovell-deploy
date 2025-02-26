'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect if the current viewport is mobile-sized
 * 
 * @returns Boolean indicating if the current viewport is mobile-sized
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    /**
     * Check if the screen is mobile-sized based on width
     */
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()
    
    // Update on resize
    window.addEventListener('resize', checkMobile)

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return isMobile
}
