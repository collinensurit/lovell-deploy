import { renderHook, act } from '@testing-library/react'
import { useTemplates } from '../use-templates'

/**
 * Mock fetch implementation for testing
 */
global.fetch = jest.fn()

describe('useTemplates', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with empty templates and loading state', async () => {
    // Mock successful fetch response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    const { result } = renderHook(() => useTemplates())
    
    // Initial state should have empty templates and loading true
    expect(result.current.templates).toEqual([])
    expect(result.current.loading).toBe(true)
    
    // Wait for the effect to complete
    await act(async () => {
      await Promise.resolve()
    })
    
    // After fetch completes, loading should be false
    expect(result.current.loading).toBe(false)
    expect(result.current.templates).toEqual([])
  })

  it('should handle fetch error', async () => {
    // Mock fetch error
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    const { result } = renderHook(() => useTemplates())
    
    // Wait for the effect to complete
    await act(async () => {
      await Promise.resolve()
    })
    
    // Should set error and loading false
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeTruthy()
  })

  it('should create template', async () => {
    const newTemplate = { name: 'Test Template', content: 'Test Content' }
    const createdTemplate = { ...newTemplate, id: '123' }
    
    // Mock successful fetch responses
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => createdTemplate,
      })

    const { result } = renderHook(() => useTemplates())
    
    // Wait for initial fetch to complete
    await act(async () => {
      await Promise.resolve()
    })
    
    // Create template
    let createdResult
    await act(async () => {
      createdResult = await result.current.createTemplate(newTemplate)
    })
    
    // Check template was added to state
    expect(result.current.templates).toContainEqual(createdTemplate)
    expect(createdResult).toEqual(createdTemplate)
    expect(global.fetch).toHaveBeenCalledWith('/api/templates', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(newTemplate),
    }))
  })
})
