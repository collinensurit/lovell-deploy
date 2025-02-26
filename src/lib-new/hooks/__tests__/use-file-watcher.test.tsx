import * as React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { useFileWatcher, FileWatcherOptions } from '../use-file-watcher'

describe('useFileWatcher', () => {
  // Mock file setup function
  const createMockFile = (name: string, size: number, lastModified: number): File => {
    const file = new File(['test file content'], name, { type: 'text/plain', lastModified })
    Object.defineProperty(file, 'size', { value: size })
    return file
  }

  // Test component
  const TestComponent = ({ options }: { options?: FileWatcherOptions }) => {
    const { 
      files,
      addFiles,
      removeFiles,
      clearFiles,
      updateFiles,
      getFile,
      getFileIds
    } = useFileWatcher(options)

    return (
      <div>
        <div data-testid="file-count">{files.length}</div>
        <ul>
          {files.map((file, index) => (
            <li key={index} data-testid={`file-${index}`}>
              {file.name} - {file.size}
            </li>
          ))}
        </ul>
        <button 
          data-testid="add-file" 
          onClick={() => addFiles(createMockFile('file.txt', 100, 1000))}
        >
          Add File
        </button>
        <button 
          data-testid="add-multiple" 
          onClick={() => addFiles([
            createMockFile('file1.txt', 100, 1000),
            createMockFile('file2.txt', 200, 2000)
          ])}
        >
          Add Multiple
        </button>
        <button 
          data-testid="remove-file" 
          onClick={() => {
            const ids = getFileIds()
            if (ids.length > 0) {
              removeFiles(ids[0])
            }
          }}
        >
          Remove First
        </button>
        <button 
          data-testid="clear-files" 
          onClick={() => clearFiles()}
        >
          Clear
        </button>
        <button 
          data-testid="get-file" 
          onClick={() => {
            const ids = getFileIds()
            if (ids.length > 0) {
              const file = getFile(ids[0])
              const fileElem = document.createElement('div')
              fileElem.setAttribute('data-testid', 'found-file')
              fileElem.textContent = file ? file.name : 'not found'
              document.body.appendChild(fileElem)
            }
          }}
        >
          Get File
        </button>
        <button 
          data-testid="update-file" 
          onClick={() => {
            const ids = getFileIds()
            if (ids.length > 0) {
              const file = getFile(ids[0])
              if (file) {
                updateFiles(createMockFile(file.name, file.size + 100, file.lastModified))
              }
            }
          }}
        >
          Update File
        </button>
      </div>
    )
  }

  it('should start with an empty files array', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('file-count').textContent).toBe('0')
  })

  it('should add a single file', () => {
    render(<TestComponent />)
    fireEvent.click(screen.getByTestId('add-file'))
    expect(screen.getByTestId('file-count').textContent).toBe('1')
    expect(screen.getByTestId('file-0').textContent).toBe('file.txt - 100')
  })

  it('should add multiple files', () => {
    render(<TestComponent />)
    fireEvent.click(screen.getByTestId('add-multiple'))
    expect(screen.getByTestId('file-count').textContent).toBe('2')
    expect(screen.getByTestId('file-0').textContent).toBe('file1.txt - 100')
    expect(screen.getByTestId('file-1').textContent).toBe('file2.txt - 200')
  })

  it('should remove a file', () => {
    render(<TestComponent />)
    fireEvent.click(screen.getByTestId('add-multiple'))
    expect(screen.getByTestId('file-count').textContent).toBe('2')
    
    fireEvent.click(screen.getByTestId('remove-file'))
    expect(screen.getByTestId('file-count').textContent).toBe('1')
    expect(screen.getByTestId('file-0').textContent).toBe('file2.txt - 200')
  })

  it('should clear all files', () => {
    render(<TestComponent />)
    fireEvent.click(screen.getByTestId('add-multiple'))
    expect(screen.getByTestId('file-count').textContent).toBe('2')
    
    fireEvent.click(screen.getByTestId('clear-files'))
    expect(screen.getByTestId('file-count').textContent).toBe('0')
  })

  it('should get a file by id', () => {
    render(<TestComponent />)
    fireEvent.click(screen.getByTestId('add-file'))
    
    fireEvent.click(screen.getByTestId('get-file'))
    expect(screen.getByTestId('found-file').textContent).toBe('file.txt')
  })

  it('should update a file', () => {
    render(<TestComponent />)
    fireEvent.click(screen.getByTestId('add-file'))
    expect(screen.getByTestId('file-0').textContent).toBe('file.txt - 100')
    
    fireEvent.click(screen.getByTestId('update-file'))
    expect(screen.getByTestId('file-0').textContent).toBe('file.txt - 200')
  })

  it('should call onChange when files change', () => {
    const onChange = jest.fn()
    render(<TestComponent options={{ onChange }} />)
    
    fireEvent.click(screen.getByTestId('add-file'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ name: 'file.txt', size: 100 })
    ]))
    
    fireEvent.click(screen.getByTestId('clear-files'))
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenCalledWith([])
  })

  it('should call onAdd when files are added', () => {
    const onAdd = jest.fn()
    render(<TestComponent options={{ onAdd }} />)
    
    fireEvent.click(screen.getByTestId('add-file'))
    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ name: 'file.txt', size: 100 })
    ]))
  })

  it('should call onRemove when files are removed', () => {
    const onRemove = jest.fn()
    render(<TestComponent options={{ onRemove }} />)
    
    fireEvent.click(screen.getByTestId('add-file'))
    fireEvent.click(screen.getByTestId('remove-file'))
    
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledWith(expect.arrayContaining([
      expect.any(String)
    ]))
  })

  it('should not perform operations when disabled', () => {
    render(<TestComponent options={{ enabled: false }} />)
    
    fireEvent.click(screen.getByTestId('add-file'))
    expect(screen.getByTestId('file-count').textContent).toBe('0')
  })

  it('should use custom file ID function', () => {
    const getFileId = jest.fn().mockImplementation((file) => `custom-${file.name}`)
    
    render(
      <TestComponent 
        options={{ 
          getFileId,
          onAdd: () => {
            // Just to trigger the ID generation
          }
        }} 
      />
    )
    
    fireEvent.click(screen.getByTestId('add-file'))
    expect(getFileId).toHaveBeenCalled()
  })
})
