'use client'

import * as React from 'react'

export interface TabsProps {
  children?: React.ReactNode
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

export interface TabsListProps {
  children?: React.ReactNode
  className?: string
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

export interface TabsTriggerProps {
  children?: React.ReactNode
  className?: string
  value: string
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, className }) => {
  return <button className={className}>{children}</button>
}

export interface TabsContentProps {
  children?: React.ReactNode
  className?: string
  value: string
}

export const TabsContent: React.FC<TabsContentProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}
