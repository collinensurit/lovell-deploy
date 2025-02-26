'use client'

import * as React from 'react'

import { cn } from '@/lib-new/utils/cn'
import { useDeviceType, useResponsiveMode, ResponsiveMode, DeviceType } from '@/lib-new/utils/responsive'

/**
 * Props for the ResponsiveContainer component
 */
interface ResponsiveContainerProps {
  /**
   * Children to render
   */
  children: React.ReactNode
  
  /**
   * Component class names
   */
  className?: string
  
  /**
   * Class names to apply based on responsive mode
   */
  modeClasses?: Partial<Record<ResponsiveMode, string>>
  
  /**
   * Class names to apply based on device type
   */
  deviceClasses?: Partial<Record<DeviceType, string>>
  
  /**
   * Whether to hide on specific device types
   */
  hideOn?: DeviceType[]
  
  /**
   * Optional ID for the container
   */
  id?: string
}

/**
 * A container component that adapts its styling based on the current device and responsive mode
 * Uses our responsive utilities to determine the appropriate styles
 */
export function ResponsiveContainer({
  children,
  className,
  modeClasses,
  deviceClasses,
  hideOn = [],
  id,
}: ResponsiveContainerProps) {
  const deviceType = useDeviceType()
  const responsiveMode = useResponsiveMode()
  
  // Check if this component should be hidden on the current device
  if (hideOn.includes(deviceType)) {
    return null
  }
  
  // Apply the appropriate classes based on responsive mode and device type
  const modeClass = modeClasses?.[responsiveMode] || ''
  const deviceClass = deviceClasses?.[deviceType] || ''
  
  return (
    <div 
      id={id}
      data-device={deviceType}
      data-mode={responsiveMode}
      className={cn(className, modeClass, deviceClass)}
    >
      {children}
    </div>
  )
}

/**
 * Props for the ResponsiveLayout component
 */
interface ResponsiveLayoutProps {
  /**
   * Mobile and portrait tablet layout
   */
  stackedLayout: React.ReactNode
  
  /**
   * Desktop and landscape tablet layout
   */
  sideLayout: React.ReactNode
  
  /**
   * Container class names
   */
  className?: string
  
  /**
   * Class names for the stacked layout container
   */
  stackedClassName?: string
  
  /**
   * Class names for the side-by-side layout container
   */
  sideClassName?: string
}

/**
 * A component that renders different layouts based on the current responsive mode
 * Uses our responsive utilities to determine which layout to show
 */
export function ResponsiveLayout({
  stackedLayout,
  sideLayout,
  className,
  stackedClassName,
  sideClassName,
}: ResponsiveLayoutProps) {
  const responsiveMode = useResponsiveMode()
  
  return (
    <div className={className}>
      {/* Show different layouts based on responsive mode */}
      {(responsiveMode === 'stacked') && (
        <div className={stackedClassName}>
          {stackedLayout}
        </div>
      )}
      
      {(responsiveMode === 'side-by-side' || responsiveMode === 'expanded') && (
        <div className={sideClassName}>
          {sideLayout}
        </div>
      )}
    </div>
  )
}

/**
 * Props for the ResponsiveOnly component
 */
interface ResponsiveOnlyProps {
  /**
   * Children to render
   */
  children: React.ReactNode
  
  /**
   * Device types on which to show the children
   */
  showOn: DeviceType[]
  
  /**
   * Whether to use display: none instead of not rendering
   */
  useDisplayNone?: boolean
  
  /**
   * Class names for the container
   */
  className?: string
}

/**
 * A component that only renders its children on specific device types
 * Uses our responsive utilities to determine if the children should be shown
 */
export function ResponsiveOnly({
  children,
  showOn,
  useDisplayNone = false,
  className,
}: ResponsiveOnlyProps) {
  const deviceType = useDeviceType()
  const shouldShow = showOn.includes(deviceType)
  
  if (!shouldShow && !useDisplayNone) {
    return null
  }
  
  return (
    <div
      className={cn(
        className,
        !shouldShow && useDisplayNone && 'hidden'
      )}
    >
      {children}
    </div>
  )
}

/**
 * Example usage of responsive components to create a responsive panel
 */
export function ResponsivePanel({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <ResponsiveContainer
      className={cn(
        "rounded-lg border shadow-sm",
        className
      )}
      modeClasses={{
        stacked: "p-4 w-full",
        'side-by-side': "p-6 w-1/2",
        expanded: "p-8 w-full max-w-5xl mx-auto"
      }}
      deviceClasses={{
        mobile: "bg-gray-50 dark:bg-gray-900",
        tablet: "bg-white dark:bg-gray-800",
        desktop: "bg-white dark:bg-gray-800"
      }}
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      <div>
        {children}
      </div>
      
      <ResponsiveOnly showOn={['mobile']}>
        <div className="mt-4 text-sm text-gray-500">
          Mobile-optimized view
        </div>
      </ResponsiveOnly>
      
      <ResponsiveOnly showOn={['tablet']}>
        <div className="mt-4 text-sm text-gray-500">
          Tablet-optimized view
        </div>
      </ResponsiveOnly>
      
      <ResponsiveOnly showOn={['desktop']}>
        <div className="mt-4 text-sm text-gray-500">
          Desktop-optimized view
        </div>
      </ResponsiveOnly>
    </ResponsiveContainer>
  )
}
