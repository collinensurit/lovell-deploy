/**
 * Options for performing a search
 */
export interface SearchOptions<T> {
  /**
   * Array of keys to search within each item
   */
  keys: (keyof T)[]
  
  /**
   * Whether to use case-sensitive search (default: false)
   */
  caseSensitive?: boolean
  
  /**
   * Whether to match exactly or partially (default: false = partial matching)
   */
  exactMatch?: boolean
  
  /**
   * Custom filter function for more complex filtering
   */
  customFilter?: (item: T, query: string) => boolean
  
  /**
   * Sort the results by relevance (default: true)
   */
  sortByRelevance?: boolean
  
  /**
   * Custom scoring function to determine relevance (higher is more relevant)
   */
  scoreFunction?: (item: T, query: string, matchingKey: keyof T) => number
}

/**
 * Search result with the score for sorting by relevance
 */
interface ScoredResult<T> {
  item: T
  score: number
}

/**
 * Search through an array of items based on a search query
 * 
 * @param items - Array of items to search through
 * @param query - Search query
 * @param options - Search options
 * @returns Filtered array of items that match the query
 */
export function search<T extends Record<string, any>>(
  items: T[],
  query: string,
  options: SearchOptions<T>
): T[] {
  if (!query || !items.length) {
    return items
  }
  
  const {
    keys,
    caseSensitive = false,
    exactMatch = false,
    customFilter,
    sortByRelevance = true,
    scoreFunction
  } = options
  
  // Normalize the query for case-insensitive search
  const normalizedQuery = caseSensitive ? query : query.toLowerCase()
  
  // Filter and score items
  const results: ScoredResult<T>[] = items
    .map(item => {
      // Use custom filter if provided
      if (customFilter && customFilter(item, query)) {
        return {
          item,
          score: 1
        }
      }
      
      // Otherwise, search through specified keys
      let maxScore = 0
      let matchingKey: keyof T | null = null
      
      for (const key of keys) {
        const value = item[key]
        
        // Skip null or undefined values
        if (value == null) continue
        
        // Convert to string
        const stringValue = String(value)
        const normalizedValue = caseSensitive ? stringValue : stringValue.toLowerCase()
        
        // Check for match
        let matches = false
        let score = 0
        
        if (exactMatch) {
          matches = normalizedValue === normalizedQuery
          score = matches ? 1 : 0
        } else {
          matches = normalizedValue.includes(normalizedQuery)
          
          if (matches) {
            // Calculate simple relevance score (position and length ratio)
            const index = normalizedValue.indexOf(normalizedQuery)
            const queryRatio = normalizedQuery.length / normalizedValue.length
            
            // Prefer matches at the beginning and matches that cover more of the field
            score = (1 - index / normalizedValue.length) * 0.5 + queryRatio * 0.5
          }
        }
        
        if (matches && score > maxScore) {
          maxScore = score
          matchingKey = key
        }
      }
      
      // If a custom scoring function is provided and we have a match, use it
      if (maxScore > 0 && matchingKey && scoreFunction) {
        maxScore = scoreFunction(item, query, matchingKey)
      }
      
      return {
        item,
        score: maxScore
      }
    })
    .filter(result => result.score > 0)
  
  // Sort by relevance if requested
  if (sortByRelevance) {
    results.sort((a, b) => b.score - a.score)
  }
  
  // Return only the items, without the scores
  return results.map(result => result.item)
}

/**
 * Highlight matched text within a string
 * 
 * @param text - Original text
 * @param query - Query to highlight
 * @param highlightClass - CSS class for highlighting (default: 'highlight')
 * @param caseSensitive - Whether to match case-sensitively (default: false)
 * @returns HTML string with highlighted matches
 */
export function highlightMatches(
  text: string,
  query: string,
  highlightClass = 'highlight',
  caseSensitive = false
): string {
  if (!query || !text) {
    return text
  }
  
  const normalizedText = caseSensitive ? text : text.toLowerCase()
  const normalizedQuery = caseSensitive ? query : query.toLowerCase()
  
  let result = ''
  let lastIndex = 0
  let index = normalizedText.indexOf(normalizedQuery)
  
  while (index !== -1) {
    // Add text before the match
    result += text.substring(lastIndex, index)
    
    // Add the highlighted match
    const match = text.substring(index, index + query.length)
    result += `<span class="${highlightClass}">${match}</span>`
    
    // Move to after this match
    lastIndex = index + query.length
    index = normalizedText.indexOf(normalizedQuery, lastIndex)
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    result += text.substring(lastIndex)
  }
  
  return result
}
