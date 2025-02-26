'use client'

import * as React from 'react'
import { Search } from 'lucide-react'

import { search, highlightMatches } from '@/lib-new/utils/search'
import { cn } from '@/lib-new/utils/cn'
import { Input } from '@/components/ui/input'

/**
 * Props for the SearchableList component
 */
export interface SearchableListProps<T extends Record<string, any>> {
  /**
   * Array of items to search through
   */
  items: T[]
  
  /**
   * Keys to search within each item
   */
  searchKeys: (keyof T)[]
  
  /**
   * Function to render each item
   */
  renderItem: (item: T, index: number, highlight: (text: string) => string) => React.ReactNode
  
  /**
   * Optional placeholder for the search input
   */
  placeholder?: string
  
  /**
   * Optional class name for the component
   */
  className?: string
  
  /**
   * Optional class name for the list
   */
  listClassName?: string
  
  /**
   * Enable case-sensitive search
   */
  caseSensitive?: boolean
  
  /**
   * Enable exact match search
   */
  exactMatch?: boolean
  
  /**
   * Sort by relevance
   */
  sortByRelevance?: boolean
  
  /**
   * No results message
   */
  noResultsMessage?: string
  
  /**
   * Function to get a unique key for each item
   */
  getItemKey?: (item: T) => string | number
}

/**
 * A searchable list component that filters items based on a search query
 * Uses our custom search utility for filtering and highlighting results
 */
export function SearchableList<T extends Record<string, any>>({
  items,
  searchKeys,
  renderItem,
  placeholder = 'Search...',
  className,
  listClassName,
  caseSensitive = false,
  exactMatch = false,
  sortByRelevance = true,
  noResultsMessage = 'No results found',
  getItemKey = (item: T) => JSON.stringify(item),
}: SearchableListProps<T>) {
  const [query, setQuery] = React.useState('')
  
  // Filter items based on the search query
  const filteredItems = React.useMemo(() => {
    if (!query) return items
    
    return search(items, query, {
      keys: searchKeys,
      caseSensitive,
      exactMatch,
      sortByRelevance
    })
  }, [items, query, searchKeys, caseSensitive, exactMatch, sortByRelevance])
  
  // Highlight matching text in search results
  const highlightText = React.useCallback(
    (text: string) => {
      if (!query) return text
      
      return highlightMatches(text, query, 'font-medium bg-yellow-100 dark:bg-yellow-800', caseSensitive)
    },
    [query, caseSensitive]
  )
  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      
      <div className={cn("space-y-2", listClassName)}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div key={getItemKey(item)}>
              {renderItem(item, index, highlightText)}
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-sm text-gray-500">
            {noResultsMessage}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Example usage of SearchableList component with a user list
 */
export function UserSearchList() {
  // Example data
  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Editor' },
    { id: 4, name: 'Diana Miller', email: 'diana@example.com', role: 'User' },
    { id: 5, name: 'Edward Wilson', email: 'edward@example.com', role: 'Viewer' },
  ]
  
  // Render function for each user
  const renderUser = (
    user: typeof users[0], 
    index: number, 
    highlight: (text: string) => string
  ) => {
    return (
      <div className="flex items-center justify-between rounded border p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
        <div>
          <div className="font-medium" dangerouslySetInnerHTML={{ __html: highlight(user.name) }} />
          <div className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: highlight(user.email) }} />
        </div>
        <div className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700">
          {user.role}
        </div>
      </div>
    )
  }
  
  return (
    <SearchableList
      items={users}
      searchKeys={['name', 'email', 'role']}
      renderItem={renderUser}
      placeholder="Search users..."
      getItemKey={(user) => user.id}
      className="max-w-md mx-auto"
    />
  )
}
