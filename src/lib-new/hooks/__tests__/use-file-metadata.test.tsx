import { renderHook } from '@testing-library/react-hooks'
import { useFileMetadata } from '../use-file-metadata'

// Mock File class since it's not available in Node.js environment
global.File = class File {
  name: string;
  size: number;
  type: string;

  constructor(bits: any[], name: string, options?: any) {
    this.name = name;
    this.size = bits.reduce((acc, bit) => acc + (bit.length || 0), 0);
    this.type = options?.type || '';
  }
} as any;

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-preview-url');
global.URL.revokeObjectURL = jest.fn();

describe('useFileMetadata', () => {
  it('should return empty array when files is null or undefined', () => {
    const { result: resultNull } = renderHook(() => useFileMetadata(null));
    expect(resultNull.current).toEqual([]);
    
    const { result: resultUndefined } = renderHook(() => useFileMetadata(undefined));
    expect(resultUndefined.current).toEqual([]);
  });
  
  it('should extract metadata from single file', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const { result } = renderHook(() => useFileMetadata(file));
    
    expect(result.current.length).toBe(1);
    expect(result.current[0].file).toBe(file);
    expect(result.current[0].extension).toBe('jpg');
    expect(result.current[0].mimeType).toBe('image/jpeg');
    expect(result.current[0].isImage).toBe(true);
    expect(result.current[0].formattedSize).toContain('B');
  });
  
  it('should extract metadata from file array', () => {
    const files = [
      new File(['image content'], 'image.jpg', { type: 'image/jpeg' }),
      new File(['pdf content'], 'document.pdf', { type: 'application/pdf' }),
    ];
    
    const { result } = renderHook(() => useFileMetadata(files));
    
    expect(result.current.length).toBe(2);
    expect(result.current[0].extension).toBe('jpg');
    expect(result.current[0].isImage).toBe(true);
    expect(result.current[1].extension).toBe('pdf');
    expect(result.current[1].isDocument).toBe(true);
    expect(result.current[1].isImage).toBe(false);
  });
  
  it('should generate preview URLs for images when enabled', () => {
    const files = [
      new File(['image content'], 'image.jpg', { type: 'image/jpeg' }),
      new File(['pdf content'], 'document.pdf', { type: 'application/pdf' }),
    ];
    
    const { result } = renderHook(() => useFileMetadata(files, { generatePreviews: true }));
    
    expect(result.current[0].previewUrl).toBe('mock-preview-url');
    // Non-image files shouldn't have preview URLs
    expect(result.current[1].previewUrl).toBeUndefined();
  });
  
  it('should revoke object URLs on unmount', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const { unmount } = renderHook(() => useFileMetadata(file, { generatePreviews: true }));
    
    unmount();
    
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-preview-url');
  });
  
  it('should detect file types correctly', () => {
    const files = [
      new File(['image content'], 'image.jpg', { type: 'image/jpeg' }),
      new File(['pdf content'], 'document.pdf', { type: 'application/pdf' }),
      new File(['text content'], 'document.txt', { type: 'text/plain' }),
      new File(['audio content'], 'audio.mp3', { type: 'audio/mpeg' }),
      new File(['video content'], 'video.mp4', { type: 'video/mp4' }),
    ];
    
    const { result } = renderHook(() => useFileMetadata(files));
    
    expect(result.current[0].isImage).toBe(true);
    expect(result.current[1].isDocument).toBe(true);
    expect(result.current[2].isDocument).toBe(true);
    expect(result.current[3].isAudio).toBe(true);
    expect(result.current[4].isVideo).toBe(true);
  });
  
  it('should format file sizes correctly', () => {
    const files = [
      new File(['a'.repeat(500)], 'small.txt', { type: 'text/plain' }),
      new File(['b'.repeat(1500)], 'medium.txt', { type: 'text/plain' }),
      new File(['c'.repeat(1500000)], 'large.txt', { type: 'text/plain' }),
    ];
    
    const { result } = renderHook(() => useFileMetadata(files));
    
    expect(result.current[0].formattedSize).toContain('B');
    expect(result.current[1].formattedSize).toContain('KB');
    expect(result.current[2].formattedSize).toContain('MB');
  });
});
