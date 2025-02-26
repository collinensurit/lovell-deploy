'use client'

import React from 'react'
import { Select } from '@/components/ui/select'

export interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
  models: string[]
  disabled?: boolean
}

export function ModelSelector({
  value,
  onChange,
  models,
  disabled,
}: ModelSelectorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value)
  }

  return (
    <Select
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className="w-full"
    >
      {models.map((model) => (
        <option key={model} value={model}>
          {model}
        </option>
      ))}
    </Select>
  )
}
