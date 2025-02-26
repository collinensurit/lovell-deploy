'use client'

import * as React from 'react'

interface CardProps {
  children?: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

interface CardHeaderProps {
  children?: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

interface CardTitleProps {
  children?: React.ReactNode
  className?: string
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

interface CardDescriptionProps {
  children?: React.ReactNode
  className?: string
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

interface CardContentProps {
  children?: React.ReactNode
  className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}
