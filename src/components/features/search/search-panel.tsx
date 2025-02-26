'use client'

import { FC, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FaSearch } from 'react-icons/fa'

interface SearchResult {
  id: string
  title: string
  content: string
  type: string
  path?: string
}

export const SearchPanel: FC = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="min-w-[40px]"
        >
          <FaSearch />
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-2">
          {results.map((result, index) => (
            <div
              key={index}
              className="rounded border border-[var(--vscode-border)] p-2"
            >
              <div className="font-medium">{result.title}</div>
              <div className="text-sm">{result.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
